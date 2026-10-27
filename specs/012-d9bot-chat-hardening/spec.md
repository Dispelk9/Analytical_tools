# 012 — D9bot chat hardening

- **Status:** Draft
- **Priority:** P2
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** [007 D9bot chat](../007-d9bot-chat/spec.md), [011 Errors & limits](../011-consistent-errors-and-input-limits/spec.md)

## 1. Context / Problem

- `/api/chat` (the endpoint the frontend uses) has **no backend test**; only the legacy `/api/gemini` is tested.
- A missing Gemini API key raises `RuntimeError` → unhandled `500`.
- Full prompts (and on `/api/gemini` full responses) are logged at INFO — prompts may contain internal or personal data.
- `/api/gemini` duplicates `/api/chat` and is unused by the frontend, but still callable.

## 2. Goals

- `/api/chat` fully covered by tests (success, empty answer, email, 400, 429, 502, missing key).
- Missing key → `503 {"error": "D9bot is not configured"}`.
- Logs contain prompt length and request outcome, not prompt/response text.
- `/api/gemini` marked deprecated (header + OpenAPI), not removed.

## 3. Non-goals

- Removing `/api/gemini` (needs separate approval — removing functionality).
- Conversation history, streaming, model picker.

## 4. User stories

- As a **user**, I want a clear message when D9bot is not available, so that I don't think my prompt was wrong.
- As an **operator**, I want prompts kept out of logs, so that sensitive questions are not stored in log aggregation.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** Gemini returns text parts, **when** `POST /api/chat`, **then** `200` with joined text in `candidates[0].content.parts[0].text` | `backend/tests/test_chatbot_chat.py::test_chat_returns_joined_text` |
| AC-2 | **Given** Gemini returns no text, **then** text is `"No response received."` | `test_chatbot_chat.py::test_chat_empty_answer` |
| AC-3 | **Given** `Email` set, **then** email sent with prompt + answer; **given** empty, no email | `test_chatbot_chat.py::test_chat_sends_email_only_when_requested` |
| AC-4 | **Given** Gemini 429 → `429`; other HTTP error → `502`; network error → `502` | `test_chatbot_chat.py::test_chat_maps_upstream_errors` |
| AC-5 | **Given** no API key configured, **then** `503 {"error": "D9bot is not configured"}` on both endpoints | `test_chatbot_chat.py::test_chat_returns_503_without_api_key` |
| AC-6 | **Given** any chat request, **then** logs contain neither the prompt text nor the response text | `test_chatbot_chat.py::test_chat_does_not_log_prompt_or_response` |
| AC-7 | **When** `POST /api/gemini`, **then** response has header `Deprecation: true` and OpenAPI marks it `deprecated` | `test_chatbot_gemini.py::test_gemini_endpoint_is_deprecated` |

## 6. API contract

`/api/chat` success shape unchanged (spec 007).

| Status | When | Body |
|---|---|---|
| 503 | API key missing | `{ "error": "D9bot is not configured" }` |

`/api/gemini`: unchanged body, adds `Deprecation: true` header.

Backward compatibility: additive (503 instead of crash 500; new header).

## 7. UI / UX

- D9bot page shows the `error` text in the chat as a system message (existing behavior for errors). Verify system bubble (`--bubble-system`) readable in light and dark mode.

## 8. Non-functional requirements

- Log line format: `chat request prompt_chars=<n> email=<yes|no> status=<code>`.

## 9. Open questions

- [ ] Date to remove `/api/gemini` (separate spec, needs approval).
