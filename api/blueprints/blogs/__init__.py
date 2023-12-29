from flask import Blueprint

blogs_bp = Blueprint('blogs_bp', __name__)

from . import routes
