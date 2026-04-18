import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from werkzeug.security import generate_password_hash


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("SESSION_SECRET", "test-secret")

from api.auth_backend.login_user import Base, SessionLocal, User
from main import create_app


@pytest.fixture()
def app(tmp_path):
    database_path = tmp_path / "test.db"
    app = create_app(
        database_url=f"sqlite:///{database_path}",
        session_secret="test-secret",
        database_connect_args={"check_same_thread": False},
    )

    engine = app.state.database_engine
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    SessionLocal.configure(bind=engine)

    with SessionLocal() as session:
        user = User(username="viet", password=generate_password_hash("secret"))
        session.add(user)
        session.commit()

    yield app

    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(app):
    return TestClient(app)
