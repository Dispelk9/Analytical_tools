import requests


def test_chat_validates_prompt(client):
    response = client.post("/api/chat", json={"Prompt_string": "   "})

    assert response.status_code == 400
    assert response.json() == {"error": "Please enter a prompt for D9 Bot"}


def test_chat_routes_handbook_mode_through_hermes_and_persists_session(client, monkeypatch):
    posted = {}
    sent = []

    monkeypatch.setattr(
        "api.chatbot.api_routes.search_handbook_text",
        lambda prompt: f"Handbook matches:\n- docs/runbook.md: handbook context for {prompt}",
    )
    monkeypatch.setattr("api.chatbot.api_routes.send_email", lambda lines, recipient: sent.append((lines, recipient)))

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

    monkeypatch.setattr("services.chatbot.hermes.requests.post", fake_post)

    response = client.post(
        "/api/chat",
        json={
            "Prompt_string": "How do I deploy?",
            "Email": "ops@example.com",
            "Mode": "handbook",
        },
    )

    assert response.status_code == 200
    body = response.json()
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


def test_chat_falls_back_to_gemini_when_handbook_has_no_matches(client, monkeypatch):
    monkeypatch.setattr(
        "api.chatbot.api_routes.search_handbook_text",
        lambda prompt: "No matches found in handbook.",
    )
    monkeypatch.setattr(
        "services.chatbot.gemini.call_gemini",
        lambda prompt: {"candidates": [{"content": {"parts": [{"text": f"gemini:{prompt}"}]}}]},
    )

    hermes_calls = []
    monkeypatch.setattr("services.chatbot.hermes.requests.post", lambda *args, **kwargs: hermes_calls.append((args, kwargs)))

    response = client.post("/api/chat", json={"Prompt_string": "What is Kubernetes?", "Mode": "handbook"})

    assert response.status_code == 200
    assert response.json()["mode"] == "gemini_fallback"
    assert response.json()["conversation_id"] is None
    assert response.json()["candidates"][0]["content"]["parts"][0]["text"] == "gemini:What is Kubernetes?"
    assert hermes_calls == []


def test_chat_handles_hermes_unavailable(client, monkeypatch):
    monkeypatch.setattr(
        "services.chatbot.hermes.requests.post",
        lambda *args, **kwargs: (_ for _ in ()).throw(requests.ConnectionError("connection refused")),
    )

    response = client.post("/api/chat", json={"Prompt_string": "Hello"})

    assert response.status_code == 502
    assert response.json()["error"] == "Hermes unavailable"


def test_telegram_poller_routes_through_handbook_then_hermes(monkeypatch):
    posted = []

    monkeypatch.setenv("TELEGRAM_ALLOWED_USERS", "8638591553")
    monkeypatch.setenv("TELEGRAM_BOT_TOKEN", "token-123")
    monkeypatch.setattr(
        "services.chatbot.telegram_poller.search_handbook_text",
        lambda prompt: "Handbook matches:\n- common/ddi.txt: BlueCat DDI runbook",
    )

    class DummyResponse:
        def __init__(self, payload=None, status_code=200):
            self._payload = payload or {}
            self.status_code = status_code
            self.ok = status_code < 400

        def raise_for_status(self):
            return None

        def json(self):
            return self._payload

    def fake_post(url, headers=None, json=None, timeout=None):
        posted.append({
            "url": url,
            "headers": headers,
            "json": json,
            "timeout": timeout,
        })
        if url == "http://hermes:8642/v1/responses":
            return DummyResponse({
                "output_text": "Your handbook says BlueCat DDI is covered in ddi.txt.",
                "output": [{
                    "type": "message",
                    "content": [{"text": "Your handbook says BlueCat DDI is covered in ddi.txt."}],
                }],
            })
        return DummyResponse({"ok": True})

    monkeypatch.setattr("services.chatbot.hermes.requests.post", fake_post)
    monkeypatch.setattr("services.chatbot.telegram_gateway.requests.post", fake_post)

    from services.chatbot.telegram_poller import handle_telegram_update

    handle_telegram_update(
        {
            "update_id": 1,
            "message": {
                "message_id": 2,
                "from": {"id": 8638591553},
                "chat": {"id": 8638591553, "type": "private"},
                "text": "What does the handbook say about BlueCat?",
            },
        },
    )

    assert posted[0]["url"] == "http://hermes:8642/v1/responses"
    assert posted[0]["json"]["conversation"] == "telegram-8638591553"
    assert "Handbook matches" in posted[0]["json"]["input"]
    assert posted[1]["url"] == "https://api.telegram.org/bottoken-123/sendMessage"
    assert posted[1]["json"]["chat_id"] == 8638591553
    assert "BlueCat DDI" in posted[1]["json"]["text"]


def test_telegram_poller_uses_hermes_when_handbook_has_no_match(monkeypatch):
    posted = []

    monkeypatch.setenv("TELEGRAM_ALLOWED_USERS", "8638591553")
    monkeypatch.setenv("TELEGRAM_BOT_TOKEN", "token-123")
    monkeypatch.setattr(
        "services.chatbot.telegram_poller.search_handbook_text",
        lambda prompt: "No matches found in handbook.",
    )

    class DummyResponse:
        def __init__(self, payload=None, status_code=200):
            self._payload = payload or {}
            self.status_code = status_code
            self.ok = status_code < 400

        def raise_for_status(self):
            return None

        def json(self):
            return self._payload

    def fake_post(url, headers=None, json=None, timeout=None):
        posted.append({
            "url": url,
            "headers": headers,
            "json": json,
            "timeout": timeout,
        })
        if url == "http://hermes:8642/v1/responses":
            return DummyResponse({
                "output_text": "hermes:What is Kubernetes?",
                "output": [{
                    "type": "message",
                    "content": [{"text": "hermes:What is Kubernetes?"}],
                }],
            })
        return DummyResponse({"ok": True})

    monkeypatch.setattr("services.chatbot.hermes.requests.post", fake_post)
    monkeypatch.setattr("services.chatbot.telegram_gateway.requests.post", fake_post)

    from services.chatbot.telegram_poller import handle_telegram_update

    handle_telegram_update(
        {
            "update_id": 1,
            "message": {
                "message_id": 2,
                "from": {"id": 8638591553},
                "chat": {"id": 8638591553, "type": "private"},
                "text": "What is Kubernetes?",
            },
        },
    )

    assert posted[0]["url"] == "http://hermes:8642/v1/responses"
    assert posted[0]["json"]["conversation"] == "telegram-8638591553"
    assert posted[0]["json"]["input"] == "What is Kubernetes?"
    assert posted[1] == {
        "url": "https://api.telegram.org/bottoken-123/sendMessage",
        "headers": None,
        "json": {
            "chat_id": 8638591553,
            "text": "hermes:What is Kubernetes?",
        },
        "timeout": 30,
    }


def test_telegram_poller_falls_back_to_handbook_snippet_on_hermes_rate_limit(monkeypatch):
    posted = []

    monkeypatch.setenv("TELEGRAM_ALLOWED_USERS", "8638591553")
    monkeypatch.setenv("TELEGRAM_BOT_TOKEN", "token-123")
    monkeypatch.setattr(
        "services.chatbot.telegram_poller.search_handbook_text",
        lambda prompt: "Handbook matches:\nPrimary match:\n- common/ddi.txt: BlueCat DDI runbook",
    )
    monkeypatch.setattr(
        "services.chatbot.telegram_poller.search_handbook_paragraphs",
        lambda prompt: "Handbook fallback:\nPrimary snippet:\n- common/ddi.txt: BlueCat DDI handles DNS and IPAM for core services.",
    )

    class DummyResponse:
        def __init__(self, payload=None, status_code=200, text=""):
            self._payload = payload or {}
            self.status_code = status_code
            self.ok = status_code < 400
            self.text = text
            self.reason = "RESOURCE_EXHAUSTED" if status_code == 429 else ""

        def raise_for_status(self):
            if self.status_code >= 400:
                raise requests.HTTPError(
                    f"Gemini HTTP {self.status_code} (RESOURCE_EXHAUSTED): quota exceeded",
                    response=self,
                )
            return None

        def json(self):
            return self._payload

    def fake_post(url, headers=None, json=None, timeout=None):
        posted.append({
            "url": url,
            "headers": headers,
            "json": json,
            "timeout": timeout,
        })
        if url == "http://hermes:8642/v1/responses":
            return DummyResponse(status_code=429, text="RESOURCE_EXHAUSTED quota exceeded")
        return DummyResponse({"ok": True})

    monkeypatch.setattr("services.chatbot.hermes.requests.post", fake_post)
    monkeypatch.setattr("services.chatbot.telegram_gateway.requests.post", fake_post)

    from services.chatbot.telegram_poller import handle_telegram_update

    handle_telegram_update(
        {
            "update_id": 1,
            "message": {
                "message_id": 2,
                "from": {"id": 8638591553},
                "chat": {"id": 8638591553, "type": "private"},
                "text": "BlueCat DDI",
            },
        },
    )

    assert posted[0]["url"] == "http://hermes:8642/v1/responses"
    assert posted[1] == {
        "url": "https://api.telegram.org/bottoken-123/sendMessage",
        "headers": None,
        "json": {
            "chat_id": 8638591553,
            "text": (
                "Hermes is currently rate limited, so here is the closest handbook snippet instead.\n"
                "Handbook fallback:\n"
                "Primary snippet:\n"
                "- common/ddi.txt: BlueCat DDI handles DNS and IPAM for core services."
            ),
        },
        "timeout": 30,
    }


def test_telegram_poller_ignores_unauthorized_user(monkeypatch):
    monkeypatch.setenv("TELEGRAM_ALLOWED_USERS", "111")
    posted = []

    monkeypatch.setattr(
        "services.chatbot.hermes.requests.post",
        lambda *args, **kwargs: posted.append((args, kwargs)),
    )

    from services.chatbot.telegram_poller import handle_telegram_update

    handle_telegram_update(
        {
            "message": {
                "from": {"id": 222},
                "chat": {"id": 222, "type": "private"},
                "text": "hello",
            },
        },
    )

    assert posted == []
