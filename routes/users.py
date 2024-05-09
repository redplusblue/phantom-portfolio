from flask import Blueprint, request, jsonify
from routes.auth import validate_token
from models.models import db, User, Transaction
from utils.cache import cache

# Create a Blueprint for Routes
users_bp = Blueprint('users', __name__)

# TODO: Delete this route after testing
@users_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{"id": user.id, "username": user.username, "email": user.email, "password": user.password, "balance": user.balance, "portfolio": user.portfolio, "stocklists": user.stocklists} for user in users]
    return jsonify(user_list)

# Endpoint to get the current user's information
@users_bp.route('/api/user', methods=['GET'])
def get_user():
    # Check token validity
    token = request.headers.get('Authorization')
    if not token or not validate_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    user_id = cache.get(token).decode('utf-8')
    # Check if token is valid 
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401    
    user = User.query.get(user_id)
    # Check if user exists
    if not user:
        return jsonify({'error': 'User not found'}), 404
    # Found
    return jsonify({'username': user.username, 'email': user.email, 'balance': user.balance, 'portfolio': user.portfolio, 'stocklists': user.stocklists}), 200
        
@users_bp.route('/api/balance', methods=['GET'])
def get_balance():
    # Retrieve the current user's balance
    token = request.headers.get('Authorization')
    user_id = cache.get(token).decode('utf-8')
    user = User.query.get(user_id)
    if user:
        return jsonify({'balance': user.balance}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@users_bp.route('/api/deposit', methods=['POST'])
def deposit():
    # Authenticate user 
    token = request.headers.get('Authorization')
    if not token or not validate_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    user_id = cache.get(token).decode('utf-8')
    data = request.get_json()
    amount = data.get('amount')
    # Check if amount is valid 
    if not amount or amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    # Retrieve user from database
    user = User.query.get(user_id)
    if user:
        user.balance += amount
        db.session.commit()
        return jsonify({'message': 'Deposit successful', 'balance': user.balance}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# TODO
# @users_bp.route('/api/withdraw', methods=['POST'])
# def withdraw():
#     data = request.get_json()
#     amount = data.get('amount')
#     user_id = request.headers.get('User-Id')
    
#     user = User.query.get(user_id)
#     if user:
#         if user.balance >= amount:
#             user.balance -= amount
#             db.session.commit()
#             return jsonify({'message': 'Withdrawal successful', 'balance': user.balance}), 200
#         else:
#             return jsonify({'error': 'Insufficient balance'}), 400
#     else:
#         return jsonify({'error': 'User not found'}), 404

