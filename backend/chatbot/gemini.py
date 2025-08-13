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
            send_email([prompt, response_json], recipient)

        # Return JSON back to the frontend
        return jsonify(response_json), 200

    except requests.HTTPError as e:
        logging.exception("Gemini HTTP error")
        return jsonify({"error": "Upstream error from Gemini", "details": str(e)}), 502
    except Exception as e:
        logging.exception("Unhandled error")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


def call_gemini(request_prompt: str) -> dict:
    """Call Google Generative Language API and return parsed JSON."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not set")

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    payload = {
        "contents": [
            {"parts": [{"text": request_prompt}]}
        ]
    }
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()  # raises on 4xx/5xx
    return resp.json()
