import logging
import os

import requests
from fastapi import APIRouter, HTTPException

from services.chatbot.gemini import gemini_health_check_basic
from services.chatbot.handbook_search import get_handbook_root


router = APIRouter(tags=["health"])


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
