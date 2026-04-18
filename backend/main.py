import os
from datetime import timedelta

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware

from api.auth_backend.login_user import init_database, router as auth_router
from api.chatbot.api_routes import router as chatbot_api_router
from api.chatbot.health_routes import router as health_router
from api.tools.act_math import router as math_router
from api.tools.adduct import router as adduct_router
from api.tools.compound import router as compound_router
from api.tools.smtp_handler import router as smtp_router
from services.utils.db_connection import DB_CONNECT


load_dotenv()


def build_database_url() -> str:
    db_config = DB_CONNECT()
    return (
        "postgresql://"
        f"{db_config['username']}:{db_config['password']}"
        f"@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
    )


def resolve_database_url(database_url: str | None) -> str | None:
    if database_url:
        return database_url

    db_config = DB_CONNECT()
    required_keys = ["username", "password", "host", "port", "dbname"]
    if any(not db_config.get(key) for key in required_keys):
        return None

    return build_database_url()


def create_app(
    database_url: str | None = None,
    session_secret: str | None = None,
    database_connect_args: dict | None = None,
) -> FastAPI:
    app = FastAPI(
        title="Analytical Tools API",
        description="FastAPI backend for the Analytical Tools platform.",
        version="1.0.0",
    )

    secret = session_secret or os.getenv("SESSION_SECRET", "change-me")
    app.add_middleware(
        SessionMiddleware,
        secret_key=secret,
        max_age=int(timedelta(days=1).total_seconds()),
        same_site="lax",
        https_only=False,
    )

    resolved_database_url = resolve_database_url(database_url)
    if resolved_database_url:
        init_database(
            app,
            resolved_database_url,
            connect_args=database_connect_args,
        )

    app.include_router(auth_router)
    app.include_router(compound_router)
    app.include_router(adduct_router)
    app.include_router(math_router)
    app.include_router(smtp_router)
    app.include_router(chatbot_api_router)
    app.include_router(health_router)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        detail = exc.detail
        if isinstance(detail, dict):
            content = detail
        else:
            content = {"error": str(detail)}
        return JSONResponse(status_code=exc.status_code, content=content)

    return app


app = create_app()
