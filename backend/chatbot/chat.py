import logging
import os
import uuid

import requests
from flask import Blueprint, jsonify, request, session

from chatbot.handbook import search_handbook_text
from utils.send_log import send_email

chat_bp = Blueprint("chat", __name__)

HANDBOOK_INSTRUCTIONS = """You are answering a user question with handbook context.

Use the handbook context below as your primary source.
If the context is missing, incomplete, or says no matches were found, say that clearly.
Do not invent handbook-specific facts that are not supported by the provided context.

User question:
{prompt}

Handbook context:
{context}
"""


def _hermes_base_url() -> str:
    return os.getenv("HERMES_BASE_URL", "http://hermes:8642").rstrip("/")


def _hermes_headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    api_key = os.getenv("HERMES_API_KEY", "").strip()
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    return headers


def _chat_mode(data: dict) -> str:
    mode = str(data.get("Mode", "gemini")).strip().lower()
    return "handbook" if mode == "handbook" else "gemini"


def _conversation_id() -> str:
    conversation_id = session.get("hermes_conversation_id")
    if isinstance(conversation_id, str) and conversation_id.strip():
        return conversation_id

    conversation_id = f"d9bot-{uuid.uuid4()}"
    session["hermes_conversation_id"] = conversation_id
    session.modified = True
    return conversation_id


def _build_prompt(prompt: str, mode: str) -> str:
    if mode != "handbook":
        return prompt

    context = search_handbook_text(prompt)
    return HANDBOOK_INSTRUCTIONS.format(prompt=prompt, context=context)


def extract_response_text(resp: dict) -> list[str]:
    texts: list[str] = []

    output_text = resp.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        texts.append(output_text.strip())

    for item in resp.get("output", []):
        if item.get("type") != "message":
            continue
        for content in item.get("content", []):
            text = content.get("text")
            if isinstance(text, str) and text.strip():
                texts.append(text.strip())

    # Preserve order while dropping duplicates from dual representations.
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
        f"{_hermes_base_url()}/v1/responses",
        headers=_hermes_headers(),
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    return response.json()


@chat_bp.route("/health/hermes", methods=["GET"])
def hermes_health():
    try:
        response = requests.get(
            f"{_hermes_base_url()}/health",
            headers=_hermes_headers(),
            timeout=10,
        )
        return jsonify({
            "status": "ok" if response.ok else "error",
            "upstream_http": response.status_code,
        }), (200 if response.ok else 502)
    except requests.RequestException as e:
        logging.exception("Hermes health check failed")
        return jsonify({"status": "error", "reason": "exception", "details": str(e)}), 502


@chat_bp.route("/api/chat", methods=["POST"])
def chat_request():
    data = request.get_json(silent=True)
    logging.info("Incoming JSON: %s", data)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    prompt = str(data.get("Prompt_string", "")).strip()
    recipient = str(data.get("Email", "")).strip()
    mode = _chat_mode(data)

    if not prompt:
        return jsonify({"error": "Please enter a prompt for D9 Bot"}), 400

    try:
        conversation_id = _conversation_id()
        hermes_prompt = _build_prompt(prompt, mode)
        response_json = call_hermes(hermes_prompt, conversation_id)

        texts = extract_response_text(response_json)
        if recipient and texts:
            send_email([f"Prompt: {prompt}", f"Mode: {mode}", "Response:", *texts], recipient)

        return jsonify({
            "mode": mode,
            "conversation_id": conversation_id,
            "candidates": [{
                "content": {
                    "role": "assistant",
                    "parts": [{"text": "\n\n".join(texts) or "No response received."}],
                }
            }],
            "hermes_response": response_json,
        }), 200
    except FileNotFoundError:
        root = os.getenv("HANDBOOK_ROOT", "/data/vho-handbook")
        return jsonify({"error": "HANDBOOK_ROOT is not available in container", "handbook_root": root}), 500
    except RuntimeError as e:
        return jsonify({"error": "handbook_search_failed", "details": str(e)}), 500
    except requests.HTTPError as e:
        status = getattr(e.response, "status_code", None)
        logging.exception("Hermes HTTP error")
        return jsonify({
            "error": "Upstream error from Hermes",
            "details": str(e),
            "upstream_http": status,
        }), 502
    except requests.RequestException as e:
        logging.exception("Hermes request failed")
        return jsonify({"error": "Hermes unavailable", "details": str(e)}), 502
