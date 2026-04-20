import logging
import time

import requests

from services.chatbot.gemini import call_gemini, extract_texts as extract_gemini_texts
from services.chatbot.handbook_search import has_handbook_matches, search_handbook_text
from services.chatbot.hermes import build_telegram_conversation_id, call_hermes, extract_response_text
from services.chatbot.prompting import HANDBOOK_INSTRUCTIONS
from services.chatbot.telegram_gateway import (
    build_telegram_api_url,
    get_allowed_telegram_users,
    get_telegram_chat_id,
    get_telegram_text,
    get_telegram_user_id,
    send_telegram_message,
)


def get_telegram_updates(offset: int | None, timeout_seconds: int = 25) -> list[dict]:
    params = {
        "timeout": timeout_seconds,
        "allowed_updates": ["message", "edited_message"],
    }
    if offset is not None:
        params["offset"] = offset

    response = requests.get(
        build_telegram_api_url("getUpdates"),
        params=params,
        timeout=timeout_seconds + 5,
    )
    response.raise_for_status()
    payload = response.json()
    return payload.get("result", [])


def handle_telegram_update(update: dict) -> None:
    user_id = get_telegram_user_id(update)
    chat_id = get_telegram_chat_id(update)
    text = get_telegram_text(update)

    if chat_id is None or not text:
        return

    allowed_users = get_allowed_telegram_users()
    if allowed_users and user_id not in allowed_users:
        logging.warning("Rejected Telegram user_id=%s", user_id)
        return

    handbook_context = search_handbook_text(text)
    if has_handbook_matches(handbook_context):
        prompt = HANDBOOK_INSTRUCTIONS.format(prompt=text, context=handbook_context)
        response_json = call_hermes(prompt, build_telegram_conversation_id(chat_id))
        texts = extract_response_text(response_json)
    else:
        response_json = call_gemini(text)
        texts = extract_gemini_texts(response_json)
        if texts:
            texts.insert(0, "No handbook match found. Using Gemini knowledge instead.")
        else:
            texts = ["No handbook match found. Using Gemini knowledge instead."]

    send_telegram_message(chat_id, "\n\n".join(texts) or "No response received.")


def run_telegram_polling_loop() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logging.info("Starting Telegram long-polling worker")
    next_offset: int | None = None

    while True:
        try:
            updates = get_telegram_updates(next_offset)
            for update in updates:
                update_id = update.get("update_id")
                handle_telegram_update(update)
                if isinstance(update_id, int):
                    next_offset = update_id + 1
        except requests.RequestException as exc:
            logging.exception("Telegram polling request failed: %s", exc)
            time.sleep(5)
        except Exception as exc:
            logging.exception("Telegram polling worker failed: %s", exc)
            time.sleep(5)


if __name__ == "__main__":
    run_telegram_polling_loop()
