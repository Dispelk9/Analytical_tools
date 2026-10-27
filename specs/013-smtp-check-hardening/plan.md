# 013 — SMTP check hardening — Plan

Spec: [spec.md](./spec.md)

## 1. Approach

- Replace the `tests` list with `(port, service_name, test_function)` tuples → closed ports use `service_name`.
- Run the three `check_port(host, port, service, fn)` calls in a `concurrent.futures.ThreadPoolExecutor(max_workers=3)`; collect results in port order.
- New `is_host_allowed(host) -> bool`: domain-suffix check against `SMTP_CHECK_ALLOWED_DOMAINS`; if `SMTP_CHECK_BLOCK_PRIVATE`, resolve with `socket.getaddrinfo` and reject `ipaddress` private/loopback/link-local/reserved.

## 2. Affected files

| Layer | File | Change |
|---|---|---|
| Backend | `backend/api/tools/smtp_handler.py` | Service names, parallel checks, host policy |
| Tests | `backend/tests/test_smtp_handler.py` | AC-1 … AC-5 (monkeypatch `is_port_open`, `socket.getaddrinfo`) |
| Deploy | `deploy/docker-compose.yml` | Optional env vars (ask before enabling) |
| Docs | `docs/configuration.md` | New env vars |

## 3. Data model

```python
SMTP_CHECKS = [
    (25, "SMTP", test_smtp),
    (465, "SMTPS", test_smtps),
    (587, "SMTPTLS", test_smtptls),
]
```

## 4. Request flow

```
POST /api/smtp → validate host (011) → is_host_allowed → ThreadPoolExecutor(3 ports) → ordered results
```

## 5. Configuration

See spec §8.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| DNS rebinding between check and connect | Accept for internal tool; document |
| Parallel connections look like a scan to remote IDS | Only 3 connections, same as today |

## 7. AGENTS.md checklist

- [ ] No function names start with `_`
- [ ] Default behavior unchanged
- [ ] Tests for every AC
