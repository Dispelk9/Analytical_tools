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
Backend API (FastAPI)
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
- Conversation state is preserved through a Hermes conversation id stored in the backend session
- Telegram now enters through a dedicated backend polling worker, which adds compact handbook context before calling Hermes

This mode is the one that uses external model quota.

---

## Deployment Architecture

The production Docker stack is defined in [deploy/docker-compose.yml](/home/vho/Codebase/Analytical_tools/deploy/docker-compose.yml:1).

Main services:
- `frontend`: Apache-served frontend
- `backend`: FastAPI service
- `telegram-poller`: long-polling Telegram worker using backend retrieval + Hermes
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

Telegram setup and troubleshooting:
- [docs/hermes_telegram_setup.md](/mnt/c/users/viethoang/downloads/vm_shared_folder/codebase/analytical_tools/docs/hermes_telegram_setup.md:1)

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
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_USERS`

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

## Local Debug Setup

For local development, the Docker debug stack is defined in [deploy/docker-compose.debug.yml](/mnt/c/users/viethoang/downloads/vm_shared_folder/codebase/analytical_tools/deploy/docker-compose.debug.yml:1).

### Backend Env For Local Debug

Start by creating a local backend env file from [backend/.env.example](/mnt/c/users/viethoang/downloads/vm_shared_folder/codebase/analytical_tools/backend/.env.example:1).

```bash
cp backend/.env.example backend/.env
```

This file is intentionally safe to commit as an example. Keep `backend/.env` local and do not commit real credentials.

### Start The Local Stack

From the repository root:

```bash
docker compose -f deploy/docker-compose.debug.yml up --build
```

The default local stack starts:
- `postgres`
- `backend`
- `frontend`
- `hermes`
- `telegram-poller`

The private handbook sync service is optional in local development.

To start it too:

```bash
docker compose --profile handbook-sync -f deploy/docker-compose.debug.yml up --build
```

### VS Code F5

This repository includes VS Code launch configs in [.vscode/launch.json](/mnt/c/users/viethoang/downloads/vm_shared_folder/codebase/analytical_tools/.vscode/launch.json:1).

Press `F5` and choose one of:
- `Analytical Tools: Up Local Stack`
- `Analytical Tools: Up Local Stack With Handbook Sync`
- `Analytical Tools: Down Local Stack`

### Optional Local Overrides

`deploy/docker-compose.debug.yml` also supports these optional local environment variables:
- `GEMINI_API_KEY_PATH`: host path to your Gemini API key file
- `HERMES_API_KEY`: API key used by the local Hermes container
- `GOOGLE_API_KEY`: dev fallback if no Gemini key file is mounted
- `HANDBOOK_DEPLOY_KEY_PATH`: host path to the handbook SSH deploy key
- `HANDBOOK_KNOWN_HOSTS_PATH`: host path to the handbook known_hosts file

---

## Project Structure

```text
backend/    FastAPI service, chat logic, handbook search, analytical tools
frontend/   React UI
deploy/     Docker Compose, deploy scripts, Hermes config
docs/       Project documentation
```

Important backend endpoints:
- `/api/chat`: Hermes-backed AI mode
- `/api/handbook`: local handbook search mode
- `/health/hermes`
- `/health/telegram`
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
- FastAPI
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
- FastAPI docs: https://fastapi.tiangolo.com/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Porsche Design System React docs: https://designsystem.porsche.com/v3/developing/react/getting-started/

---

## Notes

- Browser handbook mode and Telegram polling both use backend-side handbook retrieval before Hermes answer generation.
- The handbook is synced from the private `vho-handbook` repository into the Docker volume `handbook_data`.
- If handbook mode or Telegram returns no relevant results, that is currently a retrieval limitation rather than an AI limitation.

---

## License & Usage

ACT v2.0 is a private internal project for experimentation, internal tooling, and operational support.
