import os
from flask import Flask, jsonify, request, send_from_directory
from flask_login import LoginManager, login_required
from models.models import db, User
from routes import routes_bp

app = Flask(__name__, static_url_path='/static', static_folder='frontend/dist')

# Register the Routes Blueprint
app.register_blueprint(routes_bp)

# Login Manager
login_manager = LoginManager()
login_manager.init_app(app)

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trading_platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Serve the static files for the frontend
app.static_folder = 'frontend/dist'

db.init_app(app)

# User loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(f"Requested path: {path}")
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
