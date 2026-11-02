# 017 — IP lookup (origin & owner)

- **Status:** Done
- **Author:** Viet Hoang
- **Created:** 2026-11-02
- **Related:** `backend/api/tools/smtp_handler.py` (similar network tool), spec 005

## 1. Context / Problem

Operators regularly see unknown IP addresses (mail logs, Checkmk alerts, firewall/nginx logs,
e.g. `195.34.67.210`) and need to know **where the address comes from and who owns it**.
Today this means leaving ACT and using `whois`/web services by hand. ACT should answer this
in one step, next to the existing SMTP and DNS tools.

## 2. Goals

- For a given public IPv4 / IPv6 address **or a hostname** (resolved to its first public
  address), show:
  - **Owner:** organisation / network holder name (RDAP registrant; if a registry publishes no
    registrant, e.g. AFRINIC, the network's first remark line), network name and handle
  - **Network:** CIDR range (start–end) the address belongs to
  - **Registry:** responsible RIR (RIPE, ARIN, APNIC, LACNIC, AFRINIC)
  - **Origin AS:** ASN and AS holder name announcing the prefix
  - **Country:** registered country code of the network
  - **Location:** approximate country / city / coordinates (MaxMind GeoLite2 data, served free
    and key-less by the RIPEstat `maxmind-geo-lite` data call). Anycast / unmapped ranges
    (GeoLite2 country `?` at 0,0, e.g. `1.1.1.1`) are reported as no location + warning.
  - **Reverse DNS:** PTR hostname, if any
  - **Abuse contact:** abuse e-mail, if published
- Use only free, key-less, authoritative sources: **RDAP** (the standard successor of WHOIS,
  via the IANA bootstrap) for owner/network/country/abuse, and **RIPEstat Data API** for the
  origin AS and approximate location (works for all regions, not only RIPE).
- Partial results: if one source fails (e.g. no PTR, RIPEstat down), still return the rest and
  say which part is missing.
- It has to be legally checked, not some kind of recon through their server.

## 3. Non-goals (out of scope)

- Paid / licensed GeoIP databases or API keys; location precision beyond GeoLite2.
- Bulk lookups, history, caching in the database, reputation/blacklist checks.
- Raw port-43 WHOIS text output.

## 4. User stories

- As an **operator**, I want to paste an IP address and see its owner, network, AS and
  country, so that I can decide quickly whether traffic is legitimate and whom to contact.
- As an **operator**, I want the abuse contact of the network, so that I can report abuse.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** `query` missing or blank, **when** `POST /api/iplookup`, **then** `400 {"error": "Missing or empty 'query' field"}` | `backend/tests/test_ip_lookup.py::test_ip_lookup_requires_query` |
| AC-2 | **Given** input that is neither an IP nor a hostname (e.g. `999.1.1.1`, `abc`, `a b`), **then** `400 {"error": "Invalid IP address or hostname"}` and no external call is made | `test_ip_lookup.py::test_ip_lookup_rejects_invalid_input` |
| AC-3 | **Given** a private / loopback / link-local / reserved address (e.g. `10.0.0.1`, `127.0.0.1`), **then** `400 {"error": "Not a public IP address"}` and no external call is made | `test_ip_lookup.py::test_ip_lookup_rejects_non_public_ip` |
| AC-4 | **Given** a public IPv4 (e.g. `195.34.67.210`) with mocked RDAP + RIPEstat + PTR, **then** `200` with `owner`, `network`, `registry`, `asn`, `country`, `location`, `reverse_dns`, `abuse_email` filled from the mocked data | `test_ip_lookup.py::test_ip_lookup_ipv4_success`, `test_ip_lookup.py::test_parse_rdap_*`, `test_ip_lookup.py::test_fetch_*` |
| AC-5 | **Given** a public IPv6 address, **then** it is handled like AC-4 | `test_ip_lookup.py::test_ip_lookup_ipv6_success` |
| AC-6 | **Given** RDAP succeeds but RIPEstat (AS or location) or PTR fails, **then** `200` with those fields `null` and a message listed in `warnings` | `test_ip_lookup.py::test_ip_lookup_partial_result` |
| AC-7 | **Given** RDAP fails or times out, **then** `502 {"error": "RDAP lookup failed"}` | `test_ip_lookup.py::test_ip_lookup_rdap_failure` |
| AC-8 | **Given** the IP Lookup page, **when** the user enters an IP and clicks "Lookup", **then** owner, network, AS, country, location, reverse DNS and abuse contact are rendered | `frontend/src/test/pages/IpLookup.test.tsx` |
| AC-9 | **Given** the backend returns an error, **then** the page shows the backend's `error` message | `frontend/src/test/pages/IpLookup.test.tsx` |
| AC-10 | **Given** the sidebar, **then** the DNS theme contains an "IP Lookup" tile linking to `/iplookup` | `frontend/src/test/components/Sidebar.test.tsx` |
| AC-11 | **Given** a hostname (e.g. `example.com`), **then** it is resolved and the first public address is looked up; response has `hostname` and `resolved_ips` | `test_ip_lookup.py::test_ip_lookup_hostname_success` |
| AC-12 | **Given** a hostname that does not resolve, **then** `400 {"error": "Could not resolve hostname"}`; if it resolves only to non-public addresses, **then** `400 {"error": "Not a public IP address"}` | `test_ip_lookup.py::test_ip_lookup_hostname_unresolvable`, `test_ip_lookup.py::test_ip_lookup_hostname_private_only` |

## 6. API contract (backend)

```http
POST /api/iplookup
Content-Type: application/json
Authorization: Bearer <keycloak token>   # added by authFetch()

{ "query": "195.34.67.210" }      // or { "query": "example.com" }
```

Response `200` (values illustrative):

```json
{
  "query": "195.34.67.210",
  "hostname": null,
  "resolved_ips": [],
  "ip": "195.34.67.210",
  "version": 4,
  "owner": "Example Telecom GmbH",
  "network": {
    "name": "EXAMPLE-NET",
    "handle": "195.34.64.0 - 195.34.71.255",
    "cidr": "195.34.64.0/21",
    "start": "195.34.64.0",
    "end": "195.34.71.255"
  },
  "registry": "RIPE",
  "country": "AT",
  "asn": { "number": 12345, "holder": "EXAMPLE-AS - Example Telecom GmbH", "prefix": "195.34.64.0/19" },
  "location": { "country": "AT", "city": "Vienna", "latitude": 48.2, "longitude": 16.37, "source": "MaxMind GeoLite2 via RIPEstat" },
  "reverse_dns": "host-195-34-67-210.example.net",
  "abuse_email": "abuse@example.net",
  "warnings": []
}
```

Errors (shape produced by the global handler in `backend/main.py`):

| Status | When | Body |
|---|---|---|
| 400 | Missing / blank `query` | `{ "error": "Missing or empty 'query' field" }` |
| 400 | Neither a valid IPv4/IPv6 address nor a hostname | `{ "error": "Invalid IP address or hostname" }` |
| 400 | Hostname does not resolve | `{ "error": "Could not resolve hostname" }` |
| 400 | Private, loopback, link-local, multicast or reserved address | `{ "error": "Not a public IP address" }` |
| 401 | Not authenticated (Keycloak) | `{ "error": "..." }` |
| 502 | RDAP unreachable, timed out, or returned no data | `{ "error": "RDAP lookup failed" }` |

- **Auth:** protected (`protected_dependencies`) — same as the other tools.
- **Backward compatibility:** additive only (new endpoint, new page, new tile).

## 7. UI / UX (frontend)

- **Route:** `/iplookup` in `frontend/src/App.tsx`, page `frontend/src/pages/IpLookup.tsx`
- **Navigation:** tile `{ href: '/iplookup', label: 'IP Lookup' }` in theme `dns` of
  `frontend/src/data/toolThemes.ts`
- **Components:** Porsche Design System (`PTextFieldWrapper`, `PButton`, `PText`) +
  `LatticeLoader` while loading; result as a simple key/value table; Enter key submits.
- **States:** empty, loading, success (with `warnings` shown as a note), error (backend `error`)
- **Light & dark mode:** colors only via existing `var(--...)` tokens from
  `frontend/src/index.css`. New tokens needed: none expected.

## 8. Non-functional requirements

- **Security:**
  - Input validated with Python `ipaddress` / a strict hostname check; only global (public)
    addresses are looked up (also after hostname resolution), so the tool cannot be used to
    map internal ranges. Max input length 253 characters.
  - The backend only calls fixed hosts: `data.iana.org` (RDAP bootstrap), the RIR RDAP servers
    listed in it, and `stat.ripe.net`. The user input is never used as a URL host.
  - No API keys or secrets required.
- **Performance:** timeout 5 s per external call; RDAP, RIPEstat (AS + location) and PTR run concurrently →
  worst case ~5–10 s. IANA bootstrap file cached in memory (refresh every 24 h).
- **Dependencies:** none new (`requests`, `ipaddress`, `socket`, `concurrent.futures`).
- **Observability:** `logging.info` per lookup (IP + RIR + duration); failures of each source
  logged as warnings.
- **Outbound network:** backend container needs HTTPS egress to the hosts above.

## 9. Open questions

- [x] Is country-level location (from RDAP registration) enough, or do you want city /
      geolocation? That needs e.g. MaxMind GeoLite2 (free but license key + DB file) or a
      third-party API — owner: Viet Hoang
      It should be free, using public database of any legal sites.

- [x] Place the tile under **DNS** (proposed) or a new **Network** theme? — owner: Viet Hoang
      DNS is fine
- [x] Should a hostname also be accepted (resolve → then lookup)? Proposed as follow-up. — owner: Viet Hoang
      If reverse lookup work, then sure.

**Resolution:** location uses MaxMind GeoLite2 data through the free, key-less RIPEstat
`maxmind-geo-lite` data call (no licence key, no extra host). Tile under DNS. Hostnames are
accepted (AC-11, AC-12); reverse DNS (PTR) is returned for every lookup.
