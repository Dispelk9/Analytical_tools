"""IP lookup: who owns an IP address and where it comes from (spec 017).

Sources (all free, no API key):
- RDAP via the IANA bootstrap -> owner, network, registry, country, abuse contact (required)
- RIPEstat prefix-overview     -> origin AS (best effort)
- RIPEstat maxmind-geo-lite    -> approximate location, MaxMind GeoLite2 data (best effort)
- reverse DNS (PTR)            -> hostname (best effort)
"""

import ipaddress
import logging
import re
import socket
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Optional
from urllib.parse import urlparse

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter(tags=["iplookup"])
logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 5
MAX_QUERY_LENGTH = 253
BOOTSTRAP_TTL_SECONDS = 24 * 60 * 60
BOOTSTRAP_URLS = {
    4: "https://data.iana.org/rdap/ipv4.json",
    6: "https://data.iana.org/rdap/ipv6.json",
}
RIPESTAT_URL = "https://stat.ripe.net/data/{call}/data.json"
RIPESTAT_SOURCEAPP = "act-ip-lookup"
LOCATION_SOURCE = "MaxMind GeoLite2 via RIPEstat"
HTTP_HEADERS = {"Accept": "application/rdap+json, application/json"}

REGISTRY_BY_HOST = {
    "rdap.db.ripe.net": "RIPE",
    "rdap.arin.net": "ARIN",
    "rdap.apnic.net": "APNIC",
    "rdap.lacnic.net": "LACNIC",
    "rdap.afrinic.net": "AFRINIC",
    "rdap.registro.br": "LACNIC",
}
REGISTRY_BY_WHOIS = {
    "whois.ripe.net": "RIPE",
    "whois.arin.net": "ARIN",
    "whois.apnic.net": "APNIC",
    "whois.lacnic.net": "LACNIC",
    "whois.afrinic.net": "AFRINIC",
    "whois.registro.br": "LACNIC",
}

HOSTNAME_LABEL = re.compile(r"^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$")

executor = ThreadPoolExecutor(max_workers=16, thread_name_prefix="iplookup")
bootstrap_cache: dict = {}
bootstrap_lock = threading.Lock()


IpAddress = ipaddress.IPv4Address | ipaddress.IPv6Address


class IpLookupRequest(BaseModel):
    query: str = ""


# ---------------------------------------------------------------------------
# Input validation and hostname resolution
# ---------------------------------------------------------------------------

def is_hostname(value: str) -> bool:
    """Strict DNS hostname check: >= 2 labels, alphabetic TLD, no all-numeric names."""
    name = value[:-1] if value.endswith(".") else value
    if not name or len(name) > MAX_QUERY_LENGTH:
        return False
    labels = name.split(".")
    if len(labels) < 2:
        return False
    if not all(HOSTNAME_LABEL.match(label) for label in labels):
        return False
    return bool(re.search(r"[A-Za-z]", labels[-1]))


def is_public(address: IpAddress) -> bool:
    return address.is_global and not address.is_multicast


def resolve_hostname(hostname: str) -> list[str]:
    """Return the unique addresses a hostname resolves to (raises OSError on failure)."""
    infos = socket.getaddrinfo(hostname, None, proto=socket.IPPROTO_TCP)
    addresses: list[str] = []
    for info in infos:
        address = info[4][0]
        if address not in addresses:
            addresses.append(address)
    return addresses


def resolve_with_timeout(hostname: str) -> list[str]:
    future = executor.submit(resolve_hostname, hostname)
    try:
        return future.result(timeout=TIMEOUT_SECONDS)
    except Exception as exc:
        logger.info("Hostname %s could not be resolved: %s", hostname, exc)
        raise HTTPException(status_code=400, detail="Could not resolve hostname") from exc


def parse_query(query: str) -> tuple[Optional[str], list[str], IpAddress]:
    """Validate the input and return (hostname, resolved_ips, address to look up)."""
    try:
        address = ipaddress.ip_address(query)
    except ValueError:
        address = None

    if address is not None:
        if not is_public(address):
            raise HTTPException(status_code=400, detail="Not a public IP address")
        return None, [], address

    if not is_hostname(query):
        raise HTTPException(status_code=400, detail="Invalid IP address or hostname")

    resolved = resolve_with_timeout(query)
    for candidate in resolved:
        try:
            parsed = ipaddress.ip_address(candidate.split("%")[0])
        except ValueError:
            continue
        if is_public(parsed):
            return query, resolved, parsed
    raise HTTPException(status_code=400, detail="Not a public IP address")


# ---------------------------------------------------------------------------
# RDAP
# ---------------------------------------------------------------------------

def load_bootstrap(version: int) -> list:
    """IANA RDAP bootstrap services for IPv4/IPv6, cached in memory for 24 h."""
    with bootstrap_lock:
        cached = bootstrap_cache.get(version)
        if cached and time.monotonic() - cached[0] < BOOTSTRAP_TTL_SECONDS:
            return cached[1]
    response = requests.get(BOOTSTRAP_URLS[version], timeout=TIMEOUT_SECONDS)
    response.raise_for_status()
    services = response.json()["services"]
    with bootstrap_lock:
        bootstrap_cache[version] = (time.monotonic(), services)
    return services


def find_rdap_base(address: IpAddress, services: list) -> Optional[str]:
    """Pick the RDAP base URL of the most specific bootstrap prefix that contains the address."""
    best_url = None
    best_length = -1
    for prefixes, urls in services:
        https_urls = [url for url in urls if url.startswith("https://")]
        if not https_urls:
            continue
        for prefix in prefixes:
            network = ipaddress.ip_network(prefix, strict=False)
            if network.version == address.version and address in network and network.prefixlen > best_length:
                best_url = https_urls[0]
                best_length = network.prefixlen
    return best_url


def fetch_rdap(address: IpAddress) -> tuple[dict, str]:
    """Return (RDAP JSON, final URL) for the address."""
    base = find_rdap_base(address, load_bootstrap(address.version))
    if not base:
        raise LookupError(f"No RDAP server for {address}")
    url = f"{base.rstrip('/')}/ip/{address}"
    response = requests.get(url, headers=HTTP_HEADERS, timeout=TIMEOUT_SECONDS)
    response.raise_for_status()
    return response.json(), response.url


def vcard_values(entity: dict, field: str) -> list[str]:
    vcard = entity.get("vcardArray")
    if not isinstance(vcard, list) or len(vcard) < 2:
        return []
    return [item[3] for item in vcard[1] if isinstance(item, list) and len(item) >= 4 and item[0] == field]


def walk_entities(entities: list):
    """Yield every entity, including nested ones (ARIN/APNIC nest contacts under the org)."""
    for entity in entities or []:
        yield entity
        yield from walk_entities(entity.get("entities", []))


def first_remark(rdap: dict) -> Optional[str]:
    for remark in rdap.get("remarks", []) or []:
        for line in remark.get("description", []) or []:
            if line and line.strip():
                return line.strip()
    return None


def find_owner(rdap: dict) -> Optional[str]:
    """Registrant organisation, else any registrant, else the network's first remark (AFRINIC)."""
    registrants = [e for e in walk_entities(rdap.get("entities", [])) if "registrant" in e.get("roles", [])]
    organisations = [e for e in registrants if "org" in vcard_values(e, "kind")]
    for entity in organisations + registrants:
        names = vcard_values(entity, "fn")
        if names and names[0]:
            return names[0]
    return first_remark(rdap)


def find_abuse_email(entities: list) -> Optional[str]:
    for entity in walk_entities(entities):
        if "abuse" in entity.get("roles", []):
            emails = vcard_values(entity, "email")
            if emails:
                return emails[0]
    return None


def network_cidr(rdap: dict) -> Optional[str]:
    cidrs = []
    for item in rdap.get("cidr0_cidrs", []) or []:
        prefix = item.get("v4prefix") or item.get("v6prefix")
        if prefix and item.get("length") is not None:
            cidrs.append(f"{prefix}/{item['length']}")
    if cidrs:
        return ", ".join(cidrs)
    start, end = rdap.get("startAddress"), rdap.get("endAddress")
    if not start or not end:
        return None
    try:
        networks = ipaddress.summarize_address_range(ipaddress.ip_address(start), ipaddress.ip_address(end))
        return ", ".join(str(network) for network in networks)
    except (ValueError, TypeError):
        return None


def registry_name(rdap: dict, url: str) -> Optional[str]:
    host = urlparse(url).hostname or ""
    return REGISTRY_BY_HOST.get(host) or REGISTRY_BY_WHOIS.get(rdap.get("port43") or "")


def parse_rdap(rdap: dict, url: str) -> dict:
    entities = rdap.get("entities", [])
    return {
        "owner": find_owner(rdap),
        "network": {
            "name": rdap.get("name"),
            "handle": rdap.get("handle"),
            "cidr": network_cidr(rdap),
            "start": rdap.get("startAddress"),
            "end": rdap.get("endAddress"),
        },
        "registry": registry_name(rdap, url),
        "country": rdap.get("country"),
        "abuse_email": find_abuse_email(entities),
    }


# ---------------------------------------------------------------------------
# RIPEstat and reverse DNS
# ---------------------------------------------------------------------------

def ripestat(call: str, resource: str) -> dict:
    response = requests.get(
        RIPESTAT_URL.format(call=call),
        params={"resource": resource, "sourceapp": RIPESTAT_SOURCEAPP},
        timeout=TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json().get("data") or {}


def fetch_asn(address: IpAddress) -> Optional[dict]:
    data = ripestat("prefix-overview", str(address))
    asns = data.get("asns") or []
    if not asns:
        return None
    return {"number": asns[0].get("asn"), "holder": asns[0].get("holder"), "prefix": data.get("resource")}


def is_unknown_location(location: dict) -> bool:
    """GeoLite2 reports anycast / unmapped ranges as country "?" at 0,0."""
    country = location.get("country") or "?"
    return country == "?" and not location.get("latitude") and not location.get("longitude")


def fetch_location(address: IpAddress) -> Optional[dict]:
    data = ripestat("maxmind-geo-lite", str(address))
    for resource in data.get("located_resources") or []:
        for location in resource.get("locations") or []:
            if is_unknown_location(location):
                continue
            return {
                "country": location.get("country") or None,
                "city": location.get("city") or None,
                "latitude": location.get("latitude"),
                "longitude": location.get("longitude"),
                "source": LOCATION_SOURCE,
            }
    return None


def reverse_dns(address: IpAddress) -> Optional[str]:
    try:
        return socket.gethostbyaddr(str(address))[0]
    except (socket.herror, socket.gaierror):
        return None


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

def collect(future, label: str, warnings: list[str]):
    """Return the result of a best-effort lookup, or None plus a warning."""
    try:
        result = future.result(timeout=TIMEOUT_SECONDS)
    except Exception as exc:
        logger.warning("IP lookup: %s failed: %s", label, exc)
        warnings.append(f"{label} lookup failed")
        return None
    if result is None:
        warnings.append(f"No {label} data found")
    return result


@router.post("/api/iplookup")
def ip_lookup(payload: IpLookupRequest):
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Missing or empty 'query' field")
    if len(query) > MAX_QUERY_LENGTH:
        raise HTTPException(status_code=400, detail="Invalid IP address or hostname")

    hostname, resolved_ips, address = parse_query(query)
    started = time.monotonic()

    rdap_future = executor.submit(fetch_rdap, address)
    asn_future = executor.submit(fetch_asn, address)
    location_future = executor.submit(fetch_location, address)
    ptr_future = executor.submit(reverse_dns, address)

    try:
        rdap, rdap_url = rdap_future.result(timeout=TIMEOUT_SECONDS * 2)
        rdap_info = parse_rdap(rdap, rdap_url)
    except Exception as exc:
        logger.warning("IP lookup: RDAP failed for %s: %s", address, exc)
        raise HTTPException(status_code=502, detail="RDAP lookup failed") from exc

    warnings: list[str] = []
    asn = collect(asn_future, "AS", warnings)
    location = collect(location_future, "location", warnings)
    ptr = collect(ptr_future, "reverse DNS (PTR)", warnings)

    logger.info(
        "IP lookup %s (%s) registry=%s in %.2fs",
        address, query, rdap_info["registry"], time.monotonic() - started,
    )
    return {
        "query": query,
        "hostname": hostname,
        "resolved_ips": resolved_ips,
        "ip": str(address),
        "version": address.version,
        **rdap_info,
        "asn": asn,
        "location": location,
        "reverse_dns": ptr,
        "warnings": warnings,
    }
