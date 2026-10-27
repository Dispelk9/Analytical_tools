# 015 — Liveness, readiness and dependency health — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

## Backend

- [ ] T1 — Tests for existing `/health/handbook` (AC-6)
- [ ] T2 — Failing tests AC-1 … AC-5
- [ ] T3 — `health_checks.py`
- [ ] T4 — New routes + gemini cache + 503
- [ ] T5 — `pytest backend/tests` passes

## Deploy (ask before merging)

- [ ] T6 — Backend `healthcheck` in both compose files
- [ ] T7 — `docker compose -f deploy/docker-compose.debug.yml up`; confirm `healthy` (AC-7)
- [ ] T8 — Check whether any Grafana/Prometheus probe uses `/health/gemini` status code

## Wrap-up

- [ ] T9 — Update `docs/monitoring.md` and spec 008; set `Status: Done`
