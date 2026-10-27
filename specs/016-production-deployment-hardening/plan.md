# 016 — Production deployment hardening — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

Split into independent, separately deployable steps (lowest risk first). Each step is one PR.

| Step | Finding | Change | Risk |
|---|---|---|---|
| S1 | F5 | `pip freeze` from the current production image → pin `requirements.txt` | Low |
| S2 | F3 | `API_DOCS_ENABLED` toggle in `create_app()` (`docs_url=None`, `redoc_url=None`, `openapi_url=None`) | Low |
| S3 | F6 | Dockerfile: drop `vim procps`, add `useradd app` + `USER app`; ensure `/tmp/prometheus_multiproc` is writable | Low |
| S4 | F2 | Replace backend `ports: ["8080:8080"]` with `expose: ["8080"]` | Medium — confirm open question first |
| S5 | F1 | Keycloak `start` + `KC_PROXY_HEADERS=xforwarded`, `KC_HTTP_ENABLED=true` (TLS terminated at nginx) | Medium |
| S6 | F4 | Create `keycloak` + `analytical` DBs/users via init script; migrate Keycloak data (`pg_dump`/`pg_restore`); grant app user only needed privileges on `positive`/`negative` tables | High — needs maintenance window + backup |

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/requirements.txt` | Pinned versions (S1) |
| Backend | `backend/main.py` | Docs toggle (S2) |
| Backend | `backend/Dockerfile` | Non-root, slimmer (S3) |
| Tests | `backend/tests/test_api_docs_toggle.py` | AC-3 |
| Tests | `backend/tests/test_auth_backend_login_user.py` | Keep `test_swagger_docs_and_openapi_are_available` (default enabled) |
| Deploy | `deploy/docker-compose.yml` | S4, S5, S6 |
| Deploy | `deploy/postgres-init/*.sql` (new) | DB/user creation (S6, no passwords in file — use env) |
| Deploy | `.github/workflows/act_cd.yml` | New secrets for DB users (S6) |
| Docs | `docs/deployment.md` (new) | Steps, rollback per step |

## 3. Data model

DB layout after S6:

```
postgres server
├── keycloak   (owner: keycloak)
└── analytical (owner: analytical) → tables positive, negative
```

## 4. Request flow (after S4)

```
Internet → nginx (host) → Apache frontend :443 → /api → backend:8080 (Docker network only)
Prometheus (Docker network) → backend:8080/metrics
```

## 5. Configuration

See spec §8. All secrets via GitHub Actions secrets / Docker secrets — never committed.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| S4 breaks an unknown consumer of port 8080 | Answer open question; check nginx config + host firewall first |
| S5 Keycloak fails to start in prod mode | Test with debug stack using same flags; keep previous image tag for rollback |
| S6 data loss | Full `pg_dumpall` backup before; rehearse on a copy |
| S3 permission errors on `/tmp/prometheus_multiproc` | Create dir in Dockerfile with `chown app` |

## 7. AGENTS.md checklist

- [ ] **Deployment design change approved by the owner before each step**
- [ ] No secrets / credentials in files
- [ ] Rollback documented per step
- [ ] Tests for the docs toggle
