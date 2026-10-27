# NNN — <Feature title>

- **Status:** Draft <!-- Draft | Approved | In Progress | Done | Superseded by NNN -->
- **Author:** <name>
- **Created:** YYYY-MM-DD
- **Related:** <Jira ticket / PR / other spec>

## 1. Context / Problem

<Why does this matter? What is missing or painful today? 2–5 sentences.>

## 2. Goals

- <Outcome the feature must achieve>

## 3. Non-goals (out of scope)

- <What this spec explicitly does NOT cover>

## 4. User stories

- As a **<lab user / operator / developer>**, I want **<capability>**, so that **<benefit>**.

## 5. Acceptance criteria

Each criterion must be observable and map to at least one test.

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** <state>, **when** <action>, **then** <observable result> | `backend/tests/test_<tool>.py::test_<behavior>` |
| AC-2 | **Given** <invalid input>, **when** <action>, **then** `400` with `{"error": "..."}` | `backend/tests/test_<tool>.py::test_<tool>_requires_<field>` |
| AC-3 | **Given** <page loaded>, **when** <user action>, **then** <rendered result> | `frontend/src/test/pages/<Page>.test.tsx` |

## 6. API contract (backend)

Endpoints live under `/api/...` and are protected by Keycloak unless stated otherwise.

```http
POST /api/<tool>
Content-Type: application/json
Authorization: Bearer <keycloak token>   # added by authFetch()

{ "field": "value" }
```

Response `200`:

```json
{ "result": { } }
```

Errors (shape produced by the global handler in `backend/main.py`):

| Status | When | Body |
|---|---|---|
| 400 | <missing / invalid input> | `{ "error": "<message>" }` |
| 401 | Not authenticated (Keycloak) | `{ "error": "..." }` |
| 500 | <DB / external system unavailable> | `{ "error": "<message>" }` |

- **Auth:** protected (`protected_dependencies`) / public (like `health_router`) — <why>
- **Backward compatibility:** unchanged / additive only / **BREAKING** — <explain and warn>

## 7. UI / UX (frontend)

- **Route:** `/<tool>` in `frontend/src/App.tsx`
- **Navigation:** tile `{ href: '/<tool>', label: '<Label>' }` in theme `<theme id>` of `frontend/src/data/toolThemes.ts`
- **Components:** Porsche Design System (`PButton`, `PTextFieldWrapper`, `PText`, …) + existing components (`LatticeLoader`, …)
- **States:** empty, loading, success, error (show the backend's `error` message)
- **Light & dark mode:** colors only via `var(--...)` tokens from `frontend/src/index.css`.
  New tokens needed: none / `--<name>` (defined for both themes)

## 8. Non-functional requirements

- **Security:** input validation via Pydantic model; parameterized SQL (`psycopg2.sql`); no secrets in code, config via env vars
- **Performance:** <expected input size / response time>
- **Observability:** logging via `logging.info(...)`; Prometheus metrics come from `configure_metrics` — <extra metrics?>

## 9. Open questions

- [ ] <Question> — owner: <name>
