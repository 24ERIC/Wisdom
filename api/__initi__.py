from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import logging

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)

    from api.blueprints.blogs import blogs_bp
    app.register_blueprint(blogs_bp, url_prefix='/api/blogs')

    from api.blueprints.system_info import system_info_bp
    app.register_blueprint(system_info_bp, url_prefix='/api/tools/audio')

    from api.blueprints.search import search_bp
    app.register_blueprint(search_bp, url_prefix='/api/search')

    from api.blueprints.tools import tools_bp
    app.register_blueprint(tools_bp, url_prefix='/api/tools')

    return app

db = SQLAlchemy()
migrate = Migrate()
logging.basicConfig(level=logging.DEBUG)
