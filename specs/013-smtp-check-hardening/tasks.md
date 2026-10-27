# 013 — SMTP check hardening — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — Failing test AC-1; fix service names via `SMTP_CHECKS`
- [ ] T2 — Failing test AC-2; parallel checks with `ThreadPoolExecutor`
- [ ] T3 — Failing tests AC-3 … AC-5; `is_host_allowed`
- [ ] T4 — `pytest backend/tests` passes

## Frontend

- [ ] T5 — Check closed-port rows and 403 message in light and dark mode

## Wrap-up

- [ ] T6 — Document env vars; update spec 005; set `Status: Done`
