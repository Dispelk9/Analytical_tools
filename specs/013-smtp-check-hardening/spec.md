# 013 — SMTP check hardening

- **Status:** Draft
- **Priority:** P3
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [005 SMTP check](../005-smtp-check/spec.md), [011](../011-consistent-errors-and-input-limits/spec.md) (host validation)

## 1. Context / Problem

- Closed ports report `service: "25"` instead of `"SMTP"` because the service name is read from a non-existent docstring.
- The three ports are checked one after another: worst case ~45 s per request, holding a server thread.
- Any authenticated user can make the backend connect to **any** host on ports 25/465/587, including internal network addresses (outbound probing / SSRF-like).

## 2. Goals

- Correct service names for closed ports.
- Check the three ports in parallel → worst case ~15 s.
- Optional allow-list of target domains/networks for production.

## 3. Non-goals

- Certificate details, sending test mails.

## 4. User stories

- As an **operator**, I want fast and correct SMTP results, so that I can diagnose mail problems quickly.
- As a **security owner**, I want to restrict which hosts can be probed, so that the backend can't be used to scan internal networks.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** a closed port, **then** `service` is `SMTP` / `SMTPS` / `SMTPTLS` for 25 / 465 / 587 | `backend/tests/test_smtp_handler.py::test_closed_ports_report_service_name` |
| AC-2 | **Given** all three ports time out, **then** the request finishes in about one timeout (parallel), results ordered 25, 465, 587 | `test_smtp_handler.py::test_ports_are_checked_in_parallel` |
| AC-3 | **Given** `SMTP_CHECK_ALLOWED_DOMAINS=example.com`, **when** host `mail.other.org`, **then** `403 {"error": "Host is not allowed"}`; `mail.example.com` is allowed | `test_smtp_handler.py::test_allowlist_blocks_other_hosts` |
| AC-4 | **Given** `SMTP_CHECK_BLOCK_PRIVATE=true` and host resolving to a private/loopback/link-local IP, **then** `403` | `test_smtp_handler.py::test_private_addresses_blocked` |
| AC-5 | **Given** neither variable set, **then** behavior is as today (any host allowed) | `test_smtp_handler.py::test_no_restrictions_by_default` |

## 6. API contract

Response shape unchanged. New error:

| Status | When | Body |
|---|---|---|
| 403 | Host not allowed by policy | `{ "error": "Host is not allowed" }` |

Backward compatibility: unchanged unless the new env vars are set.

## 7. UI / UX

- No change; 403 message shown like other errors (check light/dark).

## 8. Non-functional requirements

| Env var | Purpose | Default |
|---|---|---|
| `SMTP_CHECK_ALLOWED_DOMAINS` | Comma-separated domain suffixes allowed | empty = all |
| `SMTP_CHECK_BLOCK_PRIVATE` | Block private / loopback / link-local IPs | `false` |

## 9. Open questions

- [ ] Should production default to `SMTP_CHECK_BLOCK_PRIVATE=true`? (Operators may need to test internal relays.)
