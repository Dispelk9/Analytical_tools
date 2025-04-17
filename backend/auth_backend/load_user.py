from flask import Blueprint, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager, UserMixin,
    login_user, login_required,
    logout_user, current_user
)
from werkzeug.security import check_password_hash
from utils.db_connection import DB_CONNECT
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

secret_key = os.getenv("SESSION_SECRET")

auth_user_bp = Blueprint('/', __name__)

db_config = DB_CONNECT()

auth_user_bp.config.update({
    'SECRET_KEY': secret_key,
    'SQLALCHEMY_DATABASE_URI': f"postgresql://{db_config['username']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['dbname']} ",
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
})

db = SQLAlchemy(auth_user_bp)
login_manager = LoginManager(auth_user_bp)
login_manager.login_view = 'api_login'

# User model
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Login endpoint
@auth_user_bp.route('/api/login', methods=['POST'])
def api_login():
    data = request.json or {}
    user = User.query.filter_by(username=data.get('username')).first()
    if user and check_password_hash(user.password, data.get('password')):
        login_user(user)
        return jsonify({'message': 'Logged in'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Logout endpoint
@auth_user_bp.route('/api/logout', methods=['POST'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'message': 'Logged out'}), 200

# Check authentication status
@auth_user_bp.route('/api/check-auth')
def api_check_auth():
    ok = current_user.is_authenticated
    return jsonify({'authenticated': ok}), (200 if ok else 401)

# Serve Vite built files, requiring login
@auth_user_bp.route('/', defaults={'path': ''})
@auth_user_bp.route('/<path:path>')
@login_required
def serve_vite(path):
    if path and os.path.exists(os.path.join(auth_user_bp.static_folder, path)):
        return send_from_directory(auth_user_bp.static_folder, path)
    return send_from_directory(auth_user_bp.static_folder, 'index.html')