# NNN — <Feature title> — Tasks

Spec: [spec.md](./spec.md) · Plan: [plan.md](./plan.md)

Work top to bottom. One task ≈ one commit. Note which `AC-n` each task covers.

## Backend

- [ ] T1 — Tests for AC-… in `backend/tests/test_<tool>.py` (`client` fixture, `monkeypatch` for DB / email / external calls)
- [ ] T2 — Helper functions in `backend/services/utils/<tool>_utils.py`
- [ ] T3 — Router + Pydantic model in `backend/api/tools/<tool>.py`
- [ ] T4 — Register router in `create_app()` (`backend/main.py`)
- [ ] T5 — `pytest backend/tests` passes

## Frontend

- [ ] T6 — Test for AC-… in `frontend/src/test/pages/<Tool>.test.tsx` (`vi.stubGlobal('fetch', vi.fn())`)
- [ ] T7 — Page `frontend/src/pages/<Tool>.tsx` (typed interfaces, `authFetch`, loading / error states)
- [ ] T8 — Route in `App.tsx` + tile in `data/toolThemes.ts`
- [ ] T9 — Review in **light** and **dark** mode (DevTools → Rendering → Emulate `prefers-color-scheme`)
- [ ] T10 — `npm run lint` and `npm run test:run` pass

## Wrap-up

- [ ] T11 — Run the full stack with `docker-compose.debug.yml` and test it end to end
- [ ] T12 — Docs in `docs/` updated if setup, env vars or behavior changed
- [ ] T13 — Every AC in spec.md links to a passing test
- [ ] T14 — spec.md updated if the implementation diverged; set `Status: Done`
