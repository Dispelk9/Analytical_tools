# 009 — Adduct: per-request logs and visible DB errors — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

Replace the global root-logger `ListHandler` with a **request-scoped collector**: inside `process_number`, create a local `list` and a `ListHandler` attached to a dedicated logger `logging.getLogger("adduct")` only for the duration of the request (`try/finally` removes it). The calculation functions log to `adduct_logger` instead of the root logger.

Concurrency: gunicorn runs several threads per worker, so one shared logger with a temporary handler would still mix concurrent requests. Therefore pass the collector explicitly:

```python
def process_number(payload: AdductRequest):
    request_log: list[str] = []
    ...
    without_h = without_hydro(value_list, db_config, request_log)
```

and helper `record(request_log, message)` that appends to the list **and** calls `logging.info`. Simple, explicit, thread-safe, no global state.

DB errors: `fetch_adduct_table` failures raise a new `AdductDatabaseError`; the route maps it to `HTTPException(503, "Adduct database unavailable")`.

Alternative rejected: `contextvars`-based log filter — more magic, harder to debug (AGENTS.md: avoid hidden side effects).

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/api/tools/adduct.py` | Remove global `log_entries`, root `ListHandler`; add `request_log` param + `record()` helper; raise/map `AdductDatabaseError`; stop logging full payload (`logging.info(data)` → log without `Email`) |
| Backend | `backend/services/handler/ListHandler.py` | Unused after change — keep (no removal without asking) or flag for removal |
| Tests | `backend/tests/test_adduct.py` | AC-1 … AC-5 |

## 3. Data model

No change to `AdductRequest` or response.

## 4. Request flow

```
Adduct.tsx → POST /api/adduct → process_number
                                   ├─ request_log = []
                                   ├─ without_hydro(..., request_log)
                                   ├─ m_calculation(..., request_log)
                                   └─ send_email(request_log, Email)   # only this request
```

## 5. Configuration

None.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Email content changes (fewer lines) | Intended; contains same calculation lines as before minus foreign lines |
| Tests monkeypatch `without_hydro` / `m_calculation` with 2-arg lambdas | Update existing test lambdas to accept the new parameter |

## 7. AGENTS.md checklist

- [ ] Smallest viable change; no unrelated refactors
- [ ] No function names start with `_`
- [ ] Explicit error handling (`HTTPException` 503)
- [ ] No PII in logs
- [ ] API change is additive (503 instead of empty 200) and documented
- [ ] Tests for new behavior
