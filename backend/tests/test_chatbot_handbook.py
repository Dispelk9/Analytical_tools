import subprocess


def test_handbook_validates_and_handles_missing_root(client, monkeypatch):
    response = client.post("/api/handbook", data="[]", content_type="application/json")
    assert response.status_code == 400
    assert response.get_json() == {"error": "Invalid JSON body"}

    monkeypatch.setattr("chatbot.handbook.os.path.isdir", lambda path: False)
    response = client.post("/api/handbook", json={"Prompt_string": "deploy"})
    assert response.status_code == 500
    assert response.get_json()["error"] == "HANDBOOK_ROOT is not available in container"


def test_handbook_returns_matches(client, monkeypatch):
    monkeypatch.setattr("chatbot.handbook.os.path.isdir", lambda path: True)
    monkeypatch.setattr(
        "chatbot.handbook.subprocess.run",
        lambda *args, **kwargs: subprocess.CompletedProcess(args[0], 0, stdout="docs/runbook.md\nmatch", stderr=""),
    )

    response = client.post("/api/handbook", json={"Prompt_string": "deploy"})

    assert response.status_code == 200
    assert response.get_json() == {
        "mode": "handbook",
        "candidates": [{"content": {"parts": [{"text": "docs/runbook.md\nmatch"}]}}],
    }
