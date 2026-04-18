import smtplib
import socket
import ssl

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


load_dotenv()

router = APIRouter(tags=["smtp"])


class SmtpRequest(BaseModel):
    host: str = ""


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
        "error": None,
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
                except Exception as exc:
                    result["starttls_result"] = f"Failed: {exc}"
    except Exception as exc:
        result["open"] = False
        result["error"] = str(exc)
    return result


def test_smtps(host: str, port: int = 465) -> dict:
    result = {
        "port": port,
        "service": "SMTPS",
        "open": True,
        "noop_response": None,
        "error": None,
    }
    try:
        with smtplib.SMTP_SSL(host=host, port=port, timeout=10) as smtp:
            code, msg = smtp.noop()
            result["noop_response"] = f"{code} {msg.decode().strip()}"
    except Exception as exc:
        result["open"] = False
        result["error"] = str(exc)
    return result


def test_smtptls(host: str, port: int = 587) -> dict:
    result = {
        "port": port,
        "service": "SMTPTLS",
        "open": True,
        "starttls_supported": False,
        "starttls_result": None,
        "noop_response": None,
        "error": None,
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
    except Exception as exc:
        result["open"] = False
        result["error"] = str(exc)
    return result


@router.post("/api/smtp")
def run_smtp_checks(payload: SmtpRequest):
    host = payload.host.strip()
    if not host:
        raise HTTPException(status_code=400, detail="Missing or empty 'host' field")

    tests = [
        (25, test_smtp),
        (465, test_smtps),
        (587, test_smtptls),
    ]

    results = []
    for port, test_function in tests:
        if is_port_open(host, port):
            results.append(test_function(host, port))
        else:
            service = test_function.__doc__.split()[1] if test_function.__doc__ else str(port)
            results.append(
                {
                    "port": port,
                    "service": service,
                    "open": False,
                    "error": "Connection refused or timed out",
                }
            )

    return {"host": host, "results": results}
