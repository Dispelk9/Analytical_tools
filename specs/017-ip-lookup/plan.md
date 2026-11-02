# 017 — IP lookup (origin & owner) — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

One new FastAPI router `POST /api/iplookup` that validates the input, resolves a hostname if
needed, then runs four independent lookups concurrently (thread pool, 5 s timeout each):

| Lookup | Source | Gives |
|---|---|---|
| RDAP | IANA bootstrap (`data.iana.org/rdap/ipv4.json` / `ipv6.json`, cached 24 h) → RIR RDAP server `…/ip/<ip>` | owner, network, registry, country, abuse e-mail |
| Origin AS | `stat.ripe.net/data/prefix-overview` | ASN, AS holder, announced prefix |
| Location | `stat.ripe.net/data/maxmind-geo-lite` | country, city, lat/long (MaxMind GeoLite2) |
| Reverse DNS | `socket.gethostbyaddr` | PTR hostname |

RDAP is required (502 if it fails); the other three are best effort and add a `warnings` entry.

Alternatives rejected:
- Port-43 WHOIS: free-text, different format per RIR, needs a parser per registry. RDAP is JSON.
- `ip-api.com` / `ipinfo.io`: free tiers are non-commercial or need a key.
- Local GeoLite2 DB file: needs a MaxMind licence key and periodic download.
- Team Cymru DNS for ASN: needs `dnspython` (new dependency).

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/api/tools/ip_lookup.py` | Router, `IpLookupRequest`, validation, resolver, fetchers, RDAP parser |
| Backend | `backend/main.py` | `app.include_router(ip_lookup_router, dependencies=protected_dependencies)` |
| Frontend | `frontend/src/pages/IpLookup.tsx` | Page, `authFetch`, key/value result table |
| Frontend | `frontend/src/App.css` | `.lookup-table`, `.lookup-warnings` using existing tokens |
| Frontend | `frontend/src/App.tsx` | `<Route path="/iplookup" …>` |
| Frontend | `frontend/src/data/toolThemes.ts` | `{ href: '/iplookup', label: 'IP Lookup' }` in theme `dns` |
| Tests | `backend/tests/test_ip_lookup.py` | AC-1…7, AC-11, AC-12 + parser unit tests |
| Tests | `frontend/src/test/pages/IpLookup.test.tsx` | AC-8, AC-9 |
| Tests | `frontend/src/test/components/Sidebar.test.tsx` | AC-10 |
| Docs | `README.md` | Tool list entry |

No new dependencies, no env vars, no DB changes.

## 3. Data model

```python
class IpLookupRequest(BaseModel):
    query: str = ""
```

```ts
interface IpLookupResponse {
  query: string; hostname: string | null; resolved_ips: string[];
  ip: string; version: 4 | 6;
  owner: string | null;
  network: { name: string | null; handle: string | null; cidr: string | null; start: string | null; end: string | null };
  registry: string | null; country: string | null;
  asn: { number: number; holder: string | null; prefix: string | null } | null;
  location: { country: string | null; city: string | null; latitude: number | null; longitude: number | null; source: string } | null;
  reverse_dns: string | null; abuse_email: string | null;
  warnings: string[];
  error?: string;
}
```

## 4. Request flow

```
IpLookup.tsx --authFetch POST /api/iplookup--> api/tools/ip_lookup.py
    validate → (resolve hostname) → is_global?
    ├─ RDAP (IANA bootstrap → RIR)        required → 502 on failure
    ├─ RIPEstat prefix-overview           optional → warning
    ├─ RIPEstat maxmind-geo-lite          optional → warning
    └─ gethostbyaddr                      optional → warning
                       HTTPException --> {"error": "..."}
```

## 5. Configuration

None. Outbound HTTPS to `data.iana.org`, `rdap.*` RIR servers and `stat.ripe.net` is required
from the backend container.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Probing / mapping internal networks | Only `is_global` addresses; check also after hostname resolution; user input never becomes a URL host |
| External service slow / down | 5 s timeouts, concurrent calls, partial results with warnings, 502 only when RDAP fails |
| RDAP formats differ per RIR (nested entities at ARIN/APNIC) | Recursive entity search; parser unit tests with RIPE- and ARIN-style payloads |
| Blocking DNS calls without timeout | Run in shared thread pool, `future.result(timeout=5)` |
| GeoLite2 accuracy | Labelled "approximate" with source in UI |

## 7. AGENTS.md checklist

- [x] Smallest viable change; no unrelated refactors or directory moves
- [x] No function names start with `_`
- [x] Small functions, explicit error handling (`HTTPException`), no hidden side effects
- [x] Frontend strongly typed (interfaces for request/response)
- [x] No hardcoded colors; reviewed in **light** and **dark** mode; WCAG AA contrast
- [x] No secrets / credentials; no unsafe command execution; parameterized SQL (n/a)
- [x] No silent API changes; backward compatibility stated in spec (additive)
- [x] New infrastructure has tests
