# handbook.py
from flask import Blueprint, request, jsonify
import os
import subprocess
import logging

handbook_bp = Blueprint("handbook", __name__)

def _handbook_root() -> str:
    # Must be a path that exists inside the backend container
    return os.getenv("HANDBOOK_ROOT", "/data/vho-handbook")

@handbook_bp.route("/health/handbook", methods=["GET"])
def handbook_health():
    root = _handbook_root()
    ok = os.path.isdir(root)
    return jsonify({
        "status": "ok" if ok else "error",
        "handbook_root": root,
        "exists": ok,
    }), (200 if ok else 500)

@handbook_bp.route("/api/handbook", methods=["POST"])
def handbook_search():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    # keep behavior consistent with frontend: raw text is fine, but we need a non-empty query
    query = str(data.get("Prompt_string", "")).strip()
    if not query:
        return jsonify({"error": "Please enter a prompt for D9 Bot"}), 400

    root = _handbook_root()
    if not os.path.isdir(root):
        return jsonify({"error": "HANDBOOK_ROOT is not available in container", "handbook_root": root}), 500

    cmd = [
        "rg",
        "-C", "4",                 # 4 lines before/after
        "--heading",               # filename once as header
        "--no-line-number",        # no 14- 15- prefixes
        "--color", "never",        # no ANSI colors
        "--hidden",                # optional: search hidden files
        "--glob", "!.git/*",       # exclude .git
        query,
        root,
    ]

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=20,
        )

        # grep exit codes: 0 found, 1 not found, 2 error
        if proc.returncode == 2:
            logging.error("grep error: %s", proc.stderr)
            return jsonify({"error": "grep_failed", "details": proc.stderr.strip()}), 500

        output = (proc.stdout or "").strip()
        if not output:
            output = "No matches found in handbook."

        # Return in a Gemini-like shape so your frontend can reuse parsing logic if you want
        return jsonify({
            "mode": "handbook",
            "candidates": [{
                "content": {
                    "parts": [{"text": output}]
                }
            }]
        }), 200

    except subprocess.TimeoutExpired:
        return jsonify({"error": "handbook_search_timeout"}), 504