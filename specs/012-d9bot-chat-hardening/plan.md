# 012 — D9bot chat hardening — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

- Extract the shared logic of both routes into `run_gemini_prompt(prompt, recipient) -> tuple[dict, list[str]]` in `api_routes.py` to avoid a third copy of the error mapping.
- `get_gemini_api_key()` raises a dedicated `GeminiNotConfiguredError(RuntimeError)`; routes map it to `503`.
- Replace `logging.info("Incoming JSON: %s", data)` and `"Response JSON"` with metadata-only log lines.
- `@router.post("/api/gemini", deprecated=True)` + `response.headers["Deprecation"] = "true"`.

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/api/chatbot/api_routes.py` | Shared helper, 503 mapping, log redaction, deprecation |
| Backend | `backend/services/chatbot/gemini.py` | `GeminiNotConfiguredError` |
| Tests | `backend/tests/test_chatbot_chat.py` (new) | AC-1 … AC-6 |
| Tests | `backend/tests/test_chatbot_gemini.py` | AC-7 |

## 3. Data model

No change.

## 4. Request flow

```
D9bot.tsx → POST /api/chat → run_gemini_prompt → gemini.call_gemini → Gemini API
                                    ├─ GeminiNotConfiguredError → 503
                                    ├─ HTTPError 429 → 429 / other → 502
                                    └─ RequestException → 502
```

## 5. Configuration

Unchanged (`GOOGLE_API_KEY`, `GEMINI_API_KEY_FILE`, `GEMINI_MODEL`).

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Harder debugging without prompt logs | Log prompt length + upstream status; reproduce with the user's prompt if needed |

## 7. AGENTS.md checklist

- [ ] No function names start with `_`
- [ ] No removal of `/api/gemini` (only deprecation)
- [ ] No secrets / prompts in logs
- [ ] Tests for every AC
