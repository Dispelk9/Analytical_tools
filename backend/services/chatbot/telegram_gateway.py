import os
from typing import Any

import requests


def get_allowed_telegram_users() -> set[str]:
    raw = os.getenv("TELEGRAM_ALLOWED_USERS", "")
    return {part.strip() for part in raw.split(",") if part.strip()}


def get_telegram_bot_token() -> str:
    return os.getenv("TELEGRAM_BOT_TOKEN", "").strip()


def build_telegram_api_url(method: str) -> str:
    token = get_telegram_bot_token()
    if not token:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not configured")
    return f"https://api.telegram.org/bot{token}/{method}"


def get_telegram_message(update: dict[str, Any]) -> dict[str, Any]:
    return update.get("message") or update.get("edited_message") or {}


def get_telegram_user_id(update: dict[str, Any]) -> str:
    user = (get_telegram_message(update).get("from") or {})
    user_id = user.get("id")
    return str(user_id).strip() if user_id is not None else ""


def get_telegram_text(update: dict[str, Any]) -> str:
    return str(get_telegram_message(update).get("text", "")).strip()


def get_telegram_chat_id(update: dict[str, Any]) -> int | None:
    chat = (get_telegram_message(update).get("chat") or {})
    return chat.get("id")


def send_telegram_message(chat_id: int | str, text: str) -> None:
    response = requests.post(
        build_telegram_api_url("sendMessage"),
        json={
            "chat_id": chat_id,
            "text": text,
        },
        timeout=30,
    )
    response.raise_for_status()


def get_telegram_health() -> requests.Response:
    response = requests.get(build_telegram_api_url("getMe"), timeout=10)
    return response
