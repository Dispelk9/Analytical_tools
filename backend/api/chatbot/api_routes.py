import logging

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.chatbot import gemini
from services.utils.send_log import send_email


router = APIRouter(tags=["chatbot"])


class ChatRequest(BaseModel):
    Prompt_string: str | None = None
    Email: str = ""


@router.post("/api/chat")
def chat_request(payload: ChatRequest):
    data = payload.model_dump()
    logging.info("Incoming JSON: %s", data)

    prompt = str(data.get("Prompt_string", "")).strip()
    recipient = str(data.get("Email", "")).strip()

    if not prompt:
        raise HTTPException(status_code=400, detail="Please enter a prompt for D9 Bot")

    try:
        response_json = gemini.call_gemini(prompt)
        texts = gemini.extract_texts(response_json)

        if recipient and texts:
            send_email([f"Prompt: {prompt}", "Response:", *texts], recipient)

        return {
            "candidates": [
                {
                    "content": {
                        "role": "assistant",
                        "parts": [{"text": "\n\n".join(texts) or "No response received."}],
                    }
                }
            ],
            "gemini_response": response_json,
        }
    except requests.HTTPError as exc:
        status = getattr(exc.response, "status_code", None)
        logging.exception("Gemini HTTP error")
        if status == 429:
            raise HTTPException(
                status_code=429,
                detail={"error": "Gemini rate limited. Please retry."},
            ) from exc
        raise HTTPException(
            status_code=502,
            detail={
                "error": "Upstream error from Gemini",
                "details": str(exc),
                "upstream_http": status,
            },
        ) from exc
    except requests.RequestException as exc:
        logging.exception("Gemini request failed")
        raise HTTPException(
            status_code=502,
            detail={"error": "Gemini unavailable", "details": str(exc)},
        ) from exc


@router.post("/api/gemini")
def gemini_request(payload: ChatRequest):
    data = payload.model_dump()
    logging.info("Incoming JSON: %s", data)

    prompt = str(data.get("Prompt_string", "")).strip()
    recipient = str(data.get("Email", "")).strip()

    if not prompt:
        raise HTTPException(status_code=400, detail="Please enter a prompt for D9 Bot")

    try:
        response_json = gemini.call_gemini(prompt)

        if recipient:
            texts = gemini.extract_texts(response_json)
            gemini.send_email([f"Prompt: {prompt}", "Response:", *texts], recipient)

        logging.info("Response JSON: %s", response_json)
        return response_json
    except requests.HTTPError as exc:
        status = getattr(exc.response, "status_code", None)
        logging.exception("Gemini HTTP error")
        if status == 429:
            raise HTTPException(status_code=429, detail={"error": "Gemini rate limited. Please retry."}) from exc
        raise HTTPException(
            status_code=502,
            detail={"error": "Upstream error from Gemini", "details": str(exc)},
        ) from exc
    except Exception as exc:
        logging.exception("Unhandled error")
        raise HTTPException(
            status_code=500,
            detail={"error": "Internal server error", "details": str(exc)},
        ) from exc
