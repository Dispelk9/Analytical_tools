# 016 — Production deployment hardening — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

**Get approval for the spec before starting. One PR per step.**

## S1 — Pin dependencies

- [ ] T1 — `docker run --rm <current backend image> pip freeze` → pin `backend/requirements.txt` (and `requirements-dev.txt`)
- [ ] T2 — CI green (AC-5)

## S2 — API docs toggle

- [ ] T3 — Failing test AC-3 in `backend/tests/test_api_docs_toggle.py`
- [ ] T4 — `API_DOCS_ENABLED` in `create_app()`; existing docs test still passes
- [ ] T5 — Set `API_DOCS_ENABLED=false` in `act_cd.yml` env

## S3 — Non-root image

- [ ] T6 — Dockerfile: remove `vim procps`, add `app` user, writable multiproc dir
- [ ] T7 — Debug stack runs; `whoami` ≠ root (AC-6)

## S4 — Remove public backend port

- [ ] T8 — Answer open question about port 8080 consumers
- [ ] T9 — `ports` → `expose`; verify UI `/api` and Prometheus target `UP` (AC-2)

## S5 — Keycloak production mode

- [ ] T10 — Test `start` + proxy flags in the debug stack
- [ ] T11 — Deploy; login works end to end (AC-1)

## S6 — Separate DB users (maintenance window)

- [ ] T12 — Backup `pg_dumpall`
- [ ] T13 — Init script + data migration rehearsed on a copy
- [ ] T14 — Deploy; verify AC-4; Adduct tool works

## Wrap-up

- [ ] T15 — `docs/deployment.md` with rollback per step
- [ ] T16 — Smoke-test every tool (AC-7); set `Status: Done`
