from flask import Blueprint, request, jsonify
from auth import validate_token
from models.models import db, User
from scripts.stockdata import fetch_stock_data
import pandas as pd

# Create a Blueprint for Routes
routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{"username": user.username, "email": user.email, "password": user.password, "balance": user.balance, "portfolio": user.portfolio} for user in users]
    return jsonify(user_list)

@routes_bp.route('/api/balance', methods=['GET'])
def get_balance():
    # Retrieve the current user's balance
    user_id = request.headers.get('User-Id')
    user = User.query.get(user_id)
    if user:
        return jsonify({'balance': user.balance}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@routes_bp.route('/api/deposit', methods=['POST'])
def deposit():
    data = request.get_json()
    amount = data.get('amount')
    user_id = request.headers.get('User-Id')
    
    user = User.query.get(user_id)
    if user:
        user.balance += amount
        db.session.commit()
        return jsonify({'message': 'Deposit successful', 'balance': user.balance}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@routes_bp.route('/api/withdraw', methods=['POST'])
def withdraw():
    data = request.get_json()
    amount = data.get('amount')
    user_id = request.headers.get('User-Id')
    
    user = User.query.get(user_id)
    if user:
        if user.balance >= amount:
            user.balance -= amount
            db.session.commit()
            return jsonify({'message': 'Withdrawal successful', 'balance': user.balance}), 200
        else:
            return jsonify({'error': 'Insufficient balance'}), 400
    else:
        return jsonify({'error': 'User not found'}), 404

@routes_bp.route('/api/stock/<symbol>', methods=['GET'])
def get_stock(symbol):
    # Check authentication
    user_id = request.headers.get('User-Id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    if not validate_token(user_id):
        return jsonify({'error': 'Invalid token'}), 401
    # Fetch interval and period from query string with defaults
    interval = request.args.get('interval', '1d')
    period = request.args.get('period', '5d')
    stock_data = fetch_stock_data(symbol, interval, period)
    if 'error' not in stock_data:
        return jsonify(stock_data)
    else:
        return jsonify({'error': 'Failed to fetch data'}), 404
    
stocks_data = pd.read_csv('data/filtered_stocks.csv')

# Endpoint to serve autocomplete suggestions
@routes_bp.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query', '').lower()
    # Filter DataFrame based on user input (both name and company)
    filtered_stocks = stocks_data[(stocks_data['Symbol'].str.contains(query, case=False)) | 
                                  (stocks_data['Company'].str.contains(query, case=False))]
    # Format results as Symbol (Capitalized) | Name
    suggestions = [{'symbol': symbol.upper(), 'name': name} for symbol, name in 
                   zip(filtered_stocks['Symbol'], filtered_stocks['Company'])]
    # Return JSON response
    return jsonify(suggestions)