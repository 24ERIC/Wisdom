from flask import Blueprint

system_info_bp = Blueprint('system_info_bp', __name__)

from . import routes
