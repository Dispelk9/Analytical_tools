def test_login_logout_and_check_auth(client):
    response = client.post("/api/login", json={"username": "viet", "password": "secret"})
    assert response.status_code == 200
    assert response.get_json() == {"message": "Logged in"}

    auth_check = client.get("/api/check-auth")
    assert auth_check.status_code == 200
    assert auth_check.get_json() == {"authenticated": True}

    logout = client.post("/api/logout")
    assert logout.status_code == 200
    assert logout.get_json() == {"message": "Logged out"}

    second_check = client.get("/api/check-auth")
    assert second_check.status_code == 401
    assert second_check.get_json() == {"authenticated": False}
