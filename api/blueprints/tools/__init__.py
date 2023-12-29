from flask import Blueprint

tools_bp = Blueprint('tools_bp', __name__)

from . import routes
