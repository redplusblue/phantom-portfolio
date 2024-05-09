from flask_sqlalchemy import SQLAlchemy # type: ignore

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    balance = db.Column(db.Float, default=10000.0)  # Initial virtual currency balance
    portfolio = db.Column(db.String(1000), default='[]')  # JSON string representing the user's portfolio
    # Json string representing all the lists of stocks the user has 
    stocklists = db.Column(db.String(1000), default='[]')  # JSON string representing the user's stock list
        
    def __repr__(self):
        return f'<User {self.username}>'

# Stock -> Redundant 
# class Stock(db.Model):
#     symbol = db.Column(db.String(50), primary_key=True)
#     purchasePrice = db.Column(db.Float, nullable=False)
#     purchaseDate = db.Column(db.DateTime, nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     user = db.relationship('User', backref=db.backref('stocks', lazy=True))
    
#     def __repr__(self):
#         return f'<Stock {self.symbol}> @ {self.purchasePrice} x {self.quantity}'
    
# List of Stocks 
class StockList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('stocklist', lazy=True))
    stocks = db.Column(db.String(1000), default='[]')  # JSON string representing the user's stock list
    
    def __repr__(self):
        return f'<StockList {self.id}>'

# Transaction
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    reversed = db.Column(db.Boolean, default=False)  # True if the transaction was reversed
    date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('transactions', lazy=True))
    
    def __repr__(self):
        return f'<Transaction {self.symbol}> @ {self.price} x {self.quantity}'