import os
import uuid

import requests


def get_hermes_base_url() -> str:
    return os.getenv("HERMES_BASE_URL", "http://hermes:8642").rstrip("/")


def get_hermes_headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    api_key = os.getenv("HERMES_API_KEY", "").strip()
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    return headers


def get_session_conversation_id(session_obj) -> str:
    conversation_id = session_obj.get("hermes_conversation_id")
    if isinstance(conversation_id, str) and conversation_id.strip():
        return conversation_id

    conversation_id = f"d9bot-{uuid.uuid4()}"
    session_obj["hermes_conversation_id"] = conversation_id
    if hasattr(session_obj, "modified"):
        session_obj.modified = True
    return conversation_id


def build_telegram_conversation_id(chat_id: int | str) -> str:
    return f"telegram-{chat_id}"


def extract_response_text(response_json: dict) -> list[str]:
    texts: list[str] = []

    output_text = response_json.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        texts.append(output_text.strip())

    for item in response_json.get("output", []):
        if item.get("type") != "message":
            continue
        for content in item.get("content", []):
            text = content.get("text")
            if isinstance(text, str) and text.strip():
                texts.append(text.strip())

    seen: set[str] = set()
    unique_texts: list[str] = []
    for text in texts:
        if text not in seen:
            seen.add(text)
            unique_texts.append(text)
    return unique_texts


def call_hermes(prompt: str, conversation_id: str) -> dict:
    payload = {
        "model": os.getenv("HERMES_MODEL", "hermes"),
        "input": prompt,
        "conversation": conversation_id,
        "store": True,
    }
    response = requests.post(
        f"{get_hermes_base_url()}/v1/responses",
        headers=get_hermes_headers(),
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    return response.json()


def get_hermes_health() -> requests.Response:
    response = requests.get(
        f"{get_hermes_base_url()}/health",
        headers=get_hermes_headers(),
        timeout=10,
    )
    return response
