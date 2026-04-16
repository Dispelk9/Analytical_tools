import requests


def test_chat_validates_prompt(client):
    response = client.post("/api/chat", json={"Prompt_string": "   "})

    assert response.status_code == 400
    assert response.get_json() == {"error": "Please enter a prompt for D9 Bot"}


def test_chat_routes_handbook_mode_through_hermes_and_persists_session(client, monkeypatch):
    posted = {}
    sent = []

    monkeypatch.setattr("chatbot.chat.search_handbook_text", lambda prompt: f"handbook context for {prompt}")
    monkeypatch.setattr("chatbot.chat.send_email", lambda lines, recipient: sent.append((lines, recipient)))

    class DummyResponse:
        status_code = 200

        def raise_for_status(self):
            return None

        def json(self):
            return {
                "output_text": "Use the runbook in docs/deploy.md",
                "output": [
                    {
                        "type": "message",
                        "content": [{"text": "Use the runbook in docs/deploy.md"}],
                    }
                ],
            }

    def fake_post(url, headers, json, timeout):
        posted["url"] = url
        posted["headers"] = headers
        posted["json"] = json
        posted["timeout"] = timeout
        return DummyResponse()

    monkeypatch.setattr("chatbot.chat.requests.post", fake_post)

    response = client.post(
        "/api/chat",
        json={
            "Prompt_string": "How do I deploy?",
            "Email": "ops@example.com",
            "Mode": "handbook",
        },
    )

    assert response.status_code == 200
    body = response.get_json()
    assert body["mode"] == "handbook"
    assert body["candidates"][0]["content"]["parts"][0]["text"] == "Use the runbook in docs/deploy.md"
    assert body["conversation_id"].startswith("d9bot-")
    assert posted["url"] == "http://hermes:8642/v1/responses"
    assert posted["json"]["conversation"] == body["conversation_id"]
    assert posted["json"]["store"] is True
    assert "handbook context for How do I deploy?" in posted["json"]["input"]
    assert sent == [
        (
            [
                "Prompt: How do I deploy?",
                "Mode: handbook",
                "Response:",
                "Use the runbook in docs/deploy.md",
            ],
            "ops@example.com",
        )
    ]

    second = client.post("/api/chat", json={"Prompt_string": "Follow-up", "Mode": "gemini"})
    assert second.status_code == 200
    assert posted["json"]["conversation"] == body["conversation_id"]


def test_chat_handles_hermes_unavailable(client, monkeypatch):
    monkeypatch.setattr(
        "chatbot.chat.requests.post",
        lambda *args, **kwargs: (_ for _ in ()).throw(requests.ConnectionError("connection refused")),
    )

    response = client.post("/api/chat", json={"Prompt_string": "Hello"})

    assert response.status_code == 502
    assert response.get_json()["error"] == "Hermes unavailable"
