# 010 — Secure startup configuration — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — Failing tests AC-1 … AC-6 in `backend/tests/test_startup_config.py` (use `monkeypatch.setenv/delenv`)
- [ ] T2 — `startup_config.py` with `ConfigError` and `validate_startup_config()`
- [ ] T3 — Call it in `create_app()`; remove `"change-me"` fallback
- [ ] T4 — `pytest backend/tests` passes

## Deploy

- [ ] T5 — Confirm GitHub secret `SESSION_SECRET` is ≥ 32 chars (ask the owner, never print it)
- [ ] T6 — Run the debug stack with `docker-compose.debug.yml`; confirm startup and a clear error when a var is removed

## Wrap-up

- [ ] T7 — `docs/configuration.md` with required env vars
- [ ] T8 — Update spec 001 (env table, Known gaps)
- [ ] T9 — Set `Status: Done`
