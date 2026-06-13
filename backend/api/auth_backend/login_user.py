import logging
import sys

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from api.auth_backend.keycloak import (
    AuthenticatedUser,
    get_current_keycloak_user,
    is_auth_disabled,
)


logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

Base = declarative_base()
router = APIRouter(tags=["auth"])


SessionLocal = sessionmaker(autocommit=False, autoflush=False, expire_on_commit=False)


def init_database(app, database_url: str, connect_args: dict | None = None) -> None:
    engine = create_engine(database_url, connect_args=connect_args or {})
    SessionLocal.configure(bind=engine)
    Base.metadata.create_all(bind=engine)
    app.state.database_engine = engine


def get_current_user(request: Request) -> AuthenticatedUser:
    if is_auth_disabled():
        return AuthenticatedUser(
            provider="disabled",
            subject="disabled-auth",
            username="disabled-auth",
            claims={},
        )
    return get_current_keycloak_user(request)


@router.post("/api/login")
def api_login():
    return JSONResponse(
        status_code=400,
        content={"message": "Password login is disabled. Use Keycloak authentication."},
    )


@router.post("/api/logout")
def api_logout(request: Request):
    request.session.pop("user_id", None)
    return {"message": "Logged out"}


@router.get("/api/check-auth")
def api_check_auth(request: Request):
    try:
        user = get_current_user(request)
    except HTTPException:
        return JSONResponse(status_code=401, content={"authenticated": False})
    return {"authenticated": True, "username": user.username}
