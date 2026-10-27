# 010 — Secure startup configuration

- **Status:** Draft
- **Priority:** P1 (security)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [001 Authentication](../001-auth-keycloak/spec.md)

## 1. Context / Problem

`create_app()` falls back to `SESSION_SECRET="change-me"` when the variable is missing. A forgotten env var silently produces forgeable session cookies. Missing Keycloak variables are only detected on the first protected request (`500`), not at startup, so a broken deployment looks healthy until a user tries it.

## 2. Goals

- The backend refuses to start in production with an insecure or missing `SESSION_SECRET`.
- The backend refuses to start with `AUTH_PROVIDER=keycloak` when Keycloak variables are missing.
- A clear log line names every missing variable (never its value).
- Tests and local debug keep working.

## 3. Non-goals

- Secret rotation, Vault integration.
- Changing Keycloak token validation logic.

## 4. User stories

- As an **operator**, I want the container to fail fast with a clear message on bad config, so that I never run an insecure deployment unnoticed.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** `AUTH_PROVIDER=keycloak` and `SESSION_SECRET` unset, empty or `change-me`, **when** `create_app()`, **then** it raises `ConfigError` naming `SESSION_SECRET` | `backend/tests/test_startup_config.py::test_rejects_missing_or_default_session_secret` |
| AC-2 | **Given** `SESSION_SECRET` shorter than 32 characters in keycloak mode, **then** `ConfigError` | `test_startup_config.py::test_rejects_short_session_secret` |
| AC-3 | **Given** `AUTH_PROVIDER=keycloak` and any of `KEYCLOAK_ISSUER`, `KEYCLOAK_JWKS_URL`, `KEYCLOAK_CLIENT_ID` missing, **then** `ConfigError` listing all missing names | `test_startup_config.py::test_rejects_missing_keycloak_config` |
| AC-4 | **Given** `AUTH_PROVIDER=disabled`, **then** the app starts without these variables (tests, local debug) | existing `conftest.py` + `test_startup_config.py::test_disabled_auth_allows_missing_config` |
| AC-5 | **Given** an unknown `AUTH_PROVIDER` value (e.g. typo `keycloack`), **then** `ConfigError` | `test_startup_config.py::test_rejects_unknown_auth_provider` |
| AC-6 | Error messages never contain secret values | asserted in the tests above |

## 6. API contract

No API change. Behavior change: startup fails instead of serving requests.

Backward compatibility: **deployments without `SESSION_SECRET` will stop starting.** CI/CD (`act_cd.yml`) already sets `SESSION_SECRET` from GitHub secrets — verify it is ≥ 32 chars before release.

## 7. UI / UX

None.

## 8. Non-functional requirements

| Env var | Rule |
|---|---|
| `AUTH_PROVIDER` | `keycloak` (default) or `disabled` |
| `SESSION_SECRET` | Required in keycloak mode, ≥ 32 chars, not `change-me` |
| `KEYCLOAK_ISSUER`, `KEYCLOAK_JWKS_URL`, `KEYCLOAK_CLIENT_ID` | Required in keycloak mode |

Generate a secret: `python -c "import secrets; print(secrets.token_urlsafe(48))"`

## 9. Open questions

- [ ] Should `AUTH_PROVIDER=disabled` be blocked when an `ENVIRONMENT=production` flag is set?
