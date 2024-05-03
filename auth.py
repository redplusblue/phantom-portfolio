from flask import Blueprint, redirect, request, jsonify, url_for
from models.models import User, db
from uuid import uuid4
import utils.cache as cache

auth_bp = Blueprint('auth', __name__)

# Register
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing username, email, or password'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# Login
@auth_bp.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    remember = True if request.json.get('remember') else False
    user = User.query.filter_by(username=username).first()
    # Generate a token for the user to use in subsequent requests
    token = uuid4()
    if user and user.password == password:
        if remember:
            duration = 60*60*24*7
        else: 
            duration = 60*60
        cache.setex(token, duration, user.id)
        return jsonify({"token": token}), 200
        
    return jsonify({"error": "Invalid credentials"}), 401

# Logout
@auth_bp.route('/api/logout')
def logout():
    token = request.headers.get('Authorization')
    cache.delete(token) 
    return jsonify({"message": "Logout successful"}), 200

# Validate token
@auth_bp.route('/api/token/validate', methods=['POST'])
def validate_token():
    token = request.headers.get('Authorization')
    user_id = cache.get(token) 
    if user_id:
        return jsonify({"message": "Token is valid"}), 200
    return jsonify({"error": "Invalid token"}), 401