# 003 — Adduct calculation

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/tools/adduct.py`, `backend/services/utils/adduct_utils.py`, `backend/services/utils/send_log.py`, `frontend/src/pages/Adduct.tsx`

## 1. Context / Problem

Lab users know the neutral mass of a compound and see an observed mass. They need the adduct combinations (from a positive/negative adduct table in PostgreSQL) whose summed mass explains the difference, with and without hydrogen.

## 2. Goals

- Return all adduct combinations whose mass sum falls into the error window, in positive or negative mode.
- Optionally email the calculation log to the user.

## 3. Non-goals

- Editing the adduct tables from the UI.
- Persisting results.

## 4. User stories

- As a **lab user**, I want to enter neutral mass, observed mass, mass error and mode, so that I see which adduct combinations explain my measurement.
- As a **lab user**, I want the result emailed, so that I can keep it with my lab notes.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** `NM`, `OB` or `ME` missing/empty, **when** `POST /api/adduct`, **then** `400 {"error": "Missing one or more numbers"}` | `backend/tests/test_adduct.py::test_adduct_requires_required_fields` |
| AC-2 | **Given** valid input, **then** `200 {"result": {"Results without Hydro": [...], "Results with Hydro": [...]}}` | `test_adduct.py::test_adduct_returns_combined_results_and_sends_email` |
| AC-3 | **Given** `Email` is set, **then** the log is sent to that address | `test_adduct.py::test_adduct_returns_combined_results_and_sends_email` |
| AC-4 | **Given** DB config cannot be loaded, **then** `500 {"error": "Database configuration unavailable"}` | — (no test yet) |
| AC-5 | **Given** no operation is selected, **when** submitting, **then** the page shows "Please select an operation." and sends no request | `frontend/src/test/pages/Adduct.test.tsx` |

## 6. API contract

```http
POST /api/adduct
Content-Type: application/json

{ "NM": "100.5", "OB": "122.1", "ME": "5", "operation": "positive", "Email": "lab@example.com" }
```

| Field | Meaning |
|---|---|
| `NM` | Neutral mass |
| `OB` | Observed mass (UNIFI number) |
| `ME` | Mass error, multiplied by `1e-5` internally |
| `operation` | `positive` or `negative` — selects DB table of the same name |
| `Email` | Optional, empty = no email |

Calculation (per mode):

- Window: `diff = OB - NM`, `high = diff + ME·1e-5·diff`, `low` depends on mode (see `without_hydro` / `adduct_using_mass`).
- `subset_sum` finds combinations (with repetition) of adduct masses inside `(low, high)`; H⁺/H⁻ (`1.007825`) used at most 3 times.
- Charge rule: positive mode keeps combinations with `(#"+") − (#"-") == 1`; negative mode `== -1`.
- **Without Hydro:** drops combinations containing `H+` or `H-`.
- **With Hydro:** keeps only combinations containing `H+` or `H-` (but not both).
- Duplicates are removed.

Response `200`:

```json
{
  "result": {
    "Results without Hydro": [ { "Element Set": ["Na+ "], "Sum": ["22.98977"] } ],
    "Results with Hydro":    [ { "Adduct Combinations": [ [ { "Element Set": ["2H+ Na+ "], "Sum": ["..."] } ] ] } ]
  }
}
```

Errors:

| Status | When | Body |
|---|---|---|
| 400 | Missing `NM` / `OB` / `ME` | `{ "error": "Missing one or more numbers" }` |
| 500 | `DB_CONNECT()` raises | `{ "error": "Database configuration unavailable" }` |
| 500 | Invalid `operation`, non-numeric input | plain `Internal Server Error` (unhandled) |

Auth: protected (Keycloak). Backward compatibility: field names and the German-English result keys are part of the contract the frontend renders.

## 7. UI / UX

- Route `/adduct`, page `Adduct.tsx`; operation dropdown defaults to "Please Choose" and is validated client-side.

## 8. Non-functional requirements

- **DB:** PostgreSQL via `psycopg2`, tables `positive` / `negative` allow-listed and queried with `sql.Identifier`.
- **Email:** `send_email` via SMTP_SSL port 465 (`SENDER`, `MAIL_PW`, `SMTP_RELAY`); failures are logged, not returned.

| Env var | Purpose |
|---|---|
| `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` | Adduct tables |
| `SENDER`, `MAIL_PW`, `SMTP_RELAY` | Result email |

## 9. Open questions

- [ ] `ME` is scaled by `1e-5` here but by `1e-6` (ppm) in Compound search — intended?

## 10. Known gaps

- **Privacy:** the email contains the module-level `log_entries` list, which grows for the whole process lifetime — a user can receive log lines from *other users'* requests, and memory grows unbounded.
- DB fetch errors are swallowed → `200` with empty results instead of an error.
- Invalid `operation` or JSON numbers (instead of strings) cause an unhandled `500` without the `{"error": ...}` shape.
