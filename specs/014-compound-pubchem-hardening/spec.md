# 014 — Compound search: faster, bounded PubChem calls

- **Status:** Draft
- **Priority:** P3
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [002 Compound search](../002-compound-search/spec.md)

## 1. Context / Problem

- Details for up to 10 CIDs are fetched one by one with `pubchempy` (no timeout) plus a 0.33 s sleep each → ≥ 3.3 s per request, and a hung PubChem call blocks a server thread forever.
- The result list is stored in the session cookie (`request.session["list_of_compounds"]`) but never read; it can exceed the ~4 KB cookie limit and is sent back with every request.
- PubChem error tests are missing.

## 2. Goals

- One batched PubChem property request for all CIDs, with timeouts.
- Remove the unused session storage.
- Same response shape as today.

## 3. Non-goals

- Caching results, more than 10 results.

## 4. User stories

- As a **lab user**, I want compound results in about one second, so that I can iterate quickly.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** PubChem returns 10 CIDs, **then** exactly 2 HTTP calls are made (CID range + batched properties) and the response shape matches spec 002 | `backend/tests/test_compound.py::test_compound_uses_batched_property_lookup` |
| AC-2 | **Given** a PubChem call exceeds the timeout, **then** `504 {"error": "PubChem did not respond in time"}` | `test_compound.py::test_compound_timeout` |
| AC-3 | **Given** PubChem `PUGREST.NotFound`, **then** `404 {"error": "No compounds found in this mass range"}` | `test_compound.py::test_compound_not_found` |
| AC-4 | **Given** PubChem unreachable / invalid JSON, **then** `502 {"error": "PubChem unavailable"}` | `test_compound.py::test_compound_upstream_errors` |
| AC-5 | **Given** a successful request, **then** no `list_of_compounds` key in the session / `Set-Cookie` size unchanged | `test_compound.py::test_compound_does_not_store_results_in_session` |
| AC-6 | Frontend still renders results | `frontend/src/test/pages/Compound.test.tsx` |

## 6. API contract

Success shape unchanged (spec 002). `exact_mass` stays a string as returned by PubChem.

| Status | When | Body |
|---|---|---|
| 404 | No compounds | `{ "error": "No compounds found in this mass range" }` |
| 502 | PubChem error / invalid JSON | `{ "error": "PubChem unavailable" }` |
| 504 | Timeout | `{ "error": "PubChem did not respond in time" }` |

Backward compatibility: 404 body changes from the raw PubChem fault object to a string; PubChem errors change from `500` to `502`/`504`. Frontend only shows `error` → verify.

## 7. UI / UX

- No change; check 404/502/504 messages in light and dark mode.

## 8. Non-functional requirements

- Timeout 10 s per PubChem call; total ≤ 2 calls (PubChem limit 5 req/s respected).

## 9. Open questions

- [ ] Can `pubchempy` be dropped from `requirements.txt` afterwards? (Removal — ask.)
