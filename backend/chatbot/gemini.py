from flask import Blueprint, request, jsonify
import logging, sys, os, json, re, uuid
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Only load .env during local/dev runs (avoid in prod containers)
if os.getenv("FLASK_ENV") != "production":
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except Exception:
        pass

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s %(levelname)s %(message)s'
)

gemini_bp = Blueprint('gemini', __name__)

# --- helpers -----------------------------------------------------------------

def _read_secret_file(path: str) -> str | None:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        return None

def _get_gemini_api_key() -> str:
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

# Create a session with connection pooling + safe retries
_session = requests.Session()
_retry = Retry(
    total=3,
    connect=2,
    read=2,
    backoff_factor=0.5,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=("POST",),
    raise_on_status=False,
)
_session.mount("https://", HTTPAdapter(max_retries=_retry))

EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")

def _sanitize_email(value: str) -> str:
    v = (value or "").strip()
    return v if EMAIL_RE.fullmatch(v or "") else ""

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
    api_key = _get_gemini_api_key()

    # Hard cap prompt size to prevent abuse / huge bills
    request_prompt = request_prompt[:8000]

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    payload = {"contents": [{"parts": [{"text": request_prompt}]}]}
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": api_key,  # header is fine; just never log it
    }

    # tight timeouts: (connect, read)
    resp = _session.post(url, headers=headers, json=payload, timeout=(5, 30))
    # Don't raise here; we want to include upstream body if useful
    if resp.status_code >= 400:
        # Minimal logging (no payload); include request-id if present
        req_id = resp.headers.get("x-request-id") or resp.headers.get("x-guploader-uploadid")
        logging.warning("Gemini error %s (req_id=%s)", resp.status_code, req_id)
        resp.raise_for_status()
    return resp.json()

# --- route -------------------------------------------------------------------

@gemini_bp.route('/api/gemini', methods=['POST'])
def gemini_request():
    rid = uuid.uuid4().hex[:8]  # request id for log correlation
    data = request.get_json(silent=True)

    # Log only metadata, not full bodies (PII, secrets)
    body_len = len(request.data or b"")
    logging.info("[rid=%s] /api/gemini content_length=%d", rid, body_len)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    prompt = str(data.get("Prompt_string", "") or "").strip()
    recipient = _sanitize_email(str(data.get("Email", "") or ""))

    if not prompt:
        return jsonify({"error": "Please enter a prompt for D9 Bot"}), 400

    try:
        response_json = call_gemini(prompt)

        if recipient:
            try:
                texts = extract_texts(response_json)
                # send_email should never throw; guard it
                send_email([f"Prompt: {prompt}", "Response:", *texts], recipient)
            except Exception as e:
                logging.warning("[rid=%s] email send failed: %s", rid, e)

        # Avoid logging full model output (could contain sensitive text)
        logging.info("[rid=%s] Gemini OK", rid)
        return jsonify(response_json), 200

    except requests.HTTPError as e:
        logging.exception("[rid=%s] Gemini HTTP error", rid)
        return jsonify({"error": "Upstream error from Gemini"}), 502
    except Exception as e:
        logging.exception("[rid=%s] Unhandled error", rid)
        return jsonify({"error": "Internal server error"}), 500
