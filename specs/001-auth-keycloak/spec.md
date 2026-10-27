# 001 — Authentication (Keycloak)

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/auth_backend/keycloak.py`, `backend/api/auth_backend/login_user.py`, `backend/main.py`, `frontend/src/auth/auth.ts`, `frontend/src/login/`

## 1. Context / Problem

All tools touch internal lab and infrastructure data, so every tool API must only be usable by authenticated users. Authentication is delegated to Keycloak (OIDC); the backend only validates bearer tokens and never handles passwords.

## 2. Goals

- Protect every tool router with Keycloak bearer-token validation.
- Let the frontend check whether the current user is logged in.
- Allow tests and local debugging to run without Keycloak.

## 3. Non-goals

- Password login (explicitly disabled).
- Role/permission checks per tool — any valid user can use every tool.
- User management (done in Keycloak).

## 4. User stories

- As a **lab user**, I want to log in once via Keycloak, so that I can use all tools without separate passwords.
- As an **operator**, I want unauthenticated requests rejected, so that internal data is not exposed.
- As a **developer**, I want `AUTH_PROVIDER=disabled`, so that I can run tests without Keycloak.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** `AUTH_PROVIDER=keycloak`, **when** a tool route is called without a bearer token, **then** `401` | `backend/tests/test_auth_backend_keycloak.py::test_keycloak_mode_protects_tool_routes` |
| AC-2 | **Given** a valid RS256 token whose `azp` or `aud` matches `KEYCLOAK_CLIENT_ID`, **when** `GET /api/check-auth`, **then** `200 {"authenticated": true, "username": <preferred_username>}` | `test_auth_backend_keycloak.py::test_keycloak_check_auth_accepts_valid_bearer_token` |
| AC-3 | **Given** a token issued for another client, **when** `GET /api/check-auth`, **then** `401 {"authenticated": false}` | `test_auth_backend_keycloak.py::test_keycloak_check_auth_rejects_wrong_client` |
| AC-4 | **When** `POST /api/login`, **then** `400 {"message": "Password login is disabled. Use Keycloak authentication."}` | `test_auth_backend_login_user.py::test_password_login_is_disabled`, `test_auth_backend_keycloak.py::test_keycloak_mode_disables_password_login` |
| AC-5 | **When** `POST /api/logout`, **then** `200 {"message": "Logged out"}` and `user_id` is removed from the session | `test_auth_backend_login_user.py::test_logout_and_check_auth` |
| AC-6 | **Given** `AUTH_PROVIDER=disabled`, **when** `GET /api/check-auth`, **then** `200` with username `disabled-auth` and tool routes are open | `test_auth_backend_login_user.py::test_logout_and_check_auth` |
| AC-7 | **When** `GET /docs` or `/openapi.json`, **then** `200` (public) | `test_auth_backend_login_user.py::test_swagger_docs_and_openapi_are_available` |
| AC-8 | **Given** the auth check is rejected, **when** the app loads, **then** the login page is shown | `frontend/src/test/App.test.tsx` |
| AC-9 | **When** the user clicks login, **then** the Keycloak authorization-code flow starts; the callback exchanges the code exactly once | `frontend/src/test/login/Login.test.tsx`, `login/LoginCallback.test.tsx` |

## 6. API contract

### Bearer token validation (all protected routes)

```http
Authorization: Bearer <keycloak access token>   # added by authFetch() in frontend/src/auth/auth.ts
```

Validation steps (`validate_keycloak_token`):

1. Read `kid` from the token header → find key in JWKS (`KEYCLOAK_JWKS_URL`, cached 300 s, refetched once on unknown `kid`).
2. Verify signature `RS256` and `iss == KEYCLOAK_ISSUER` (audience not verified by the JWT library).
3. Require `azp == KEYCLOAK_CLIENT_ID` **or** `KEYCLOAK_CLIENT_ID in aud`.
4. Username = `preferred_username` → `email` → `sub`.

Protected routers (`protected_dependencies` in `create_app()`): compound, adduct, math, smtp, handbook, chatbot.
Public: auth router, health router, `/metrics`, `/docs`, `/openapi.json`.

### `GET /api/check-auth`

| Status | Body |
|---|---|
| 200 | `{ "authenticated": true, "username": "jdoe" }` |
| 401 | `{ "authenticated": false }` |

### `POST /api/login` → `400 { "message": "Password login is disabled. Use Keycloak authentication." }`

### `POST /api/logout` → `200 { "message": "Logged out" }`

### Errors on protected routes

| Status | When | Body |
|---|---|---|
| 401 | Missing / malformed bearer token | `{ "error": "Missing bearer token" }` |
| 401 | Bad signature, wrong issuer, expired | `{ "error": "Invalid bearer token" }` |
| 401 | No `kid` / unknown `kid` | `{ "error": "Bearer token is missing key id" }` / `{ "error": "Bearer token signing key is unknown" }` |
| 401 | Wrong client | `{ "error": "Bearer token was not issued for this client" }` |
| 500 | Keycloak env vars missing | `{ "error": "Keycloak authentication is not configured", "missing": ["KEYCLOAK_ISSUER", ...] }` |
| 503 | JWKS endpoint unreachable / invalid JSON | `{ "error": "Unable to fetch Keycloak signing keys" }` / `{ "error": "Invalid Keycloak signing key response" }` |

## 7. UI / UX

- `/login` page starts the Keycloak login; `App.tsx` calls `/api/check-auth` on load and shows the login page on `401`.
- Logout in the Navbar uses `logoutFromAuthProvider()` (Keycloak end-session), not `/api/logout`.

## 8. Non-functional requirements

| Env var | Purpose | Default |
|---|---|---|
| `AUTH_PROVIDER` | `keycloak` or `disabled` | `keycloak` |
| `KEYCLOAK_ISSUER` | Expected `iss` claim | — (required in keycloak mode) |
| `KEYCLOAK_JWKS_URL` | Signing keys URL | — (required) |
| `KEYCLOAK_CLIENT_ID` | Expected `azp` / `aud` | — (required) |
| `SESSION_SECRET` | Starlette session cookie signing | `change-me` |
| `HTTPS_ONLY` | Session cookie `Secure` flag | `true` |

Session cookie: `max_age` 1 day, `same_site=lax`.

## 9. Open questions

- [ ] Should tools be restricted by Keycloak role/group?

## 10. Known gaps (found while writing this spec)

- `SESSION_SECRET` falls back to `change-me` — insecure default if the env var is forgotten in production. Consider failing at startup instead.
- `/api/login` returns `{"message": ...}` instead of the usual `{"error": ...}` shape.
- `/api/logout` only clears a legacy session key; the frontend no longer calls it.
