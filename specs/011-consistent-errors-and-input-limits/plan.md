# 011 — Consistent errors and input limits — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

1. In `create_app()` add two handlers next to the existing `HTTPException` handler:
   - `RequestValidationError` → `422 {"error": <first error summarized>, "detail": exc.errors()}`
   - `Exception` → `logging.exception(...)`, `500 {"error": "Internal server error"}`
2. Fix `convert_float` to handle `int`/`float` and raise `ValueError("Invalid number: <value>")`; routes map `ValueError` to `400`.
3. Add limits via Pydantic `Field(max_length=...)` / validators on the existing request models. `operation: Literal["positive", "negative"] | None` + explicit `400` check to keep the 400 status the frontend expects.
4. Remove exception text from `500` bodies in Compound and `/api/gemini`.

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/main.py` | Two new exception handlers in `create_app()` |
| Backend | `backend/services/utils/adduct_utils.py` | `convert_float` accepts numbers |
| Backend | `backend/api/tools/adduct.py` | Validate `operation`; map `ValueError` → 400 |
| Backend | `backend/api/tools/compound.py` | Map `ValueError` → 400; generic 500 body |
| Backend | `backend/api/tools/act_math.py` | `max_length=10_000` on `x`, `y` |
| Backend | `backend/api/chatbot/api_routes.py` | Prompt `max_length=8_000`; generic 500 body |
| Backend | `backend/api/tools/smtp_handler.py` | Host validator |
| Tests | `backend/tests/test_error_handling.py` (new), `test_adduct_utils.py` (new), existing tool tests | AC-1 … AC-9 |

## 3. Data model

```python
MAX_PROMPT_CHARS = 8_000
MAX_PLOT_POINTS = 10_000
HOSTNAME_PATTERN = re.compile(r"^[A-Za-z0-9.-]{1,253}$")   # plus IPv4; IPv6 optional

class CollisionRequest(BaseModel):
    x: list[float] | None = Field(default=None, max_length=MAX_PLOT_POINTS)
    y: list[float] | None = Field(default=None, max_length=MAX_PLOT_POINTS)
```

## 4. Request flow

```
route raises ValueError        → 400 {"error": "..."}
route raises HTTPException     → existing handler
Pydantic fails                 → 422 {"error", "detail"}
anything else                  → 500 {"error": "Internal server error"} + logged stack trace
```

## 5. Configuration

None (limits are constants; can become env vars later if needed).

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Frontend parses `detail` somewhere | grep `frontend/src` for `.detail` before change; field is kept |
| Too-strict host regex blocks valid hosts (IPv6) | Allow IPv4/IPv6 via `ipaddress` module as alternative |

## 7. AGENTS.md checklist

- [ ] No function names start with `_`
- [ ] Explicit error handling, no leaked internals
- [ ] Status-code changes documented in spec + PR (no silent API change)
- [ ] Tests for every AC
