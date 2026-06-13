import json
import os
import time
from dataclasses import dataclass
from typing import Any

import jwt
import requests
from fastapi import HTTPException, Request
from jwt import PyJWTError
from jwt.algorithms import RSAAlgorithm


JWKS_CACHE_SECONDS = 300
AUTH_PROVIDER_KEYCLOAK = "keycloak"
AUTH_PROVIDER_DISABLED = "disabled"

jwks_cache: dict[str, tuple[float, dict[str, Any]]] = {}


@dataclass(frozen=True)
class KeycloakConfig:
    issuer: str
    jwks_url: str
    client_id: str


@dataclass(frozen=True)
class AuthenticatedUser:
    provider: str
    subject: str
    username: str
    claims: dict[str, Any]


def get_auth_provider() -> str:
    return os.getenv("AUTH_PROVIDER", AUTH_PROVIDER_KEYCLOAK).strip().lower()


def is_auth_disabled() -> bool:
    return get_auth_provider() == AUTH_PROVIDER_DISABLED


def get_keycloak_config() -> KeycloakConfig:
    issuer = os.getenv("KEYCLOAK_ISSUER", "").strip().rstrip("/")
    jwks_url = os.getenv("KEYCLOAK_JWKS_URL", "").strip()
    client_id = os.getenv("KEYCLOAK_CLIENT_ID", "").strip()

    missing = [
        name
        for name, value in {
            "KEYCLOAK_ISSUER": issuer,
            "KEYCLOAK_JWKS_URL": jwks_url,
            "KEYCLOAK_CLIENT_ID": client_id,
        }.items()
        if not value
    ]
    if missing:
        raise HTTPException(
            status_code=500,
            detail={"error": "Keycloak authentication is not configured", "missing": missing},
        )

    return KeycloakConfig(issuer=issuer, jwks_url=jwks_url, client_id=client_id)


def get_bearer_token(request: Request) -> str:
    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        raise HTTPException(status_code=401, detail="Missing bearer token")
    return token.strip()


def clear_keycloak_jwks_cache() -> None:
    jwks_cache.clear()


def fetch_keycloak_jwks(jwks_url: str) -> dict[str, Any]:
    cached = jwks_cache.get(jwks_url)
    now = time.time()
    if cached and cached[0] > now:
        return cached[1]

    try:
        response = requests.get(jwks_url, timeout=5)
        response.raise_for_status()
        jwks = response.json()
    except requests.RequestException as exc:
        raise HTTPException(status_code=503, detail="Unable to fetch Keycloak signing keys") from exc
    except ValueError as exc:
        raise HTTPException(status_code=503, detail="Invalid Keycloak signing key response") from exc

    jwks_cache[jwks_url] = (now + JWKS_CACHE_SECONDS, jwks)
    return jwks


def get_signing_key(token: str, config: KeycloakConfig):
    try:
        header = jwt.get_unverified_header(token)
    except PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid bearer token") from exc

    key_id = header.get("kid")
    if not key_id:
        raise HTTPException(status_code=401, detail="Bearer token is missing key id")

    jwks = fetch_keycloak_jwks(config.jwks_url)
    for key in jwks.get("keys", []):
        if key.get("kid") == key_id:
            return RSAAlgorithm.from_jwk(json.dumps(key))

    clear_keycloak_jwks_cache()
    jwks = fetch_keycloak_jwks(config.jwks_url)
    for key in jwks.get("keys", []):
        if key.get("kid") == key_id:
            return RSAAlgorithm.from_jwk(json.dumps(key))

    raise HTTPException(status_code=401, detail="Bearer token signing key is unknown")


def token_matches_client(claims: dict[str, Any], client_id: str) -> bool:
    audience = claims.get("aud", [])
    if isinstance(audience, str):
        audience_values = [audience]
    else:
        audience_values = list(audience)

    authorized_party = claims.get("azp")
    return authorized_party == client_id or client_id in audience_values


def validate_keycloak_token(token: str) -> dict[str, Any]:
    config = get_keycloak_config()
    signing_key = get_signing_key(token, config)

    try:
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=config.issuer,
            options={"verify_aud": False},
        )
    except PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid bearer token") from exc

    if not token_matches_client(claims, config.client_id):
        raise HTTPException(status_code=401, detail="Bearer token was not issued for this client")

    return claims


def get_current_keycloak_user(request: Request) -> AuthenticatedUser:
    token = get_bearer_token(request)
    claims = validate_keycloak_token(token)
    username = claims.get("preferred_username") or claims.get("email") or claims.get("sub", "")
    return AuthenticatedUser(
        provider=AUTH_PROVIDER_KEYCLOAK,
        subject=str(claims.get("sub", "")),
        username=str(username),
        claims=claims,
    )
