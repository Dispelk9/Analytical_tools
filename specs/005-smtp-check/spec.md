# 005 — SMTP check

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/tools/smtp_handler.py`, `frontend/src/pages/Smtpcheck.tsx`

## 1. Context / Problem

Operators need to check quickly whether a mail server accepts connections on the standard SMTP ports and whether TLS works, without logging into a shell.

## 2. Goals

- For a given host, test ports 25 (SMTP + optional STARTTLS), 465 (SMTPS) and 587 (SMTP + STARTTLS) and report the result per port.

## 3. Non-goals

- Sending test mails, authentication tests, certificate details.

## 4. User stories

- As an **operator**, I want to enter a mail server hostname, so that I see which SMTP ports are open and whether TLS works.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** `host` missing or blank, **when** `POST /api/smtp`, **then** `400 {"error": "Missing or empty 'host' field"}` | `backend/tests/test_smtp_handler.py::test_smtp_requires_host` |
| AC-2 | **Given** a host, **then** `200` with one result per port 25, 465, 587; closed ports report `open: false` | `test_smtp_handler.py::test_smtp_runs_checks_for_open_and_closed_ports` |
| AC-3 | **Given** a hostname, **when** "Test SMTP" is clicked, **then** results are rendered | `frontend/src/test/pages/Smtpcheck.test.tsx` |

## 6. API contract

```http
POST /api/smtp
Content-Type: application/json

{ "host": "mail.example.com" }
```

Response `200`:

```json
{
  "host": "mail.example.com",
  "results": [
    { "port": 25,  "service": "SMTP",    "open": true,  "noop_response": "250 OK", "starttls_supported": true, "starttls_result": "Succeeded: 250 OK", "error": null },
    { "port": 465, "service": "SMTPS",   "open": true,  "noop_response": "250 OK", "error": null },
    { "port": 587, "service": "SMTPTLS", "open": true,  "starttls_supported": true, "starttls_result": "Succeeded", "noop_response": "250 OK", "error": null }
  ]
}
```

Closed port: `{ "port": 25, "service": "25", "open": false, "error": "Connection refused or timed out" }`.

Errors:

| Status | When | Body |
|---|---|---|
| 400 | Missing / blank `host` | `{ "error": "Missing or empty 'host' field" }` |

Auth: protected (Keycloak).

## 7. UI / UX

- Route `/smtpcheck`, page `Smtpcheck.tsx`, `LatticeLoader` while running.

## 8. Non-functional requirements

- Timeouts: TCP probe 5 s, SMTP session 10 s per port → worst case ~45 s per request.
- **Security:** any authenticated user can make the backend open connections to any host on ports 25/465/587 (outbound probing). Acceptable for internal users only.

## 9. Open questions

- [ ] Restrict `host` to allowed domains/networks?

## 10. Known gaps

- For closed ports, `service` is the port number as string (`"25"`) instead of `SMTP`/`SMTPS`/`SMTPTLS`, because the test functions have no docstring.
- Ports are tested sequentially.
