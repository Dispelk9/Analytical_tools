# 011 — Consistent errors and input limits — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — `grep -rn "\.detail" frontend/src` to confirm nothing depends on 422 `detail` only
- [ ] T2 — Failing tests AC-1, AC-2, AC-9 in `backend/tests/test_error_handling.py` (add a test-only route raising `RuntimeError`)
- [ ] T3 — Generic `Exception` and `RequestValidationError` handlers in `create_app()`
- [ ] T4 — Tests + fix `convert_float` (AC-4, AC-5)
- [ ] T5 — Adduct `operation` validation (AC-3)
- [ ] T6 — Input limits: collision (AC-6), prompt (AC-7), host (AC-8)
- [ ] T7 — Remove exception text from Compound / `/api/gemini` 500 bodies
- [ ] T8 — `pytest backend/tests` passes

## Frontend

- [ ] T9 — Trigger each new 400 in the UI; message visible in light and dark mode
- [ ] T10 — `npm run lint` and `npm run test:run` pass

## Wrap-up

- [ ] T11 — Update error tables in specs 002, 003, 004, 005, 007
- [ ] T12 — Set `Status: Done`
