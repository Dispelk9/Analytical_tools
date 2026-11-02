"""Tests for spec 017 — IP lookup. All external calls are monkeypatched."""

import ipaddress
import socket

import pytest

from api.tools import ip_lookup


MODULE = "api.tools.ip_lookup"

RIPE_RDAP = {
    "handle": "195.34.67.0 - 195.34.67.255",
    "name": "NET-CA",
    "country": "CA",
    "startAddress": "195.34.67.0",
    "endAddress": "195.34.67.255",
    "cidr0_cidrs": [{"v4prefix": "195.34.67.0", "length": 24}],
    "port43": "whois.ripe.net",
    "entities": [
        {
            "handle": "HHN35-RIPE",
            "roles": ["administrative", "technical"],
            "vcardArray": ["vcard", [["fn", {}, "text", "Huize Holdings NOC"], ["kind", {}, "text", "group"]]],
        },
        {
            "handle": "intermanaged",
            "roles": ["registrant"],
            "vcardArray": ["vcard", [["fn", {}, "text", "intermanaged"], ["kind", {}, "text", "individual"]]],
        },
        {
            "handle": "ORG-HHL15-RIPE",
            "roles": ["registrant"],
            "vcardArray": ["vcard", [["fn", {}, "text", "Huize Holdings LLC"], ["kind", {}, "text", "org"]]],
        },
        {
            "handle": "ACRO49689-RIPE",
            "roles": ["abuse"],
            "vcardArray": ["vcard", [["fn", {}, "text", "Abuse contact"], ["email", {"type": "abuse"}, "text", "abuse@example.net"]]],
        },
    ],
}

ARIN_RDAP = {
    "handle": "NET6-2001-4860-1",
    "name": "GOOGLE-IPV6",
    "startAddress": "2001:4860::",
    "endAddress": "2001:4860:ffff:ffff:ffff:ffff:ffff:ffff",
    "port43": "whois.arin.net",
    "entities": [
        {
            "handle": "GOGL",
            "roles": ["registrant"],
            "vcardArray": ["vcard", [["fn", {}, "text", "Google LLC"], ["kind", {}, "text", "org"]]],
            "entities": [
                {
                    "handle": "ABUSE5250-ARIN",
                    "roles": ["abuse"],
                    "vcardArray": ["vcard", [["fn", {}, "text", "Abuse"], ["email", {}, "text", "network-abuse@google.com"]]],
                }
            ],
        }
    ],
}

ASN = {"number": 400992, "holder": "ZHOUYISAT-COMMUNICATIONS", "prefix": "195.34.67.0/24"}
LOCATION = {"country": "CA", "city": "Vancouver", "latitude": 49.28, "longitude": -123.04, "source": ip_lookup.LOCATION_SOURCE}


def fail(*args, **kwargs):
    raise AssertionError("external call must not happen")


@pytest.fixture()
def no_external_calls(monkeypatch):
    for name in ("fetch_rdap", "fetch_asn", "fetch_location", "reverse_dns", "resolve_hostname"):
        monkeypatch.setattr(f"{MODULE}.{name}", fail)


@pytest.fixture()
def mocked_sources(monkeypatch):
    def fake_rdap(address):
        if address.version == 6:
            return ARIN_RDAP, "https://rdap.arin.net/registry/ip/2001:4860:4860::8888"
        return RIPE_RDAP, "https://rdap.db.ripe.net/ip/195.34.67.210"

    monkeypatch.setattr(f"{MODULE}.fetch_rdap", fake_rdap)
    monkeypatch.setattr(f"{MODULE}.fetch_asn", lambda address: ASN)
    monkeypatch.setattr(f"{MODULE}.fetch_location", lambda address: LOCATION)
    monkeypatch.setattr(f"{MODULE}.reverse_dns", lambda address: "host.example.net")


# AC-1
@pytest.mark.parametrize("body", [{}, {"query": ""}, {"query": "   "}])
def test_ip_lookup_requires_query(client, body, no_external_calls):
    response = client.post("/api/iplookup", json=body)

    assert response.status_code == 400
    assert response.json() == {"error": "Missing or empty 'query' field"}


# AC-2
@pytest.mark.parametrize("query", ["999.1.1.1", "abc", "a b", "1.2.3", "-bad.example.com", "x" * 300])
def test_ip_lookup_rejects_invalid_input(client, query, no_external_calls):
    response = client.post("/api/iplookup", json={"query": query})

    assert response.status_code == 400
    assert response.json() == {"error": "Invalid IP address or hostname"}


# AC-3
@pytest.mark.parametrize("query", ["10.0.0.1", "127.0.0.1", "192.168.1.1", "169.254.1.1", "::1", "fe80::1", "224.0.0.1", "100.64.0.1"])
def test_ip_lookup_rejects_non_public_ip(client, query, no_external_calls):
    response = client.post("/api/iplookup", json={"query": query})

    assert response.status_code == 400
    assert response.json() == {"error": "Not a public IP address"}


# AC-4
def test_ip_lookup_ipv4_success(client, mocked_sources):
    response = client.post("/api/iplookup", json={"query": " 195.34.67.210 "})

    assert response.status_code == 200
    assert response.json() == {
        "query": "195.34.67.210",
        "hostname": None,
        "resolved_ips": [],
        "ip": "195.34.67.210",
        "version": 4,
        "owner": "Huize Holdings LLC",
        "network": {
            "name": "NET-CA",
            "handle": "195.34.67.0 - 195.34.67.255",
            "cidr": "195.34.67.0/24",
            "start": "195.34.67.0",
            "end": "195.34.67.255",
        },
        "registry": "RIPE",
        "country": "CA",
        "abuse_email": "abuse@example.net",
        "asn": ASN,
        "location": LOCATION,
        "reverse_dns": "host.example.net",
        "warnings": [],
    }


# AC-5
def test_ip_lookup_ipv6_success(client, mocked_sources):
    response = client.post("/api/iplookup", json={"query": "2001:4860:4860::8888"})

    body = response.json()
    assert response.status_code == 200
    assert body["version"] == 6
    assert body["owner"] == "Google LLC"
    assert body["registry"] == "ARIN"
    assert body["abuse_email"] == "network-abuse@google.com"
    assert body["network"]["cidr"] == "2001:4860::/32"


# AC-6
def test_ip_lookup_partial_result(client, mocked_sources, monkeypatch):
    def broken(address):
        raise ConnectionError("down")

    monkeypatch.setattr(f"{MODULE}.fetch_asn", broken)
    monkeypatch.setattr(f"{MODULE}.fetch_location", broken)
    monkeypatch.setattr(f"{MODULE}.reverse_dns", lambda address: None)

    response = client.post("/api/iplookup", json={"query": "195.34.67.210"})

    body = response.json()
    assert response.status_code == 200
    assert body["owner"] == "Huize Holdings LLC"
    assert body["asn"] is None
    assert body["location"] is None
    assert body["reverse_dns"] is None
    assert body["warnings"] == [
        "AS lookup failed",
        "location lookup failed",
        "No reverse DNS (PTR) data found",
    ]


# AC-7
def test_ip_lookup_rdap_failure(client, mocked_sources, monkeypatch):
    def broken(address):
        raise TimeoutError("timed out")

    monkeypatch.setattr(f"{MODULE}.fetch_rdap", broken)

    response = client.post("/api/iplookup", json={"query": "195.34.67.210"})

    assert response.status_code == 502
    assert response.json() == {"error": "RDAP lookup failed"}


# AC-11
def test_ip_lookup_hostname_success(client, mocked_sources, monkeypatch):
    monkeypatch.setattr(f"{MODULE}.resolve_hostname", lambda name: ["10.0.0.5", "195.34.67.210"])

    response = client.post("/api/iplookup", json={"query": "www.example.com"})

    body = response.json()
    assert response.status_code == 200
    assert body["hostname"] == "www.example.com"
    assert body["resolved_ips"] == ["10.0.0.5", "195.34.67.210"]
    assert body["ip"] == "195.34.67.210"
    assert body["owner"] == "Huize Holdings LLC"


# AC-12
def test_ip_lookup_hostname_unresolvable(client, monkeypatch):
    def unresolvable(name):
        raise socket.gaierror("Name or service not known")

    monkeypatch.setattr(f"{MODULE}.resolve_hostname", unresolvable)
    monkeypatch.setattr(f"{MODULE}.fetch_rdap", fail)

    response = client.post("/api/iplookup", json={"query": "does-not-exist.example"})

    assert response.status_code == 400
    assert response.json() == {"error": "Could not resolve hostname"}


# AC-12
def test_ip_lookup_hostname_private_only(client, monkeypatch):
    monkeypatch.setattr(f"{MODULE}.resolve_hostname", lambda name: ["10.1.2.3", "fd00::1"])
    monkeypatch.setattr(f"{MODULE}.fetch_rdap", fail)

    response = client.post("/api/iplookup", json={"query": "intranet.example.com"})

    assert response.status_code == 400
    assert response.json() == {"error": "Not a public IP address"}


# AC-4 / AC-5 — RDAP parsing across registry formats
def test_parse_rdap_ripe_prefers_org_registrant():
    info = ip_lookup.parse_rdap(RIPE_RDAP, "https://rdap.db.ripe.net/ip/195.34.67.210")

    assert info["owner"] == "Huize Holdings LLC"
    assert info["abuse_email"] == "abuse@example.net"
    assert info["registry"] == "RIPE"


def test_parse_rdap_arin_nested_entities_and_range_cidr():
    info = ip_lookup.parse_rdap(ARIN_RDAP, "https://rdap.arin.net/registry/ip/2001:4860::")

    assert info["owner"] == "Google LLC"
    assert info["abuse_email"] == "network-abuse@google.com"
    assert info["network"]["cidr"] == "2001:4860::/32"


def test_parse_rdap_registry_falls_back_to_port43():
    info = ip_lookup.parse_rdap({"port43": "whois.apnic.net"}, "https://rdap.example.org/ip/1.1.1.1")

    assert info["registry"] == "APNIC"
    assert info["owner"] is None
    assert info["network"]["cidr"] is None


def test_find_rdap_base_picks_most_specific_https_prefix():
    services = [
        [["195.0.0.0/8"], ["http://rdap.other.net/", "https://rdap.other.net/"]],
        [["195.34.0.0/16"], ["https://rdap.db.ripe.net/"]],
        [["2001:4860::/32"], ["https://rdap.arin.net/registry/"]],
    ]

    assert ip_lookup.find_rdap_base(ipaddress.ip_address("195.34.67.210"), services) == "https://rdap.db.ripe.net/"
    assert ip_lookup.find_rdap_base(ipaddress.ip_address("195.1.1.1"), services) == "https://rdap.other.net/"
    assert ip_lookup.find_rdap_base(ipaddress.ip_address("8.8.8.8"), services) is None


def test_fetch_location_maps_ripestat_payload(monkeypatch):
    payload = {"located_resources": [{"locations": [{"country": "CA", "city": "", "latitude": 49.2, "longitude": -123.0}]}]}
    monkeypatch.setattr(f"{MODULE}.ripestat", lambda call, resource: payload)

    location = ip_lookup.fetch_location(ipaddress.ip_address("195.34.67.210"))

    assert location == {"country": "CA", "city": None, "latitude": 49.2, "longitude": -123.0, "source": ip_lookup.LOCATION_SOURCE}


def test_fetch_asn_maps_ripestat_payload(monkeypatch):
    payload = {"resource": "195.34.67.0/24", "asns": [{"asn": 400992, "holder": "ZHOUYISAT"}]}
    monkeypatch.setattr(f"{MODULE}.ripestat", lambda call, resource: payload)

    assert ip_lookup.fetch_asn(ipaddress.ip_address("195.34.67.210")) == {
        "number": 400992, "holder": "ZHOUYISAT", "prefix": "195.34.67.0/24",
    }


def test_parse_rdap_lacnic_registro_br_maps_to_lacnic():
    info = ip_lookup.parse_rdap({"port43": "whois.registro.br"}, "https://rdap.registro.br/ip/200.160.2.3")

    assert info["registry"] == "LACNIC"


def test_parse_rdap_owner_falls_back_to_remark_without_registrant():
    rdap = {
        "port43": "whois.afrinic.net",
        "remarks": [{"title": "Remark", "description": ["Vodacom Business (ASN 36994)"]}],
        "entities": [{"roles": ["technical"], "vcardArray": ["vcard", [["fn", {}, "text", "Some Person"]]]}],
    }

    info = ip_lookup.parse_rdap(rdap, "https://rdap.afrinic.net/rdap/ip/41.0.0.1")

    assert info["owner"] == "Vodacom Business (ASN 36994)"
    assert info["registry"] == "AFRINIC"


def test_fetch_location_ignores_unknown_anycast_location(monkeypatch):
    payload = {"located_resources": [{"locations": [{"country": "?", "city": "", "latitude": 0.0, "longitude": 0.0}]}]}
    monkeypatch.setattr(f"{MODULE}.ripestat", lambda call, resource: payload)

    assert ip_lookup.fetch_location(ipaddress.ip_address("1.1.1.1")) is None
