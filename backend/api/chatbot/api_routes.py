import logging

import requests
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from services.chatbot import gemini, hermes, prompting
from services.chatbot.handbook_search import get_handbook_root, has_handbook_matches, search_handbook_text
from services.utils.send_log import send_email


router = APIRouter(tags=["chatbot"])


class ChatRequest(BaseModel):
    Prompt_string: str | None = None
    Email: str = ""
    Mode: str | None = None


@router.post("/api/chat")
def chat_request(payload: ChatRequest, request: Request):
    data = payload.model_dump()
    logging.info("Incoming JSON: %s", data)

    prompt = str(data.get("Prompt_string", "")).strip()
    recipient = str(data.get("Email", "")).strip()
    mode = prompting.get_chat_mode(data)

    if not prompt:
        raise HTTPException(status_code=400, detail="Please enter a prompt for D9 Bot")

    response_mode = mode
    try:
        if mode == "handbook":
            handbook_context = search_handbook_text(prompt)
            if has_handbook_matches(handbook_context):
                conversation_id = hermes.get_session_conversation_id(request.session)
                hermes_prompt = prompting.HANDBOOK_INSTRUCTIONS.format(
                    prompt=prompt,
                    context=handbook_context,
                )
                response_json = hermes.call_hermes(hermes_prompt, conversation_id)
                texts = hermes.extract_response_text(response_json)
                response_mode = mode
            else:
                conversation_id = None
                response_json = gemini.call_gemini(prompt)
                texts = gemini.extract_texts(response_json)
                response_mode = "gemini_fallback"
        else:
            conversation_id = hermes.get_session_conversation_id(request.session)
            hermes_prompt = prompting.build_chat_prompt(prompt, mode)
            response_json = hermes.call_hermes(hermes_prompt, conversation_id)
            texts = hermes.extract_response_text(response_json)
            response_mode = mode

        if recipient and texts:
            send_email([f"Prompt: {prompt}", f"Mode: {response_mode}", "Response:", *texts], recipient)

        return {
            "mode": response_mode,
            "conversation_id": conversation_id,
            "candidates": [
                {
                    "content": {
                        "role": "assistant",
                        "parts": [{"text": "\n\n".join(texts) or "No response received."}],
                    }
                }
            ],
            "hermes_response": response_json,
        }
    except FileNotFoundError:
        root = get_handbook_root()
        raise HTTPException(
            status_code=500,
            detail={"error": "HANDBOOK_ROOT is not available in container", "handbook_root": root},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail={"error": "handbook_search_failed", "details": str(exc)}) from exc
    except requests.HTTPError as exc:
        status = getattr(exc.response, "status_code", None)
        if response_mode == "gemini_fallback":
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
        logging.exception("Hermes HTTP error")
        raise HTTPException(
            status_code=502,
            detail={
                "error": "Upstream error from Hermes",
                "details": str(exc),
                "upstream_http": status,
            },
        ) from exc
    except requests.RequestException as exc:
        logging.exception("Hermes request failed")
        raise HTTPException(
            status_code=502,
            detail={"error": "Hermes unavailable", "details": str(exc)},
        ) from exc


@router.post("/api/handbook")
def handbook_search(payload: ChatRequest):
    query = str(payload.Prompt_string or "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Please enter a prompt for D9 Bot")

    try:
        output = search_handbook_text(query)
        return {
            "mode": "handbook",
            "candidates": [{"content": {"parts": [{"text": output}]}}],
        }
    except FileNotFoundError:
        root = get_handbook_root()
        raise HTTPException(
            status_code=500,
            detail={"error": "HANDBOOK_ROOT is not available in container", "handbook_root": root},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail={"error": "grep_failed", "details": str(exc)}) from exc


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
