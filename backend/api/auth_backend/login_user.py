import logging
import sys

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from werkzeug.security import check_password_hash


logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

Base = declarative_base()
router = APIRouter(tags=["auth"])


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)


class LoginRequest(BaseModel):
    username: str | None = None
    password: str | None = None


SessionLocal = sessionmaker(autocommit=False, autoflush=False, expire_on_commit=False)


def init_database(app, database_url: str, connect_args: dict | None = None) -> None:
    engine = create_engine(database_url, connect_args=connect_args or {})
    SessionLocal.configure(bind=engine)
    Base.metadata.create_all(bind=engine)
    app.state.database_engine = engine


def get_db_session() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def get_current_user(
    request: Request,
    db_session: Session = Depends(get_db_session),
) -> User:
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = db_session.get(User, int(user_id))
    if user is None:
        request.session.pop("user_id", None)
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@router.post("/api/login")
def api_login(payload: LoginRequest, request: Request, db_session: Session = Depends(get_db_session)):
    username = (payload.username or "").strip()
    password = payload.password or ""
    logging.info("Login attempt for username: %s", username)

    user = db_session.query(User).filter_by(username=username).first()
    logging.info("User query result: %s", user)

    if user and check_password_hash(user.password, password):
        request.session["user_id"] = user.id
        return {"message": "Logged in"}

    logging.info("Invalid credentials provided.")
    return JSONResponse(status_code=401, content={"message": "Invalid credentials"})


@router.post("/api/logout")
def api_logout(request: Request, current_user: User = Depends(get_current_user)):
    request.session.pop("user_id", None)
    return {"message": "Logged out"}


@router.get("/api/check-auth")
def api_check_auth(request: Request, db_session: Session = Depends(get_db_session)):
    user_id = request.session.get("user_id")
    if not user_id:
        return JSONResponse(status_code=401, content={"authenticated": False})

    user = db_session.get(User, int(user_id))
    if user is None:
        request.session.pop("user_id", None)
        return JSONResponse(status_code=401, content={"authenticated": False})

    return {"authenticated": True}
