# 017 — IP lookup (origin & owner) — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [x] T1 — Tests for AC-1…7, AC-11, AC-12 in `backend/tests/test_ip_lookup.py` (external calls monkeypatched)
- [x] T2 — Router, validation, resolver, fetchers and RDAP parser in `backend/api/tools/ip_lookup.py`
- [x] T3 — Register router in `create_app()` (`backend/main.py`)
- [x] T4 — `pytest backend/tests` passes

## Frontend

- [x] T5 — Tests for AC-8, AC-9 in `frontend/src/test/pages/IpLookup.test.tsx`; AC-10 in `Sidebar.test.tsx`
- [x] T6 — Page `frontend/src/pages/IpLookup.tsx` + styles in `App.css` (tokens only)
- [x] T7 — Route in `App.tsx` + tile in `data/toolThemes.ts`
- [x] T8 — Review in **light** and **dark** mode — by WCAG contrast calculation of every token pair used (no browser in the dev environment); links switched from `--link` (4.43:1 in dark) to `--accent` (8.5:1 dark / 5.9:1 light). Visual check in a real browser still recommended.
- [x] T9 — `npm run lint` and `npm run test:run` pass

## Wrap-up

- [x] T10 — Live smoke test against real RDAP / RIPEstat (e.g. `195.34.67.210`, `2001:4860:4860::8888`, `example.com`) — done for all 5 RIRs (RIPE, ARIN, APNIC, LACNIC/registro.br, AFRINIC)
- [x] T11 — README tool list updated
- [x] T12 — Every AC in spec.md links to a passing test; set `Status: Done`
