import logging
import time

import requests

from services.chatbot.handbook_search import (
    NO_HANDBOOK_MATCHES,
    has_handbook_matches,
    search_handbook_paragraphs,
    search_handbook_text,
)
from services.chatbot.hermes import (
    build_telegram_conversation_id,
    call_hermes,
    extract_response_text,
    is_rate_limited_error,
)
from services.chatbot.prompting import HANDBOOK_INSTRUCTIONS, parse_prompt_controls
from services.chatbot.telegram_gateway import (
    build_telegram_api_url,
    get_allowed_telegram_users,
    get_telegram_chat_id,
    get_telegram_text,
    get_telegram_user_id,
    send_telegram_message,
)


def build_rate_limited_handbook_reply(query: str) -> str:
    handbook_paragraph = search_handbook_paragraphs(query)
    if handbook_paragraph == NO_HANDBOOK_MATCHES:
        return "Hermes is currently rate limited, and no matching handbook snippet was found."
    return "\n".join(
        [
            "Hermes is currently rate limited, so here is the closest handbook snippet instead.",
            handbook_paragraph,
        ]
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
    raw_text = get_telegram_text(update)
    text, direct_handbook = parse_prompt_controls(raw_text)

    if chat_id is None or not text:
        return

    allowed_users = get_allowed_telegram_users()
    if allowed_users and user_id not in allowed_users:
        logging.warning("Rejected Telegram user_id=%s", user_id)
        return

    handbook_context = search_handbook_text(text)
    if direct_handbook:
        send_telegram_message(chat_id, handbook_context)
        return

    if has_handbook_matches(handbook_context):
        prompt = HANDBOOK_INSTRUCTIONS.format(prompt=text, context=handbook_context)
    else:
        prompt = text

    try:
        response_json = call_hermes(prompt, build_telegram_conversation_id(chat_id))
        texts = extract_response_text(response_json)
    except requests.HTTPError as exc:
        if not is_rate_limited_error(exc):
            raise
        logging.warning("Hermes rate limited for Telegram chat_id=%s", chat_id)
        texts = [build_rate_limited_handbook_reply(text)]

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
