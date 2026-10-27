# 015 — Liveness, readiness and dependency health

- **Status:** Draft
- **Priority:** P2 (operations)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [008 Health & metrics](../008-health-and-metrics/spec.md), [016 Deployment](../016-production-deployment-hardening/spec.md)

## 1. Context / Problem

- There is no simple liveness/readiness endpoint; the backend container has no Docker healthcheck, so `restart: unless-stopped` only reacts to crashes, not to a hung or misconfigured app.
- PostgreSQL (used by Adduct) has no health check.
- `/health/gemini` calls Gemini on every probe, consuming API quota, and always returns HTTP 200 even on error.
- Health endpoints have no tests.

## 2. Goals

- `GET /health/live` — process is up (no dependencies).
- `GET /health/ready` — required dependencies OK (DB, handbook root); HTTP 503 if not.
- `GET /health/db` — PostgreSQL reachable.
- `/health/gemini` cached for 60 s.
- Backend container healthcheck uses `/health/live`.

## 3. Non-goals

- Making Gemini or PubChem part of readiness (optional features must not take the whole app down).
- Alerting rules.

## 4. User stories

- As an **operator**, I want Docker and monitoring to detect an unhealthy backend, so that it is restarted or I am alerted.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **When** `GET /health/live`, **then** `200 {"status": "ok"}` without touching DB or network | `backend/tests/test_health.py::test_live_has_no_dependencies` |
| AC-2 | **Given** DB and handbook root OK, **when** `GET /health/ready`, **then** `200 {"status": "ok", "checks": {"database": "ok", "handbook": "ok"}}` | `test_health.py::test_ready_ok` |
| AC-3 | **Given** DB down, **then** `/health/ready` → `503` with `"database": "error"` and `/health/db` → `503` | `test_health.py::test_ready_fails_when_db_down` |
| AC-4 | **Given** two `/health/gemini` calls within 60 s, **then** Gemini is called once | `test_health.py::test_gemini_health_is_cached` |
| AC-5 | **Given** Gemini health `error`, **then** `/health/gemini` returns `503` (body unchanged) | `test_health.py::test_gemini_health_status_code` |
| AC-6 | Existing `/health/handbook` behavior covered by tests | `test_health.py::test_handbook_health` |
| AC-7 | **Given** the backend container, **then** `docker compose ps` shows `healthy` | manual (T-deploy) |

## 6. API contract

All public (no auth), JSON:

| Endpoint | 200 | 503 |
|---|---|---|
| `/health/live` | `{ "status": "ok" }` | — |
| `/health/ready` | `{ "status": "ok", "checks": { "database": "ok", "handbook": "ok" } }` | `{ "status": "error", "checks": { "database": "error", "handbook": "ok" } }` |
| `/health/db` | `{ "status": "ok" }` | `{ "status": "error" }` |
| `/health/gemini` | body as today when `ok`/`degraded` | body as today when `error` |

Responses never include connection strings, hostnames of the DB, or exception text.

Backward compatibility: `/health/gemini` status code changes from always-200 to 503 on error — check Grafana/Prometheus probes that use it.

## 7. UI / UX

None.

## 8. Non-functional requirements

- DB check: `SELECT 1` with 2 s connect timeout.
- Gemini health cache TTL 60 s (per worker process).

## 9. Open questions

- [ ] Should readiness include Keycloak JWKS reachability?
