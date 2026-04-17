# ACT v2.0 (Analytical Chemistry Toolkit)

## Overview

**ACT v2.0** is a web-based toolkit for analytical chemistry, infrastructure operations, and internal support workflows.

The platform combines:
- analytical chemistry utilities
- infrastructure and mail diagnostics
- authenticated dashboard-style frontend
- backend API services
- D9bot chat with two operating modes:
  - local handbook search
  - Hermes-powered AI chat backed by Gemini

---

## Core Features

### Analytical Chemistry
- **Adduct Calculator**
- **Compound Tools**
- **ACT Math**

### Chat & Knowledge Access
- **D9bot Handbook Mode**: local handbook lookup through backend `rg` search, no Hermes/Gemini usage
- **D9bot AI Mode**: backend forwards prompts to Hermes Gateway, which uses Gemini for responses and conversation memory

### Infrastructure & Diagnostics
- **SMTP Check**
- **Certificate / mail diagnostics**
- **Operational and infrastructure dashboard modules**

---

## Architecture

### Whole System

```text
User Browser
    |
    v
Frontend (React + Vite + Porsche Design System)
    |
    v
Backend API (Flask)
    |
    +---------------------------> PostgreSQL
    |
    +---------------------------> Local analytical / SMTP / utility endpoints
    |
    +---------------------------> Handbook search endpoint
    |                               |
    |                               v
    |                         handbook_data volume
    |                               ^
    |                               |
    +---------------------------> Hermes Gateway API
                                    |
                                    v
                               Gemini provider


Supporting services

handbook-sync container
    |
    v
Pulls vho-handbook repo into handbook_data volume

Hermes container
    |
    +--> reads config from /opt/data/config.yaml
    +--> reads handbook mount at /workspace/handbook
    +--> serves API at port 8642 inside the Docker network
```

### D9bot Request Paths

```text
Handbook Mode

Frontend
  -> POST /api/handbook
  -> Backend searches HANDBOOK_ROOT with ripgrep
  -> Backend returns local matches
  -> No Hermes call
  -> No Gemini quota usage


AI Mode

Frontend
  -> POST /api/chat
  -> Backend forwards request to Hermes
  -> Hermes calls Gemini
  -> Hermes returns response + conversation continuity
```

---

## D9bot Behavior

### Handbook Mode

Handbook mode is intentionally local-first.

- Frontend calls `/api/handbook`
- Backend searches the synced handbook under `HANDBOOK_ROOT`
- Results are returned directly to the UI
- This path does **not** consume Hermes or Gemini quota

Current implementation:
- search is keyword-based via `rg`
- results depend on text matches in the handbook
- semantically similar wording may still miss relevant sections

### AI Mode

AI mode is Hermes-backed.

- Frontend calls `/api/chat`
- Backend calls Hermes at `HERMES_BASE_URL`
- Hermes uses the configured provider, currently Gemini
- Conversation state is preserved through a Hermes conversation id stored in the Flask session

This mode is the one that uses external model quota.

---

## Deployment Architecture

The production Docker stack is defined in [deploy/docker-compose.yml](/home/vho/Codebase/Analytical_tools/deploy/docker-compose.yml:1).

Main services:
- `frontend`: Apache-served frontend
- `backend`: Flask API service
- `postgres`: application database
- `hermes`: Hermes Gateway API service
- `handbook-sync`: sync job for the private handbook repository

Shared volumes:
- `postgres_data`: Postgres persistence
- `handbook_data`: synced handbook content
- `hermes_data`: Hermes state/config storage

Handbook mounts:
- backend reads handbook at `/data/vho-handbook`
- Hermes reads handbook at `/workspace/handbook`

Hermes config:
- mounted from [deploy/hermes/config.yaml](/home/vho/Codebase/Analytical_tools/deploy/hermes/config.yaml:1)

---

## Environment Layout

### Compose-Level Env

The deploy pipeline writes `~/app/.env` for Docker Compose parse-time variables.

Important values:
- `DB_PASSWORD`
- `TAG`
- `HERMES_API_KEY`
- `HERMES_INFERENCE_PROVIDER`
- `GOOGLE_API_KEY`
- `HERMES_MODEL`
- `SIGNAL_ACCOUNT`
- `SIGNAL_DEVICE_NAME`
- `SIGNAL_ALLOWED_USERS`

### Backend Env

The deploy pipeline also writes `~/app/backend/.env` for backend-only runtime settings.

Typical values:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `SESSION_SECRET`
- `SENDER`
- `MAIL_PW`
- `SMTP_RELAY`
- `GEMINI_MODEL`

---

## Project Structure

```text
backend/    Flask API, chat logic, handbook search, analytical tools
frontend/   React UI
deploy/     Docker Compose, deploy scripts, Hermes config
docs/       Project documentation
```

Important backend endpoints:
- `/api/chat`: Hermes-backed AI mode
- `/api/handbook`: local handbook search mode
- `/health/hermes`
- `/health/handbook`
- `/api/gemini`: older direct Gemini path still present in backend

---

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Porsche Design System

### Backend
- Python
- Flask
- PostgreSQL
- ripgrep for handbook lookup

### Infrastructure
- Docker Compose
- Hermes Gateway
- Gemini provider
- GitHub Actions CD

---

## Upstream Links

Useful references for the main technologies used in this stack:

- Hermes Agent (GitHub): https://github.com/NousResearch/hermes-agent
- Hermes Agent (docs): https://nousresearch.github.io/hermes-agent/
- Gemini API docs: https://ai.google.dev/docs
- React docs: https://react.dev/
- Vite docs: https://vite.dev/
- Flask docs: https://flask.palletsprojects.com/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Porsche Design System React docs: https://designsystem.porsche.com/v3/developing/react/getting-started/

---

## Notes

- Hermes is mounted with handbook data, but handbook mode currently does **not** use Hermes.
- The handbook is synced from the private `vho-handbook` repository into the Docker volume `handbook_data`.
- If handbook mode returns no results, that is currently a local text-search limitation rather than an AI limitation.

---

## License & Usage

ACT v2.0 is a private internal project for experimentation, internal tooling, and operational support.
