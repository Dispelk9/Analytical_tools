# backend/smtp_handler.py

from flask import Blueprint, request, jsonify
import socket
import ssl
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

smtp_bp = Blueprint('smtp', __name__, url_prefix='/api')

def is_port_open(host: str, port: int, timeout: float = 5.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False

def test_smtp(host: str, port: int = 25) -> dict:
    result = {
        "port": port,
        "service": "SMTP",
        "open": True,
        "noop_response": None,
        "starttls_supported": False,
        "starttls_result": None,
        "error": None
    }
    try:
        with smtplib.SMTP(host=host, port=port, timeout=10) as smtp:
            smtp.ehlo()
            code, msg = smtp.noop()
            result["noop_response"] = f"{code} {msg.decode().strip()}"
            if smtp.has_extn("STARTTLS"):
                result["starttls_supported"] = True
                try:
                    smtp.starttls(context=ssl.create_default_context())
                    smtp.ehlo()
                    code2, msg2 = smtp.noop()
                    result["starttls_result"] = f"Succeeded: {code2} {msg2.decode().strip()}"
                except Exception as e:
                    result["starttls_result"] = f"Failed: {e}"
    except Exception as e:
        result["open"] = False
        result["error"] = str(e)
    return result

def test_smtps(host: str, port: int = 465) -> dict:
    result = {
        "port": port,
        "service": "SMTPS",
        "open": True,
        "noop_response": None,
        "error": None
    }
    try:
        with smtplib.SMTP_SSL(host=host, port=port, timeout=10) as smtp:
            code, msg = smtp.noop()
            result["noop_response"] = f"{code} {msg.decode().strip()}"
    except Exception as e:
        result["open"] = False
        result["error"] = str(e)
    return result

def test_smtptls(host: str, port: int = 587) -> dict:
    result = {
        "port": port,
        "service": "SMTPTLS",
        "open": True,
        "starttls_supported": False,
        "starttls_result": None,
        "noop_response": None,
        "error": None
    }
    try:
        with smtplib.SMTP(host=host, port=port, timeout=10) as smtp:
            smtp.ehlo()
            if smtp.has_extn("STARTTLS"):
                result["starttls_supported"] = True
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                code, msg = smtp.noop()
                result["noop_response"] = f"{code} {msg.decode().strip()}"
                result["starttls_result"] = "Succeeded"
            else:
                result["starttls_result"] = "Not supported"
    except Exception as e:
        result["open"] = False
        result["error"] = str(e)
    return result

@smtp_bp.route('/smtp', methods=['POST'])
def run_smtp_checks():
    """
    POST /api/smtp
    Body: { "host": "<hostname-or-ip>" }
    Returns JSON: { "host": "...", "results": [ {...}, {...}, {...} ] }
    """
    data = request.get_json(silent=True) or {}
    host = data.get('host', '').strip()
    if not host:
        return jsonify({"error": "Missing or empty 'host' field"}), 400

    # List of (port, test_fn)
    tests = [
        (25,  test_smtp),
        (465, test_smtps),
        (587, test_smtptls),
    ]

    results = []
    for port, fn in tests:
        if is_port_open(host, port):
            results.append(fn(host, port))
        else:
            # If port closed, return minimal info
            service = fn.__doc__.split()[1] if fn.__doc__ else str(port)
            results.append({
                "port": port,
                "service": service,
                "open": False,
                "error": "Connection refused or timed out"
            })

    return jsonify({
        "host": host,
        "results": results
    }), 200
