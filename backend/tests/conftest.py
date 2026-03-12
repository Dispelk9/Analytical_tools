import os
import sys
from pathlib import Path

import pytest
from flask import Flask
from werkzeug.security import generate_password_hash

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("SESSION_SECRET", "test-secret")

from adduct import adduct_bp
from act_math import math_bp
from auth_backend.login_user import User, auth_user_bp, db, login_manager
from chatbot.gemini import gemini_bp
from chatbot.handbook import handbook_bp
from compound import compound_bp
from smtp_handler import smtp_bp


@pytest.fixture()
def app():
    app = Flask(__name__)
    app.config.update(
        TESTING=True,
        SECRET_KEY="test-secret",
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    db.init_app(app)
    login_manager.init_app(app)

    app.register_blueprint(auth_user_bp)
    app.register_blueprint(compound_bp)
    app.register_blueprint(adduct_bp)
    app.register_blueprint(math_bp)
    app.register_blueprint(smtp_bp)
    app.register_blueprint(gemini_bp)
    app.register_blueprint(handbook_bp)

    with app.app_context():
        db.create_all()
        user = User(username="viet", password=generate_password_hash("secret"))
        db.session.add(user)
        db.session.commit()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()
