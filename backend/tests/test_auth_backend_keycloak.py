import json
import time

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient
from jwt.algorithms import RSAAlgorithm

from api.auth_backend.keycloak import clear_keycloak_jwks_cache
from main import create_app


ISSUER = "http://localhost:8082/realms/analytical-tools"
JWKS_URL = "http://keycloak:8080/realms/analytical-tools/protocol/openid-connect/certs"
CLIENT_ID = "analytical-tools-frontend"
KEY_ID = "test-key"


class JwksResponse:
    def raise_for_status(self):
        return None

    def json(self):
        return {}


@pytest.fixture()
def keycloak_auth_client(monkeypatch, tmp_path):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_jwk = json.loads(RSAAlgorithm.to_jwk(private_key.public_key()))
    public_jwk.update({"kid": KEY_ID, "alg": "RS256", "use": "sig"})
    jwks = {"keys": [public_jwk]}

    class TestJwksResponse(JwksResponse):
        def json(self):
            return jwks

    def get_jwks(url, timeout):
        assert url == JWKS_URL
        assert timeout == 5
        return TestJwksResponse()

    monkeypatch.setenv("AUTH_PROVIDER", "keycloak")
    monkeypatch.setenv("KEYCLOAK_ISSUER", ISSUER)
    monkeypatch.setenv("KEYCLOAK_JWKS_URL", JWKS_URL)
    monkeypatch.setenv("KEYCLOAK_CLIENT_ID", CLIENT_ID)
    monkeypatch.setattr("api.auth_backend.keycloak.requests.get", get_jwks)
    clear_keycloak_jwks_cache()

    database_path = tmp_path / "keycloak-test.db"
    app = create_app(
        database_url=f"sqlite:///{database_path}",
        session_secret="test-secret",
        database_connect_args={"check_same_thread": False},
    )

    def make_token(client_id=CLIENT_ID, issuer=ISSUER):
        now = int(time.time())
        claims = {
            "iss": issuer,
            "sub": "debug-user-id",
            "preferred_username": "debug",
            "azp": client_id,
            "iat": now,
            "exp": now + 3600,
        }
        return jwt.encode(claims, private_key, algorithm="RS256", headers={"kid": KEY_ID})

    yield TestClient(app), make_token
    clear_keycloak_jwks_cache()


def test_keycloak_check_auth_accepts_valid_bearer_token(keycloak_auth_client):
    client, make_token = keycloak_auth_client
    response = client.get(
        "/api/check-auth",
        headers={"Authorization": f"Bearer {make_token()}"},
    )

    assert response.status_code == 200
    assert response.json() == {"authenticated": True, "username": "debug"}


def test_keycloak_check_auth_rejects_wrong_client(keycloak_auth_client):
    client, make_token = keycloak_auth_client
    response = client.get(
        "/api/check-auth",
        headers={"Authorization": f"Bearer {make_token(client_id='other-client')}"},
    )

    assert response.status_code == 401


def test_keycloak_mode_protects_tool_routes(keycloak_auth_client):
    client, make_token = keycloak_auth_client

    missing_token = client.post("/api/smtp", json={"host": "mail.example.com"})
    assert missing_token.status_code == 401

    authenticated = client.post(
        "/api/smtp",
        json={"host": ""},
        headers={"Authorization": f"Bearer {make_token()}"},
    )
    assert authenticated.status_code == 400
    assert authenticated.json() == {"error": "Missing or empty 'host' field"}


def test_keycloak_mode_disables_password_login(keycloak_auth_client):
    client, make_token = keycloak_auth_client
    response = client.post(
        "/api/login",
        json={"username": "debug", "password": "debug"},
        headers={"Authorization": f"Bearer {make_token()}"},
    )

    assert response.status_code == 400
    assert response.json() == {"message": "Password login is disabled. Use Keycloak authentication."}
