# 016 — Production deployment hardening

- **Status:** Draft — **needs approval** (changes deployment design, see AGENTS.md "Ask Before")
- **Priority:** P1 (security)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [001](../001-auth-keycloak/spec.md), [008](../008-health-and-metrics/spec.md), [010](../010-secure-startup-config/spec.md), [015](../015-health-and-readiness/spec.md)

## 1. Context / Problem

Findings in `deploy/docker-compose.yml` and `backend/`:

| # | Finding | Risk |
|---|---|---|
| F1 | Keycloak runs `start-dev` | Dev mode: relaxed security defaults, not supported for production |
| F2 | Backend publishes `8080:8080` on the host | `/metrics`, `/docs`, `/openapi.json`, `/health/*` reachable from outside if the host firewall allows it; Apache and Prometheus reach the backend via the Docker network anyway |
| F3 | `/docs` and `/openapi.json` always enabled | Full API map public |
| F4 | Keycloak and the app share the `postgres` superuser and the `postgres` database | Compromise of one = full DB access for both |
| F5 | `backend/requirements.txt` is unpinned (`fastapi`, `requests`, …) | Non-reproducible builds; a new major version can break production silently |
| F6 | Backend container runs as root and installs `vim`, `procps` | Larger attack surface |

## 2. Goals

- Keycloak in production mode.
- Backend reachable only via Apache (`/api`) and the internal Docker network.
- API docs disabled in production by config.
- Separate DB users/databases for Keycloak and the app, least privilege.
- Pinned, reproducible Python dependencies.
- Non-root backend container without debug tools.

## 3. Non-goals

- Moving to Kubernetes, changing the reverse-proxy chain, changing CI/CD provider.
- Debug stack (`docker-compose.debug.yml`) keeps its convenience settings.

## 4. User stories

- As a **security owner**, I want internal endpoints not exposed to the internet, so that the attack surface is minimal.
- As an **operator**, I want reproducible builds, so that a redeploy never pulls an untested library version.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** production compose, **then** Keycloak command is `start` (with `--optimized` or build step) and `KC_HOSTNAME` / proxy settings are set | manual + `docker compose config` review |
| AC-2 | **Given** production compose, **then** the backend has no `ports:` mapping (only `expose: 8080`); Apache `/api` and Prometheus scraping still work | manual: UI works, Prometheus target `UP` |
| AC-3 | **Given** `API_DOCS_ENABLED=false`, **then** `/docs`, `/redoc`, `/openapi.json` return `404`; default (unset) keeps them enabled for dev | `backend/tests/test_api_docs_toggle.py` |
| AC-4 | **Given** the deployed stack, **then** Keycloak uses DB `keycloak` with user `keycloak`, the app uses DB `analytical` with user `analytical` (no superuser) | manual (`\du`, `\l` in psql) |
| AC-5 | **Given** `backend/requirements.txt`, **then** every package is pinned (`==`) and CI installs from it successfully | CI `act_ci.yml` |
| AC-6 | **Given** the backend image, **then** `whoami` is not `root` and `vim` is not installed | `docker run --rm <image> whoami` |
| AC-7 | Full test suite and a manual smoke test of every tool pass after the change | CI + manual |

## 6. API contract

No API change. New env var `API_DOCS_ENABLED` (default `true`; set `false` in production).

## 7. UI / UX

None.

## 8. Non-functional requirements

| Env var | Purpose | Prod value |
|---|---|---|
| `API_DOCS_ENABLED` | Toggle Swagger / OpenAPI | `false` |
| `KC_PROXY_HEADERS` | Keycloak behind nginx | `xforwarded` |
| `KC_DB_USERNAME` / `KC_DB_PASSWORD` | Dedicated Keycloak DB user | from secrets |
| `DB_USERNAME` / `DB_PASSWORD` | Dedicated app DB user | from secrets |

## 9. Open questions

- [ ] Is `8080` used directly by anything outside Docker (e.g. host-level nginx, external monitoring)? Must be answered before AC-2.
- [ ] Migration window for the DB user split (Keycloak data must be moved/dumped to the new DB).
- [ ] Keycloak production mode needs a build step (`kc.sh build`) — custom image or `start` without `--optimized`?
