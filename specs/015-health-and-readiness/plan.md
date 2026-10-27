# 015 — Liveness, readiness and dependency health — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

Extend the existing `health_router` in `backend/api/chatbot/health_routes.py` (keeps routing in one place; moving it is out of scope). Add small check functions in `backend/services/utils/health_checks.py`:

- `check_database() -> bool` — `psycopg2.connect(..., connect_timeout=2)` + `SELECT 1` using `DB_CONNECT()`.
- `check_handbook() -> bool` — `os.path.isdir(get_handbook_root())`.
- `cached_gemini_health()` — module-level `(expires_at, result)` tuple, TTL 60 s.

Add a Docker healthcheck for the backend:

```yaml
healthcheck:
  test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/health/live', timeout=3)"]
  interval: 30s
  timeout: 5s
  retries: 3
```

(No `curl` in the slim image; Python is available.)

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/services/utils/health_checks.py` | New check functions |
| Backend | `backend/api/chatbot/health_routes.py` | `/health/live`, `/health/ready`, `/health/db`; cache + 503 for gemini |
| Tests | `backend/tests/test_health.py` | AC-1 … AC-6 |
| Deploy | `deploy/docker-compose.yml`, `deploy/docker-compose.debug.yml` | Backend `healthcheck` (**deployment change — ask before merging**) |
| Docs | `docs/monitoring.md` | New endpoints |

## 3. Data model

```python
GEMINI_HEALTH_TTL_SECONDS = 60
DB_HEALTH_TIMEOUT_SECONDS = 2
```

## 4. Request flow

```
Docker → /health/live
Prometheus / operator → /health/ready → check_database + check_handbook
```

## 5. Configuration

Uses existing `DB_*`, `HANDBOOK_ROOT`, `GOOGLE_API_KEY`.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Readiness flaps on short DB hiccups | Docker healthcheck uses `live`, not `ready` |
| Health endpoints reachable from internet | Only `/api` is proxied by Apache; see spec 016 for port exposure |

## 7. AGENTS.md checklist

- [ ] No function names start with `_`
- [ ] Deployment change approved before merge
- [ ] No internal details in responses
- [ ] Tests for new infrastructure
