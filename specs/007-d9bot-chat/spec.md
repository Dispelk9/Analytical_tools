# 007 — D9bot chat (Gemini)

- **Status:** Done (baseline — documents existing behavior)
- **Author:** Viet Hoang
- **Created:** 2026-10-15
- **Related:** `backend/api/chatbot/api_routes.py`, `backend/services/chatbot/gemini.py`, `frontend/src/pages/D9bot.tsx`, `frontend/src/components/D9bot/`, `frontend/src/components/PromptBar.tsx`

## 1. Context / Problem

Users want an AI assistant inside the platform. D9bot sends a prompt to Google Gemini and shows the answer. (Previously routed via Hermes/Telegram; now calls Gemini directly.)

## 2. Goals

- Send a single prompt to Gemini and return the answer text.
- Optionally email prompt + answer.

## 3. Non-goals

- Conversation memory — every request is stateless (no history sent to Gemini).
- Model selection in the UI.
- Streaming responses.

## 4. User stories

- As a **user**, I want to ask D9bot a question, so that I get an answer without leaving the platform.

## 5. Acceptance criteria

| ID | Given / When / Then | Test |
|---|---|---|
| AC-1 | **Given** an empty/blank `Prompt_string`, **when** `POST /api/chat` or `/api/gemini`, **then** `400 {"error": "Please enter a prompt for D9 Bot"}` | `backend/tests/test_chatbot_gemini.py::test_gemini_validates_prompt` (only `/api/gemini`) |
| AC-2 | **Given** a prompt, **when** `POST /api/chat`, **then** `200` with `candidates[0].content.parts[0].text` = joined answer texts and the raw `gemini_response` | — (no test yet) |
| AC-3 | **Given** a prompt, **when** `POST /api/gemini`, **then** `200` with the raw Gemini response | `test_chatbot_gemini.py::test_gemini_returns_upstream_response_and_sends_email` |
| AC-4 | **Given** `Email` is set, **then** prompt and answer are emailed | `test_chatbot_gemini.py::test_gemini_returns_upstream_response_and_sends_email` (only `/api/gemini`) |
| AC-5 | **Given** Gemini returns 429, **then** `429 {"error": "Gemini rate limited. Please retry."}` | — (no test yet) |
| AC-6 | **When** the user sends a prompt in the D9bot page, **then** it is posted to `/api/chat`; send is disabled while the prompt is empty; no model picker | `frontend/src/test/pages/D9bot.test.tsx` |
| AC-7 | **When** an answer arrives, **then** only the chat container scrolls, not the page | `frontend/src/test/components/ChatList.test.tsx` |

## 6. API contract

### `POST /api/chat` (used by the frontend)

```http
POST /api/chat
Content-Type: application/json

{ "Prompt_string": "What is an adduct?", "Email": "" }
```

Response `200`:

```json
{
  "candidates": [
    { "content": { "role": "assistant", "parts": [ { "text": "An adduct is ..." } ] } }
  ],
  "gemini_response": { "candidates": [ ... ], "usageMetadata": { ... } }
}
```

Empty answer → text `"No response received."`.

### `POST /api/gemini` (legacy, not used by the frontend)

Same request; returns the raw Gemini `generateContent` response.

Errors:

| Status | When | Body |
|---|---|---|
| 400 | Blank prompt | `{ "error": "Please enter a prompt for D9 Bot" }` |
| 429 | Gemini rate limit | `{ "error": "Gemini rate limited. Please retry." }` |
| 502 | Other Gemini HTTP error | `{ "error": "Upstream error from Gemini", "details": "...", "upstream_http": 500 }` |
| 502 | Network error (`/api/chat`) | `{ "error": "Gemini unavailable", "details": "..." }` |
| 500 | Any other error (`/api/gemini`) | `{ "error": "Internal server error", "details": "..." }` |

Auth: protected (Keycloak). Backward compatibility: `/api/chat` mimics Gemini's `candidates` shape so the frontend can parse both.

## 7. UI / UX

- Route `/D9bot`, page `D9bot.tsx` with `PromptBar` and a chat list; sidebar entry under the tool themes.

## 8. Non-functional requirements

| Env var | Purpose | Default |
|---|---|---|
| `GOOGLE_API_KEY` | Gemini API key (preferred) | — |
| `GEMINI_API_KEY_FILE` | Legacy secret file fallback | `/run/secrets/gemini_api_key` |
| `GEMINI_MODEL` | Model name | `gemini-2.5-flash-lite` |
| `SENDER`, `MAIL_PW`, `SMTP_RELAY` | Optional result email | — |

- Gemini timeout 30 s.
- **Security:** API key sent via `X-goog-api-key` header, never logged. Prompts are logged at INFO level.

## 9. Open questions

- [ ] Remove `/api/gemini` now that the frontend only uses `/api/chat`? (Would be an API removal — ask first.)
- [ ] Should conversation history be sent for multi-turn chats?

## 10. Known gaps

- `/api/chat` has no backend test.
- If the API key is missing, `/api/chat` raises `RuntimeError` → unhandled `500` without `{"error": ...}`.
- Full prompts (and on `/api/gemini` full responses) are logged — may contain sensitive data.
