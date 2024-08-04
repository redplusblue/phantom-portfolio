from flask import Flask, send_from_directory
from models.models import db
from routes.routes import routes_bp
from routes.auth import auth_bp
from routes.users import users_bp
from routes.transactions import transactions_bp
from flask_cors import CORS # type: ignore
import os

app = Flask(__name__)

# Static Folder
app = Flask(__name__, static_folder='../frontend/dist')

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
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
