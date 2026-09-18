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
  - Gemini-powered AI chat

---

## Core Features

### Analytical Chemistry
- **Adduct Calculator**
- **Compound Tools**
- **ACT Math**

### Chat & Knowledge Access
- **D9bot Handbook Mode**: local handbook lookup through backend `rg` search, no Gemini usage
- **D9bot AI Mode**: backend forwards prompts directly to Gemini for responses, optionally enriched with handbook context

### Infrastructure & Diagnostics
- **SMTP Check**
- **Certificate / mail diagnostics**
- **Operational and infrastructure dashboard modules**

---

## Frontend UI

The authenticated app shell (`AppLayout` in [frontend/src/App.tsx](frontend/src/App.tsx)) is laid out like a sysadmin admin console:

- A slim top navbar ([frontend/src/components/Navbar.tsx](frontend/src/components/Navbar.tsx)) with just the brand and logout.
- A persistent left sidebar ([frontend/src/components/Sidebar.tsx](frontend/src/components/Sidebar.tsx)) showing every tool category as a collapsible tree (all collapsed on first load). It sits next to the routed content rather than inside it, so switching tools never remounts it — its open/active state survives navigation. Internal tools navigate via React Router; external tools open in a new tab.
- The `/` overview ([frontend/src/pages/Dashboard.tsx](frontend/src/pages/Dashboard.tsx)) also lists every external tool as a one-click quick link, for people who land there before exploring the sidebar.
- The main content area scales its width and padding with the browser window instead of being capped at a fixed width.

Categories and tools are defined once in [frontend/src/data/toolThemes.ts](frontend/src/data/toolThemes.ts), and both the sidebar and the dashboard read from it. Adding a new tool means adding a tile there (or a new theme entry for a new category) — no other wiring is required.

---

## Architecture

### Whole System

```text
User Browser
    |
    v
Cloudflare (DNS + proxy, dispelk9.de — NS: emerie/camilo.ns.cloudflare.com)
    |  (TLS termination, DDoS protection, CDN)
    v
nginx reverse proxy (auth.dispelk9.de / demo.dispelk9.de)
    |
    +---------------------------> Keycloak (auth.dispelk9.de)
    |                               |
    |                               v
    |                         Issues JWT tokens
    |
    v
Frontend (React + Vite + Porsche Design System)
    |  (attaches Bearer token to every API request)
    v
Backend API (FastAPI)
    |  (validates JWT against Keycloak JWKS)
    |
    +---------------------------> PostgreSQL
    |
    +---------------------------> Local analytical / SMTP / utility endpoints
    |
    +---------------------------> Handbook search endpoint
    |                               |
    |                               v
    |                         handbook_data volume
    |
    +---------------------------> Gemini provider (direct API call)


Supporting services

Keycloak container
    |
    +--> postgres DB for realm/session persistence
    +--> realm imported from deploy/keycloak/analytical-tools-realm.json
    +--> exposed via nginx at https://auth.dispelk9.de (behind Cloudflare)

handbook-sync container
    |
    v
Pulls vho-handbook repo into handbook_data volume

Prometheus
    |
    +--> scrapes backend /metrics

Grafana
    |
    +--> uses Prometheus as the default provisioned data source
```

### D9bot Request Paths

```text
Handbook Mode

Frontend
  -> POST /api/handbook
  -> Backend searches HANDBOOK_ROOT with ripgrep
  -> Backend returns local matches
  -> No Gemini quota usage


AI Mode

Frontend
  -> POST /api/chat
  -> Backend calls Gemini directly (with handbook context when in handbook mode)
  -> Backend returns response
```

---

## D9bot Behavior

### Handbook Mode

Handbook mode is intentionally local-first.

- Frontend calls `/api/handbook`
- Backend searches the synced handbook under `HANDBOOK_ROOT`
- Results are returned directly to the UI
- This path does **not** consume Gemini quota

Current implementation:
- search is keyword-based via `rg`
- results depend on text matches in the handbook
- semantically similar wording may still miss relevant sections

### AI Mode

AI mode calls Gemini directly.

- Frontend calls `/api/chat`
- Backend calls Gemini using `GOOGLE_API_KEY` / `GEMINI_MODEL`
- In handbook mode with matches, the handbook context is included in the prompt sent to Gemini
- Each request is stateless; there is no server-side conversation memory

This mode is the one that uses external model quota.

---

## Deployment Architecture

The production Docker stack is defined in [deploy/docker-compose.yml](deploy/docker-compose.yml).

Main services:
- `frontend`: Apache-served React frontend (built with Keycloak URLs baked in at CI build time)
- `backend`: FastAPI service (validates Keycloak JWTs)
- `keycloak`: Keycloak 26 identity provider, proxied at `https://auth.dispelk9.de`
- `postgres`: application database and Keycloak session/realm store
- `handbook-sync`: sync job for the private handbook repository
- `prometheus`: scrapes backend `/metrics`, proxied at `https://prometheus.dispelk9.de`
- `grafana`: dashboards over Prometheus, proxied at `https://grafana.dispelk9.de`

Shared volumes:
- `postgres_data`: Postgres persistence (application data + Keycloak realm state)
- `handbook_data`: synced handbook content

Handbook mounts:
- backend reads handbook at `/data/vho-handbook`

### Exposing Prometheus and Grafana

Both stay bound to `127.0.0.1` on the host in `docker-compose.yml` (`PROMETHEUS_BIND`/`GRAFANA_BIND`), and [deploy/nginx-proxy/nginx-act.conf](deploy/nginx-proxy/nginx-act.conf) reverse-proxies them from the same host at `grafana.dispelk9.de` and `prometheus.dispelk9.de`, the same pattern used for Checkmk and Certcheck.

One-time setup on the server before the first deploy:
- Certificates: `certbot certonly --dns-cloudflare ... -d grafana.dispelk9.de` and `-d prometheus.dispelk9.de`
- Prometheus has no login of its own, so its nginx block requires HTTP Basic Auth: `sudo htpasswd -c /etc/nginx/.htpasswd-prometheus <user>`. Grafana is left without this since it has its own login (`GRAFANA_ADMIN_USER`/`GRAFANA_ADMIN_PASSWORD`).

---

## Environment Layout

### Compose-Level Env

The deploy pipeline writes `~/app/.env` for Docker Compose parse-time variables.
For local debug, use shell variables or a repo-root `.env` file for the same Compose-level values.

Important values:
- `DB_PASSWORD`
- `TAG`
- `GOOGLE_API_KEY`
- `GRAFANA_ADMIN_PASSWORD`
- `KEYCLOAK_ADMIN_PASSWORD`

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
- `AUTH_PROVIDER` (set to `keycloak` in production)
- `KEYCLOAK_ISSUER` (e.g. `https://auth.dispelk9.de/realms/analytical-tools`)
- `KEYCLOAK_JWKS_URL` (internal container URL for JWT verification)
- `KEYCLOAK_CLIENT_ID`

---

## Local Debug Setup

For local development, the Docker debug stack is defined in [deploy/docker-compose.debug.yml](deploy/docker-compose.debug.yml).

### Backend Env For Local Debug

Start by creating a local backend env file from [backend/.env.example](backend/.env.example).

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
- `keycloak` (available at `http://localhost:8084`, admin UI at `http://localhost:8084/admin`)
- `backend`
- `frontend`

The private handbook sync service is optional in local development.

To start it too:

```bash
docker compose --profile handbook-sync -f deploy/docker-compose.debug.yml up --build
```

### VS Code F5

This repository includes VS Code launch configs in [.vscode/launch.json](.vscode/launch.json).

Press `F5` and choose one of:
- `Analytical Tools: Up Local Stack`
- `Analytical Tools: Up Local Stack With Handbook Sync`
- `Analytical Tools: Down Local Stack`

### Optional Local Overrides

`deploy/docker-compose.debug.yml` also supports these optional local environment variables:
- `GEMINI_API_KEY_PATH`: host path to your Gemini API key file
- `GOOGLE_API_KEY`: dev fallback if no Gemini key file is mounted
- `HANDBOOK_DEPLOY_KEY_PATH`: host path to the handbook SSH deploy key
- `HANDBOOK_KNOWN_HOSTS_PATH`: host path to the handbook known_hosts file
- `PROMETHEUS_BIND`: Prometheus host bind address, default `127.0.0.1:9090`
- `GRAFANA_BIND`: Grafana host bind address, default `127.0.0.1:3000`
- `GRAFANA_ADMIN_USER`: local Grafana admin username, default `admin`
- `GRAFANA_ADMIN_PASSWORD`: local Grafana admin password, default `admin`

---

## Project Structure

```text
backend/    FastAPI service, chat logic, handbook search, analytical tools
frontend/   React UI
  src/components/  Shared UI (navbar, sidebar, ...)
  src/pages/        Routed tool pages + the dashboard
  src/data/         Tool/category definitions shared by the navbar and dashboard
deploy/     Docker Compose, deploy scripts
docs/       Project documentation
```

Important backend endpoints:
- `/api/chat`: Gemini-backed AI mode
- `/api/handbook`: local handbook search mode
- `/health/handbook`
- `/health/gemini`
- `/metrics`
- `/api/gemini`: direct Gemini path used without handbook context

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

### Auth
- Keycloak 26 (OIDC / PKCE)

### Infrastructure
- Docker Compose
- nginx reverse proxy (Cloudflare + Certbot)
- Prometheus
- Grafana
- Gemini provider
- GitHub Actions CI/CD

---

## Upstream Links

Useful references for the main technologies used in this stack:

- Gemini API docs: https://ai.google.dev/docs
- React docs: https://react.dev/
- Vite docs: https://vite.dev/
- FastAPI docs: https://fastapi.tiangolo.com/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Keycloak docs: https://www.keycloak.org/documentation
- Porsche Design System React docs: https://designsystem.porsche.com/v3/developing/react/getting-started/

---

## Notes

- Handbook mode uses backend-side handbook retrieval before Gemini answer generation.
- The handbook is synced from the private `vho-handbook` repository into the Docker volume `handbook_data`.
- If handbook mode returns no relevant results, that is currently a retrieval limitation rather than an AI limitation.

---

## License & Usage

ACT v2.0 is a private internal project for experimentation, internal tooling, and operational support.
