from flask import Blueprint, request, jsonify
import logging
import sys
import os
import requests
from dotenv import load_dotenv
from utils.send_log import send_email

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

gemini_bp = Blueprint('gemini', __name__)


@gemini_bp.route("/health/gemini", methods=["GET"])
def gemini_health():
    return jsonify(gemini_health_check_basic())


@gemini_bp.route('/api/gemini', methods=['POST'])
def gemini_request():
    data = request.get_json(silent=True)
    logging.info("Incoming JSON: %s", data)

    # Basic payload validation
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    prompt = str(data.get("Prompt_string", "")).strip()
    recipient = str(data.get("Email", "")).strip()

    if not prompt:
        return jsonify({"error": "Please enter a prompt for D9 Bot"}), 400

    try:
        # Call Gemini
        response_json = call_gemini(prompt)

        # Email (optional)
        if recipient:
            # You might want a nicer email body than raw dict
            texts = extract_texts(response_json)
            send_email([f"Prompt: {prompt}", "Response:", *texts],recipient)

        # Return JSON back to the frontend
        logging.info("Response JSON: %s", response_json)
        return jsonify(response_json), 200

    except requests.HTTPError as e:
        status = getattr(e.response, "status_code", None)
        logging.exception("Gemini HTTP error")
        if status == 429:
            return jsonify({"error": "Gemini rate limited. Please retry."}), 429
        return jsonify({"error": "Upstream error from Gemini", "details": str(e)}), 502
    except Exception as e:
        logging.exception("Unhandled error")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    
def _read_secret_file(path: str) -> str | None:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        return None

def gemini_health_check_basic() -> dict:
    try:
        api_key = get_gemini_api_key()
        resp = requests.get(
            "https://generativelanguage.googleapis.com/v1beta/models",
            headers={"X-goog-api-key": api_key},
            timeout=10,
        )

        if resp.status_code == 200:
            return {"status": "ok", "level": "basic", "upstream_http": 200}

        if resp.status_code in (401, 403):
            return {"status": "error", "reason": "invalid_api_key", "upstream_http": resp.status_code}

        if resp.status_code == 429:
            return {"status": "degraded", "reason": "rate_limited", "upstream_http": 429}

        return {"status": "error", "reason": "unexpected_status", "upstream_http": resp.status_code}

    except Exception as e:
        return {"status": "error", "reason": "exception", "details": str(e)}



def get_gemini_api_key() -> str:
    """
    Prefer file-based secret (Docker secret) over env var.
    Fallback to env for dev.
    """
    path = os.getenv("GEMINI_API_KEY_FILE", "/run/secrets/gemini_api_key")
    key = _read_secret_file(path)
    if not key:
        key = os.getenv("GOOGLE_API_KEY")  # dev fallback
    if not key:
        raise RuntimeError("Gemini API key is not configured")
    return key

def extract_texts(resp: dict) -> list[str]:
    texts: list[str] = []
    for c in resp.get("candidates", []):
        parts = (c.get("content") or {}).get("parts", [])
        for p in parts:
            t = p.get("text")
            if isinstance(t, str):
                texts.append(t)
    return texts

def call_gemini(request_prompt: str) -> dict:
    api_key = get_gemini_api_key()

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    payload = {"contents": [{"parts": [{"text": request_prompt}]}]}
    headers = {"Content-Type": "application/json", "X-goog-api-key": api_key}

    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()
