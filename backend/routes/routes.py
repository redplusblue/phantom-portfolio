from flask import Blueprint, request, jsonify
from routes.auth import validate_token
from models.models import db, User
from scripts.stockdata import fetch_stock_data
from utils.cache import cache
import pandas as pd

# Create a Blueprint for Routes
routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/api/stock/<symbol>', methods=['GET'])
def get_stock(symbol):
    # Check authentication
    user_id = request.headers.get('Authorization')
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

# Endpoint to serve autocomplete suggestions    
stocks_data = pd.read_csv('data/filtered_stocks.csv')
@routes_bp.route('/api/autocomplete', methods=['GET'])
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

# Test 
@routes_bp.route('/api/test', methods=['GET', 'OPTIONS'])
def test():
    return jsonify({'message': 'Test successful'}), 200