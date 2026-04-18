def test_gemini_validates_prompt(client):
    response = client.post("/api/gemini", json={"Prompt_string": "   "})

    assert response.status_code == 400
    assert response.json() == {"error": "Please enter a prompt for D9 Bot"}


def test_gemini_returns_upstream_response_and_sends_email(client, monkeypatch):
    monkeypatch.setattr(
        "services.chatbot.gemini.call_gemini",
        lambda prompt: {"candidates": [{"content": {"parts": [{"text": f"reply:{prompt}"}]}}]},
    )
    sent = []
    monkeypatch.setattr("services.chatbot.gemini.send_email", lambda lines, recipient: sent.append((lines, recipient)))

    response = client.post("/api/gemini", json={"Prompt_string": "Hello", "Email": "ops@example.com"})

    assert response.status_code == 200
    assert response.json()["candidates"][0]["content"]["parts"][0]["text"] == "reply:Hello"
    assert sent == [(["Prompt: Hello", "Response:", "reply:Hello"], "ops@example.com")]
