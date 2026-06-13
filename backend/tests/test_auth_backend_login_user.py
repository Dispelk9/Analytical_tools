def test_password_login_is_disabled(client):
    response = client.post("/api/login", json={"username": "viet", "password": "secret"})
    assert response.status_code == 400
    assert response.json() == {"message": "Password login is disabled. Use Keycloak authentication."}


def test_logout_and_check_auth(client):
    auth_check = client.get("/api/check-auth")
    assert auth_check.status_code == 200
    assert auth_check.json() == {"authenticated": True, "username": "disabled-auth"}

    logout = client.post("/api/logout")
    assert logout.status_code == 200
    assert logout.json() == {"message": "Logged out"}


def test_swagger_docs_and_openapi_are_available(client):
    docs_response = client.get("/docs")
    openapi_response = client.get("/openapi.json")

    assert docs_response.status_code == 200
    assert "Swagger UI" in docs_response.text
    assert openapi_response.status_code == 200
    assert openapi_response.json()["info"]["title"] == "Analytical Tools API"
