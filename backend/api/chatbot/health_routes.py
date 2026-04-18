import logging
import os

import requests
from fastapi import APIRouter, HTTPException

from services.chatbot.gemini import gemini_health_check_basic
from services.chatbot.handbook_search import get_handbook_root
from services.chatbot.hermes import get_hermes_health
from services.chatbot.telegram_gateway import get_telegram_health


router = APIRouter(tags=["health"])


@router.get("/health/hermes")
def hermes_health():
    try:
        response = get_hermes_health()
        if response.ok:
            return {"status": "ok", "upstream_http": response.status_code}
        raise HTTPException(
            status_code=502,
            detail={"status": "error", "upstream_http": response.status_code},
        )
    except HTTPException:
        raise
    except requests.RequestException as exc:
        logging.exception("Hermes health check failed")
        raise HTTPException(
            status_code=502,
            detail={"status": "error", "reason": "exception", "details": str(exc)},
        ) from exc


@router.get("/health/telegram")
def telegram_health():
    try:
        response = get_telegram_health()
        if response.ok:
            return {"status": "ok", "upstream_http": response.status_code}
        raise HTTPException(
            status_code=502,
            detail={"status": "error", "upstream_http": response.status_code},
        )
    except HTTPException:
        raise
    except RuntimeError as exc:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "reason": "misconfigured", "details": str(exc)},
        ) from exc
    except requests.RequestException as exc:
        logging.exception("Telegram health check failed")
        raise HTTPException(
            status_code=502,
            detail={"status": "error", "reason": "exception", "details": str(exc)},
        ) from exc


@router.get("/health/handbook")
def handbook_health():
    root = get_handbook_root()
    ok = os.path.isdir(root)
    if not ok:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "handbook_root": root, "exists": ok},
        )
    return {"status": "ok", "handbook_root": root, "exists": ok}


@router.get("/health/gemini")
def gemini_health():
    return gemini_health_check_basic()
