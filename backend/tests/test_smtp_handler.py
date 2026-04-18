def test_smtp_requires_host(client):
    response = client.post("/api/smtp", json={})

    assert response.status_code == 400
    assert response.json() == {"error": "Missing or empty 'host' field"}


def test_smtp_runs_checks_for_open_and_closed_ports(client, monkeypatch):
    monkeypatch.setattr("api.tools.smtp_handler.is_port_open", lambda host, port: port != 465)
    monkeypatch.setattr("api.tools.smtp_handler.test_smtp", lambda host, port: {"port": port, "service": "SMTP", "open": True})
    monkeypatch.setattr("api.tools.smtp_handler.test_smtps", lambda host, port: {"port": port, "service": "SMTPS", "open": True})
    monkeypatch.setattr("api.tools.smtp_handler.test_smtptls", lambda host, port: {"port": port, "service": "SMTPTLS", "open": True})

    response = client.post("/api/smtp", json={"host": "mail.example.com"})

    assert response.status_code == 200
    assert response.json() == {
        "host": "mail.example.com",
        "results": [
            {"port": 25, "service": "SMTP", "open": True},
            {"port": 465, "service": "465", "open": False, "error": "Connection refused or timed out"},
            {"port": 587, "service": "SMTPTLS", "open": True},
        ],
    }
