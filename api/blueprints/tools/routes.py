from flask import jsonify
from . import tools_bp

@tools_bp.route('/latesttools', methods=['GET'])
def get_latest_tools():
    try:
        sample_tools = [
            {"id": 1, "name": "Tool 1"},
            {"id": 2, "name": "Tool 2"},
            {"id": 3, "name": "Tool 3"},
            {"id": 1, "name": "Tool 1"},
            {"id": 2, "name": "Tool 2"},
            {"id": 3, "name": "Tool 3"},
            {"id": 1, "name": "Tool 1"},
            {"id": 2, "name": "Tool 2"},
            {"id": 3, "name": "Tool 3"},
            {"id": 1, "name": "Tool 1"},
            {"id": 2, "name": "Tool 2"},
            {"id": 3, "name": "Tool 3"},
        ]

        return jsonify(sample_tools)
    except Exception as e:
        return jsonify({'error': str(e)}), 500