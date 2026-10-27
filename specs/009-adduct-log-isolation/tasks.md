# 009 — Adduct: per-request logs and visible DB errors — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — Failing tests AC-1, AC-2, AC-3 in `backend/tests/test_adduct.py`
- [ ] T2 — Failing tests AC-4 (503) and AC-5 (no email in logs, via `caplog`)
- [ ] T3 — Add `record(request_log, message)` helper; thread `request_log` through `without_hydro`, `m_calculation`, `adduct_using_mass`
- [ ] T4 — Remove global `log_entries` and root-logger `ListHandler` setup
- [ ] T5 — `AdductDatabaseError` in `fetch_adduct_table` callers → `HTTPException(503, "Adduct database unavailable")`
- [ ] T6 — Log payload without `Email`
- [ ] T7 — Update existing test lambdas for new signature; `pytest backend/tests` passes

## Frontend

- [ ] T8 — Manually check the 503 error message in `Adduct.tsx` in light and dark mode

## Wrap-up

- [ ] T9 — Update spec 003 (error table, remove "Known gaps" items fixed here)
- [ ] T10 — Every AC links to a passing test; set `Status: Done`
