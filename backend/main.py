# backend/main.py
from flask import Flask
import os
from dotenv import load_dotenv
from flask_session import Session
from datetime import timedelta
from utils.adduct_utils import *
from compound import compound_bp
from adduct import adduct_bp
from act_math import math_bp
from auth_backend.load_user import auth_user_bp , db, login_manager

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

app.secret_key = os.getenv("SESSION_SECRET")

# Configure Flask-Session to use filesystem storage
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = "/tmp/flask_session"  # Directory to store sessions
app.config["SESSION_PERMANENT"] = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)

Session(app)

app.config.update(auth_user_bp.config)
# Initialize extensions
db.init_app(app)
login_manager.init_app(app)



app.register_blueprint(compound_bp)
app.register_blueprint(adduct_bp)
app.register_blueprint(math_bp)
app.register_blueprint(auth_user_bp)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
