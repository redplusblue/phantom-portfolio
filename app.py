import os
from flask import Flask, send_from_directory
from models.models import db, User
from routes import routes_bp
from auth import auth_bp
import utils.cache as cache

app = Flask(__name__, static_url_path='/static', static_folder='frontend/dist')

# Register the Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(routes_bp)

# Configuration
app.config['SECRET_KEY'] = 'DB_SECRET_981UY8Y2E83E4C94ER8'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trading_platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Serve the static files for the frontend
app.static_folder = 'frontend/dist'

# Initialize the database
db.init_app(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
