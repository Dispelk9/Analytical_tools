# 014 — Compound search: faster, bounded PubChem calls — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — Unit tests for `pubchem_client.py` (parsing, not-found, timeout, bad JSON)
- [ ] T2 — Implement `pubchem_client.py`
- [ ] T3 — Failing route tests AC-1 … AC-5
- [ ] T4 — Refactor `compound.py` to use the client; remove session write and sleep
- [ ] T5 — `pytest backend/tests` passes

## Frontend

- [ ] T6 — Confirm `Compound.test.tsx` passes; check error messages in light and dark mode

## Wrap-up

- [ ] T7 — Real query in debug stack (e.g. glucose: AD 1.007276, OB 181.0707, ME 5)
- [ ] T8 — Update spec 002; set `Status: Done`
