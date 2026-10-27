# 009 — Adduct: per-request logs and visible DB errors

- **Status:** Draft
- **Priority:** P1 (privacy)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [003 Adduct calculation](../003-adduct-calculation/spec.md)

## 1. Context / Problem

`backend/api/tools/adduct.py` keeps a module-level `log_entries` list fed by a `ListHandler` attached to the **root logger**. Every log line of the whole backend process (all tools, all users) is appended and never cleared. When a user enters an email, `send_email(log_entries, ...)` sends that entire list, so:

- users receive log lines from **other users' requests** (prompts, emails, hosts, masses) → data leak;
- the list grows forever → memory leak in long-running gunicorn workers.

In addition, database errors while loading the adduct tables are swallowed and the API returns `200` with empty results, which looks like "no matching adducts" to the user.

## 2. Goals

- The result email contains only the lines of **the current request**.
- No unbounded in-memory log storage.
- A database failure is reported to the user as an error, not as an empty result.
- The user's email address is not written to the logs.

## 3. Non-goals

- Changing the adduct algorithm or result format.
- Changing the email template / sender.

## 4. User stories

- As a **lab user**, I want the result email to contain only my calculation, so that I never see other people's data and nobody sees mine.
- As a **lab user**, I want to see an error when the database is down, so that I don't trust an empty result.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** two adduct requests in sequence with different inputs, **when** the second sends an email, **then** the email body contains no line from the first request | `backend/tests/test_adduct.py::test_adduct_email_contains_only_current_request` |
| AC-2 | **Given** other tools logged messages, **when** an adduct email is sent, **then** none of those messages are included | `test_adduct.py::test_adduct_email_excludes_other_loggers` |
| AC-3 | **Given** 1 000 requests, **then** no module-level list grows (no global `log_entries`) | `test_adduct.py::test_adduct_has_no_global_log_buffer` |
| AC-4 | **Given** fetching the adduct table fails, **when** `POST /api/adduct`, **then** `503 {"error": "Adduct database unavailable"}` | `test_adduct.py::test_adduct_returns_503_when_db_fails` |
| AC-5 | **Given** a request with `Email`, **then** the email address does not appear in the application logs | `test_adduct.py::test_adduct_does_not_log_email` |
| AC-6 | Existing tests in `test_adduct.py` still pass unchanged (response shape unchanged) | existing tests |

## 6. API contract

Request and `200` response unchanged (see spec 003).

New / changed errors:

| Status | When | Body |
|---|---|---|
| 503 | Adduct table cannot be read | `{ "error": "Adduct database unavailable" }` |

Backward compatibility: additive — previously this case returned `200` with empty lists. The frontend already displays `error` messages.

## 7. UI / UX

- No UI change; `Adduct.tsx` shows the `error` text as for other errors. Verify in light and dark mode that the error is visible.

## 8. Non-functional requirements

- **Security / privacy:** no cross-request data; no PII (email) in logs.
- **Performance:** memory per request bounded by that request's log lines.

## 9. Open questions

- [ ] Should the email contain the debug log at all, or only a formatted result table? (Out of scope here; keeps current content but per request.)
