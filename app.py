from flask import Flask
from models.models import db, User
from routes import routes_bp
from auth import auth_bp
from flask_cors import CORS # type: ignore

app = Flask(__name__)

# Cors for all origins
CORS(app)

# Register the Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(routes_bp)

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

if __name__ == '__main__':
    app.run(debug=True)
