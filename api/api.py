import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import logging
from sqlalchemy import text
from flask import Flask, jsonify, request


app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/blog_database.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
logging.basicConfig(level=logging.DEBUG)


from blueprints.blogs.routes import blogs_bp
from blueprints.search.routes import search_bp
from blueprints.system_info.routes import system_info_bp
from blueprints.tools.routes import tools_bp


    
app.register_blueprint(blogs_bp, url_prefix='/api/blogs')
app.register_blueprint(search_bp, url_prefix='/api/search')
app.register_blueprint(system_info_bp, url_prefix='/api/tools/audio')
app.register_blueprint(tools_bp, url_prefix='/api/tools')





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
