from flask import Blueprint, request, jsonify
import logging
import sys
import os
import requests
from dotenv import load_dotenv
from utils.send_log import send_email

# --- HANDBOOK VECTOR RAG ---
from chatbot.handbook_vector import HandbookVectorIndex, build_context_block

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

gemini_bp = Blueprint('gemini', __name__)

# --- HANDBOOK VECTOR RAG (init once) ---
HANDBOOK_ROOT = os.getenv("HANDBOOK_ROOT", "/data/vho-handbook")
HANDBOOK_INDEX_DIR = os.getenv("HANDBOOK_INDEX_DIR", "/tmp/handbook_chroma")
handbook_index = HandbookVectorIndex(HANDBOOK_ROOT, HANDBOOK_INDEX_DIR)

# if index empty, we can build it lazily once
def _ensure_index():
    if handbook_index.is_index_empty():
        logging.info("Handbook index empty, building now...")
        stats = handbook_index.reindex_all()
        logging.info("Handbook index built: %s", stats)


@gemini_bp.route("/health/gemini", methods=["GET"])
def gemini_health():
    return jsonify(gemini_health_check_basic())


@gemini_bp.route('/api/gemini', methods=['POST'])
def gemini_request():
    data = request.get_json(silent=True)
    logging.info("Incoming JSON: %s", data)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    prompt = str(data.get("Prompt_string", "")).strip()
    recipient = str(data.get("Email", "")).strip()

    if not prompt:
        return jsonify({"error": "Please enter a prompt for D9 Bot"}), 400

    # --- HANDBOOK VECTOR RAG (retrieve first) ---
    section = str(data.get("Section", "")).strip() or None
    top_k = int(data.get("TopK", os.getenv("HANDBOOK_TOPK", "5")))
    mode = str(data.get("Mode", "auto")).lower()  # "auto" | "handbook_only"

    try:
        _ensure_index()
        snips = handbook_index.search(prompt, top_k=top_k, section=section)
        context_block, sources = build_context_block(snips, max_items=4)
    except Exception:
        logging.exception("Handbook retrieval failed")
        snips, context_block, sources = [], "", []

    if mode == "handbook_only":
        return jsonify({
            "_mode": "handbook_only",
            "answer": "Handbook-only mode: returning relevant notes.",
            "sources": sources,
            "results": [
                {"path": s.path, "section": s.section, "score": s.score, "text": s.text[:1200] + ("..." if len(s.text) > 1200 else "")}
                for s in snips
            ],
        }), 200

    try:
        # --- Gemini with handbook context ---
        final_prompt = f"""
You are D9 Bot. Use the HANDBOOK CONTEXT as the primary source of truth.
If the handbook does not contain the answer, say so and list the most relevant notes (with their source paths).
Be concise and actionable.

{context_block}

### USER QUESTION
{prompt}
""".strip()

        response_json = call_gemini(final_prompt)
        response_json["_mode"] = "gemini_with_vector_handbook"
        response_json["_handbook_sources"] = sources

        # Email (optional)
        if recipient:
            texts = extract_texts(response_json)
            send_email([f"Prompt: {prompt}", "Response:", *texts], recipient)

        logging.info("Response JSON: %s", response_json)
        return jsonify(response_json), 200

    except requests.HTTPError as e:
        # --- Fallback: handbook-only ---
        status = getattr(e.response, "status_code", None)
        logging.exception("Gemini HTTP error - returning handbook fallback")
        return jsonify({
            "_mode": "handbook_fallback",
            "error": "Gemini unavailable, returning handbook matches",
            "upstream_http": status,
            "sources": sources,
            "results": [
                {"path": s.path, "section": s.section, "score": s.score, "text": s.text[:1200] + ("..." if len(s.text) > 1200 else "")}
                for s in snips
            ],
        }), 200

    except Exception as e:
        logging.exception("Unhandled error - returning handbook fallback")
        return jsonify({
            "_mode": "handbook_fallback",
            "error": "Internal server error, returning handbook matches",
            "details": str(e),
            "sources": sources,
            "results": [
                {"path": s.path, "section": s.section, "score": s.score, "text": s.text[:1200] + ("..." if len(s.text) > 1200 else "")}
                for s in snips
            ],
        }), 200


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