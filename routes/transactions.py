from flask import Blueprint, json, request, jsonify
from routes.auth import validate_token
from models.models import db, User, Transaction
from utils.cache import cache
from datetime import datetime

# Create a Blueprint for Routes
transactions_bp = Blueprint('transactions', __name__)

# TODO: Delete this route after testing
@transactions_bp.route('/api/transactions', methods=['GET'])
def get_all_transactions():
    transactions = Transaction.query.all()
    transaction_list = [{"id": transaction.id, "symbol": transaction.symbol, "price": transaction.price, "quantity": transaction.quantity, "reversed": transaction.reversed, "date": transaction.date, "user": transaction.user.username, "user-id": transaction.user_id} for transaction in transactions]
    return jsonify(transaction_list)

# Get all transactions for the current user
@transactions_bp.route('/api/transactions/all', methods=['GET'])
def get_transactions():
    # Authenticate user 
    token = request.headers.get('Authorization')
    if not token or not validate_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    user_id = cache.get(token).decode('utf-8')
    user = User.query.get(user_id)
    if user:
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        transaction_list = [{"id": transaction.id, "symbol": transaction.symbol, "price": transaction.price, "quantity": transaction.quantity, "reversed": transaction.reversed, "date": transaction.date} for transaction in transactions]
        return jsonify(transaction_list)
    else:
        return jsonify({'error': 'User not found'}), 404

# Create a transaction 
@transactions_bp.route('/api/transactions/new', methods=['POST'])
def create_transaction():
    # Authenticate user 
    token = request.headers.get('Authorization')
    if not token or not validate_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    user_id = cache.get(token).decode('utf-8')
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    symbol = data.get('symbol')
    price = data.get('price')
    quantity = data.get('quantity')
    # Default variables
    reversed = False
    date = datetime.now()
    if not symbol or not price or not quantity or not date:
        return jsonify({'error': 'Missing symbol, price, quantity, or date'}), 400
    # If the user does not have enough balance
    if user.balance < price * quantity:
        return jsonify({'error': 'Insufficient balance'}), 400
    new_transaction = Transaction(symbol=symbol, price=price, quantity=quantity, reversed=reversed, date=date, user_id=user_id)
    # Deduct the balance from the user
    user.balance -= (price * quantity)
    if not update_portfolio(user_id, symbol, price, quantity, date):
        return jsonify({'error': 'Failed to update portfolio'}), 500
    db.session.add(new_transaction) 
    db.session.commit()
    return jsonify({'message': 'Transaction created successfully'}), 201

# Reverse a transaction
@transactions_bp.route('/api/transactions/reverse/<id>', methods=['PUT'])
def reverse_transaction(id):
    # Authenticate user 
    token = request.headers.get('Authorization')
    if not token or not validate_token(token):
        return jsonify({'error': 'Unauthorized: No credentials found.'}), 401
    user_id = cache.get(token).decode('utf-8')
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    if transaction.user_id != int(user_id):
        return jsonify({'error': 'Unauthorized: Invalid transaction id.'}), 401
    # Return transaction price to user Balance
    user.balance += transaction.price * transaction.quantity
    # Deduct the transaction from the user's portfolio
    portfolio = json.loads(user.portfolio)
    for stock in portfolio:
        if stock['symbol'] == transaction.symbol and stock['purchasePrice'] == transaction.price and stock['quantity'] == transaction.quantity:
            portfolio.remove(stock)
            break
    user.portfolio = json.dumps(portfolio)
    transaction.reversed = True
    db.session.commit()
    return jsonify({'message': 'Transaction reversed successfully'}), 200

# Non Route Functions
# Update the portfolio after a new transaction
def update_portfolio(user_id, symbol, price, quantity, date):
    if not user_id or not symbol or not price or not quantity or not date:
        return False
    user = User.query.get(user_id)
    if not user:
        return False
    portfolio = json.loads(user.portfolio)
    if not portfolio:
        portfolio = []
    cur_stock = {'symbol': symbol, 'purchasePrice': price, 'purchaseDate': date.strftime('%Y-%m-%d'), 'quantity': quantity}
    portfolio.append(cur_stock)    
    user.portfolio = json.dumps(portfolio)
    db.session.commit()
    return True

