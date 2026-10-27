# 008 — Health checks & metrics

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/chatbot/health_routes.py`, `backend/services/utils/metrics.py`, `docs/monitoring.md`

## 1. Context / Problem

Operators need to know whether the backend and its dependencies (handbook mount, Gemini) work, and Prometheus/Grafana need request metrics.

## 2. Goals

- Unauthenticated health endpoints for the handbook mount and Gemini.
- Prometheus metrics for every backend request.

## 3. Non-goals

- Health checks for PostgreSQL, PubChem, Keycloak or SMTP relay.
- Alerting rules (handled in Prometheus/Grafana).

## 4. User stories

- As an **operator**, I want health endpoints and request metrics, so that Grafana shows whether the backend is healthy.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** any request was handled, **when** `GET /metrics`, **then** `analytical_tools_http_requests_total` and `analytical_tools_http_request_duration_seconds` are exposed | `backend/tests/test_metrics.py::test_metrics_endpoint_exposes_backend_request_metrics` |
| AC-2 | **Given** `HANDBOOK_ROOT` exists, **when** `GET /health/handbook`, **then** `200 {"status": "ok", ...}`; otherwise `500` | — (no test yet) |
| AC-3 | **When** `GET /health/gemini`, **then** `200` with `status` `ok` / `degraded` / `error` | — (no test yet) |

## 6. API contract

### `GET /health/handbook` (public)

| Status | Body |
|---|---|
| 200 | `{ "status": "ok", "handbook_root": "/data/vho-handbook", "exists": true }` |
| 500 | `{ "status": "error", "handbook_root": "...", "exists": false }` |

### `GET /health/gemini` (public)

Always HTTP `200`; check `status` in the body. Calls `GET .../v1beta/models` with the API key (timeout 10 s).

| Body | Meaning |
|---|---|
| `{ "status": "ok", "level": "basic", "upstream_http": 200 }` | Key valid, Gemini reachable |
| `{ "status": "error", "reason": "invalid_api_key", "upstream_http": 401 }` | 401 / 403 |
| `{ "status": "degraded", "reason": "rate_limited", "upstream_http": 429 }` | Rate limited |
| `{ "status": "error", "reason": "unexpected_status", "upstream_http": 500 }` | Other status |
| `{ "status": "error", "reason": "exception", "details": "..." }` | Missing key / network error |

### `GET /metrics` (public, hidden from OpenAPI)

Prometheus text format.

| Metric | Labels |
|---|---|
| `analytical_tools_http_requests_total` | `method`, `path` (route template), `status_code` |
| `analytical_tools_http_request_duration_seconds` | `method`, `path` |

`/metrics` itself is not counted. With `PROMETHEUS_MULTIPROC_DIR` set (gunicorn workers), metrics are aggregated across processes.

## 7. UI / UX

- None in the app; dashboards in Grafana (see `docs/monitoring.md`).

## 8. Non-functional requirements

| Env var | Purpose |
|---|---|
| `PROMETHEUS_MULTIPROC_DIR` | Multi-process metrics directory for gunicorn |
| `HANDBOOK_ROOT`, `GOOGLE_API_KEY` | Checked by the health endpoints |

- `path` label uses the route template (e.g. `/api/handbook/file`), not the raw URL → bounded label cardinality.

## 9. Open questions

- [ ] Add `/health/db` for PostgreSQL?
- [ ] Should `/health/gemini` return non-200 on error so probes can use the status code?

## 10. Known gaps

- `/health/gemini` calls Gemini on every probe — frequent probing uses API quota.
- Health endpoints have no tests.
