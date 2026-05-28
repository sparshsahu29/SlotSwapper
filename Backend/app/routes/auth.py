from flask import Blueprint, request, jsonify, current_app
from app.models import db, User
from datetime import datetime, timezone
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST']) # maps to /api/auth/signup via blueprint prefix
def signup():
    data = request.get_json() or {}
    name, email, password = data.get('name'), data.get('email'), data.get('password')
    if not name or not email or not password:
        return jsonify({'message': 'Missing fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400
        
    new_user = User(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    
    token = jwt.encode({'user_id': new_user.id, 'exp': datetime.now(timezone.utc) + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']}, current_app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({"token": token, "user": new_user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email, password = data.get('email'), data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    token = jwt.encode({'user_id': user.id, 'exp': datetime.now(timezone.utc) + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']}, current_app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({"token": token, "user": user.to_dict()}), 200