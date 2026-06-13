# Keycloak Debug Authentication

The debug Docker stack runs Keycloak as the login provider for Analytical Tools.
This removes the need to insert login users into the application database for
local testing.

## Start The Debug Stack

```bash
docker compose -f deploy/docker-compose.debug.yml up --build
```

Useful local URLs:

- App: <http://localhost:8081>
- Keycloak admin: <http://localhost:8082/admin>
- Keycloak realm: `analytical-tools`
- Frontend client: `analytical-tools-frontend`

Debug credentials created by the realm import:

- Keycloak admin: `admin` / `admin`
- App user: `debug` / `debug`

The admin credentials can be overridden with `KEYCLOAK_ADMIN` and
`KEYCLOAK_ADMIN_PASSWORD` before starting Compose.

## Runtime Behavior

In `deploy/docker-compose.debug.yml`, the backend runs with:

```text
AUTH_PROVIDER=keycloak
KEYCLOAK_ISSUER=http://localhost:8082/realms/analytical-tools
KEYCLOAK_JWKS_URL=http://keycloak:8080/realms/analytical-tools/protocol/openid-connect/certs
KEYCLOAK_CLIENT_ID=analytical-tools-frontend
```

The frontend is built with matching Vite variables:

```text
VITE_KEYCLOAK_URL=http://localhost:8082
VITE_KEYCLOAK_REALM=analytical-tools
VITE_KEYCLOAK_CLIENT_ID=analytical-tools-frontend
```

When a browser opens the app without a valid token, the frontend sends the user
to `/login`. The login page shows a **Sign in with Keycloak** action. After
Keycloak authenticates the user, the browser returns to `/login`, the frontend
exchanges the authorization code using PKCE, and the user is redirected back to
the originally requested page, normally `/`. API calls include the access token
as a bearer token.

## User Management

Create local debug users in Keycloak, not in the application database:

1. Open <http://localhost:8082/admin>.
2. Sign in as `admin`.
3. Select the `analytical-tools` realm.
4. Add or edit users under **Users**.

The application database can still hold app-specific data later, but passwords
should not be stored there when Keycloak is the login provider.

## Local Vite Development

For `npm run dev`, set the same frontend variables in your shell:

```bash
VITE_KEYCLOAK_URL=http://localhost:8082 \
VITE_KEYCLOAK_REALM=analytical-tools \
VITE_KEYCLOAK_CLIENT_ID=analytical-tools-frontend \
npm run dev
```

The imported Keycloak client already allows `http://localhost:5173/*` and
`http://127.0.0.1:5173/*` redirect URIs.

## Realm Import Changes

Keycloak imports files from `deploy/keycloak/` during container startup. If the
realm already exists in the running container, Keycloak keeps the existing realm.
After changing `deploy/keycloak/analytical-tools-realm.json`, recreate the
`keycloak` container so the import starts from a clean local state.
