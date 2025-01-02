from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')

    # Configuration
    app.config['SECRET_KEY'] = "CRO"
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.abspath('../database/app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    CORS(app)  # Allow frontend-backend communication

    # Serve React build files
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def static_files(path):
        return send_from_directory(app.static_folder, path)

    # Register blueprints
    from .routes.admin_routes import admin_routes
    from .routes.user_routes import user_routes
    from .routes.reporting_routes import reporting

    # Register blueprints
    app.register_blueprint(reporting, url_prefix='/api')
    app.register_blueprint(admin_routes, url_prefix='/api/admin')
    app.register_blueprint(user_routes, url_prefix='/api/user')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
