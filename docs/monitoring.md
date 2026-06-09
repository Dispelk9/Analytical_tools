# Monitoring

The stack includes Prometheus and Grafana for local and deployed observability.

## Services

- `prometheus` scrapes the backend `/metrics` endpoint and Prometheus itself.
- `grafana` starts with Prometheus already provisioned as the default data source.
- The `Analytical Tools Backend Overview` dashboard is provisioned automatically.

## Local Debug

Start the debug stack:

```bash
docker compose -f deploy/docker-compose.debug.yml up --build
```

Default local URLs:

- Prometheus: http://127.0.0.1:9090
- Grafana: http://127.0.0.1:3000

For local development, Grafana defaults to `admin` / `admin`. Override it with:

```bash
GRAFANA_ADMIN_USER=admin GRAFANA_ADMIN_PASSWORD=strong-local-password docker compose -f deploy/docker-compose.debug.yml up --build
```

## Production

Set `GRAFANA_ADMIN_PASSWORD` before starting the production compose stack. The production compose file is intended to run from the deployment root used by `deploy/deploy.sh`, where it is available as `docker-compose.yml` alongside `backend/`, `deploy/`, and `secrets/`.

```bash
GRAFANA_ADMIN_PASSWORD=your-strong-password TAG=your-image-tag docker compose up -d
```

Prometheus and Grafana bind to loopback by default:

- `PROMETHEUS_BIND`, default `127.0.0.1:9090`
- `GRAFANA_BIND`, default `127.0.0.1:3000`

Use a reverse proxy, VPN, or SSH tunnel if Grafana needs remote access.

## Backend Metrics

The backend exposes:

- `analytical_tools_http_requests_total`
- `analytical_tools_http_request_duration_seconds`

The metrics endpoint is intentionally excluded from request metrics to avoid self-scrape noise.
