# 012 — D9bot chat hardening — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — Tests AC-1 … AC-4 for current `/api/chat` behavior (should pass before refactor)
- [ ] T2 — Failing tests AC-5, AC-6, AC-7
- [ ] T3 — `GeminiNotConfiguredError` in `gemini.py`
- [ ] T4 — Shared `run_gemini_prompt` helper; both routes use it
- [ ] T5 — Metadata-only logging
- [ ] T6 — Deprecate `/api/gemini`
- [ ] T7 — `pytest backend/tests` passes

## Frontend

- [ ] T8 — Unset the key in debug stack; check the 503 message in D9bot in light and dark mode

## Wrap-up

- [ ] T9 — Update spec 007; set `Status: Done`
