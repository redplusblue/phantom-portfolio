from flask import Blueprint, redirect, request, jsonify, url_for
from flask_login import LoginManager, login_user, logout_user, login_required
from models.models import db, User
from scripts.stockdata import fetch_stock_data

# Create a Blueprint for Routes
routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/api/register', methods=['POST'])
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

@routes_bp.route('/api/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        login_user(user)
        return redirect(url_for('routes.user_dashboard'))  # Redirect to a dashboard view
    return jsonify({"error": "Invalid credentials"}), 401

@routes_bp.route('/api/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('routes.serve_frontend'))  # Redirect to the login page or home page

@routes_bp.route('/api/balance', methods=['GET'])
@login_required
def get_balance():
    # Retrieve the current user's balance
    user_id = request.headers.get('User-Id')
    user = User.query.get(user_id)
    if user:
        return jsonify({'balance': user.balance}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@routes_bp.route('/api/deposit', methods=['POST'])
@login_required
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
@login_required
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
# @login_required - TODO: Uncomment this line to require authentication
def get_stock(symbol):
    # Fetch interval and period from query string with defaults
    interval = request.args.get('interval', '1d')
    period = request.args.get('period', '5d')
    print(f"Fetching stock data for {symbol} with interval={interval} and period={period}")
    stock_data = fetch_stock_data(symbol, interval, period)
    if 'error' not in stock_data:
        return jsonify(stock_data)
    else:
        return jsonify({'error': 'Failed to fetch data'}), 404