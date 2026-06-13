import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("SESSION_SECRET", "test-secret")
os.environ["AUTH_PROVIDER"] = "disabled"

from api.auth_backend.login_user import Base, SessionLocal
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

    yield app

    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(app):
    return TestClient(app)
