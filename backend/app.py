from datetime import datetime
from flask import Flask, json
from models.models import User, db, Transaction
from routes.routes import routes_bp
from routes.auth import auth_bp
from routes.users import users_bp
from routes.transactions import transactions_bp
from flask_cors import CORS # type: ignore

app = Flask(__name__)

# Cors for all origins
CORS(app)

# Register the Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(routes_bp)
app.register_blueprint(users_bp)
app.register_blueprint(transactions_bp)

# Configuration
app.config['SECRET_KEY'] = 'DB_SECRET_981UY8Y2E83E4C94ER8'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trading_platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print("Request for", path)
    return "Page not found", 404


# Custom SQL query
# Create transactions for all the stocks in test user's portfolio
# with app.app_context():
#     user = User.query.get(1)
#     if (user):
#         portfolio = json.loads(user.portfolio)
#         for stock in portfolio:
#             transaction = Transaction(symbol=stock['symbol'], price=stock['purchasePrice'], quantity=stock['quantity'], date=datetime.strptime(stock['purchaseDate'], '%Y-%m-%d'), user=user)
#             db.session.add(transaction)
#         db.session.commit()
#     else:
#         print('User not found')
        
# Edit user portfolio
# with app.app_context():
#     user = User.query.get(1)

#     if (user):
#         tsla_stock = Stock(symbol='TSLA', purchasePrice=176.80, purchaseDate=datetime(2024, 5, 7), quantity=4, user=user)
#         aapl_stock = Stock(symbol='AAPL', purchasePrice=182.23, purchaseDate=datetime(2024, 5, 7), quantity=5, user=user)
#         spy_stock = Stock(symbol='SPY', purchasePrice=495.16, purchaseDate=datetime(2024, 4, 19), quantity=10, user=user)
#         tsla_data = {'symbol': tsla_stock.symbol, 'purchasePrice': tsla_stock.purchasePrice, 'purchaseDate': tsla_stock.purchaseDate.strftime('%Y-%m-%d'), 'quantity': tsla_stock.quantity}
#         aapl_data = {'symbol': aapl_stock.symbol, 'purchasePrice': aapl_stock.purchasePrice, 'purchaseDate': aapl_stock.purchaseDate.strftime('%Y-%m-%d'), 'quantity': aapl_stock.quantity}
#         spy_data = {'symbol': spy_stock.symbol, 'purchasePrice': spy_stock.purchasePrice, 'purchaseDate': spy_stock.purchaseDate.strftime('%Y-%m-%d'), 'quantity': spy_stock.quantity}

#         # Store serialized data in user's portfolio
#         user.portfolio = json.dumps([tsla_data, aapl_data, spy_data]) 
#         db.session.commit()
#     else:
#         print('User not found')

 

if __name__ == '__main__':
    app.run(debug=True)
