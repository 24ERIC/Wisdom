import psutil
from flask import jsonify
from . import system_info_bp

@system_info_bp.route('/', methods=['GET'])
def system_info():
    memory = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=1)
    return jsonify({
        'memory': memory.percent,
        'cpu': cpu
    })