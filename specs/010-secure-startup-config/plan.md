# 010 — Secure startup configuration — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

Add a small module `backend/services/utils/startup_config.py` with one function `validate_startup_config(session_secret: str | None) -> str` that checks env vars and returns the resolved secret, raising `ConfigError` with all problems at once. Call it at the top of `create_app()` and remove the `"change-me"` fallback.

`create_app(session_secret=...)` keeps its parameter so tests can inject a secret.

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/services/utils/startup_config.py` | New: `ConfigError`, `validate_startup_config()` |
| Backend | `backend/main.py` | Call validator in `create_app()`; remove `"change-me"` default |
| Backend | `backend/api/auth_backend/keycloak.py` | Reuse provider constants; reject unknown provider |
| Tests | `backend/tests/test_startup_config.py` | AC-1 … AC-6 |
| Deploy | `deploy/` env examples, `act_cd.yml` | Document required length (no real values) |
| Docs | `docs/configuration.md` | New: required env vars table |

## 3. Data model

```python
class ConfigError(RuntimeError):
    pass

MIN_SESSION_SECRET_LENGTH = 32
INSECURE_SESSION_SECRETS = frozenset({"", "change-me"})
```

## 4. Request flow

```
gunicorn → main:app → create_app() → validate_startup_config() → ConfigError → worker exits, log names missing vars
```

## 5. Configuration

See spec §8.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Production stops starting after deploy | Check GitHub secret `SESSION_SECRET` length before merging; mention in PR |
| Module-level `app = create_app()` runs at import in tests | `conftest.py` already sets `AUTH_PROVIDER=disabled` before import |

## 7. AGENTS.md checklist

- [ ] No function names start with `_`
- [ ] No secrets in code or error messages
- [ ] Behavior change (fail fast) clearly warned in PR description
- [ ] Tests for new infrastructure
