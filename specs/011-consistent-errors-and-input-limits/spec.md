# 011 — Consistent errors and input limits

- **Status:** Draft
- **Priority:** P2 (robustness / security)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [002](../002-compound-search/spec.md), [003](../003-adduct-calculation/spec.md), [004](../004-collision-plot/spec.md), [005](../005-smtp-check/spec.md), [007](../007-d9bot-chat/spec.md)

## 1. Context / Problem

The API promises `{"error": "..."}` bodies, but several paths break that contract:

- Unhandled exceptions return plain-text `Internal Server Error` (Adduct with missing/invalid `operation`, JSON numbers in Compound/Adduct because `convert_float` calls `"," in value` on a float).
- Some `500` responses leak internal exception text (`details: str(exc)` in `/api/gemini`, `{"error": str(exc)}` in Compound).
- Pydantic validation errors return `422 {"detail": [...]}` without an `error` field, so the frontend cannot show a message.
- No size limits: unlimited `x`/`y` list length, prompt length and host length allow cheap resource exhaustion.

## 2. Goals

- Every error response has an `error` string the frontend can display.
- Unexpected exceptions return `500 {"error": "Internal server error"}` and are logged with stack trace — no internal details in the response.
- `convert_float` accepts strings (with `.` or `,`), ints and floats.
- Clear input limits on all tool endpoints.

## 3. Non-goals

- Changing successful response shapes.
- Rate limiting per user (possible later spec).

## 4. User stories

- As a **lab user**, I want a readable error message for every failure, so that I know what to fix.
- As an **operator**, I want internal errors logged but not exposed, so that attackers learn nothing from responses.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** a route raises an unexpected exception, **then** `500 {"error": "Internal server error"}` and the stack trace is logged | `backend/tests/test_error_handling.py::test_unhandled_exception_returns_json_500` |
| AC-2 | **Given** a Pydantic validation error, **then** `422` body contains `error` (summary string) **and** the original `detail` list | `test_error_handling.py::test_validation_error_has_error_field` |
| AC-3 | **Given** `POST /api/adduct` with `operation` missing or not `positive`/`negative`, **then** `400 {"error": "operation must be 'positive' or 'negative'"}` | `test_adduct.py::test_adduct_rejects_invalid_operation` |
| AC-4 | **Given** numeric JSON values (`{"NM": 100.5}`) in Adduct/Compound, **then** they are accepted like strings | `backend/tests/test_adduct_utils.py::test_convert_float_accepts_numbers_and_comma_strings` |
| AC-5 | **Given** a non-numeric string (`"abc"`), **then** `400 {"error": "Invalid number: abc"}` | `test_adduct.py::test_adduct_rejects_non_numeric`, `test_compound.py::test_compound_rejects_non_numeric` |
| AC-6 | **Given** `x`/`y` longer than 10 000 items, **then** `400` | `test_act_math.py::test_collision_rejects_too_many_points` |
| AC-7 | **Given** a prompt longer than 8 000 chars, **then** `400` | `test_chatbot_gemini.py::test_chat_rejects_too_long_prompt` |
| AC-8 | **Given** `host` longer than 253 chars or containing whitespace / `/` / `:` , **then** `400` | `test_smtp_handler.py::test_smtp_rejects_invalid_host` |
| AC-9 | **Given** a `500`, **then** no Python exception text appears in the response body (Compound, `/api/gemini`) | `test_error_handling.py::test_500_does_not_leak_exception_text` |

## 6. API contract

Error body (all endpoints):

```json
{ "error": "Human readable message" }
```

Validation errors (additive `error` field):

```json
{ "error": "Invalid request: x: Input should be a valid number", "detail": [ { "loc": ["body", "x", 0], "msg": "...", "type": "..." } ] }
```

Limits:

| Endpoint | Field | Limit |
|---|---|---|
| `/api/collision` | `x`, `y` | ≤ 10 000 items |
| `/api/chat`, `/api/gemini` | `Prompt_string` | ≤ 8 000 chars |
| `/api/smtp` | `host` | ≤ 253 chars, hostname/IP characters only |
| `/api/adduct` | `operation` | `positive` \| `negative` |
| all | `Email` | empty or valid email, ≤ 254 chars |

Backward compatibility: status codes for previously-crashing inputs change from `500` to `400`; `422` gains an additive field; `500` bodies lose `details`/exception text (frontend only shows `error`). No successful response changes.

## 7. UI / UX

- No new UI. Error messages now appear where the page previously showed a generic failure. Check visibility in light and dark mode on Adduct, Compound, Math, SMTP, D9bot.

## 8. Non-functional requirements

- Logging: unexpected exceptions logged with `logging.exception` (stack trace), without request bodies containing PII.

## 9. Open questions

- [ ] Are 10 000 points / 8 000 chars the right limits?
