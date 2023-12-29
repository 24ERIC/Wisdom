from flask import jsonify
from . import search_bp
from api import db
from sqlalchemy import text

# Include your search routes here, e.g., get_search_history
@search_bp.route('/history', methods=['GET'])
def get_search_history():
    try:
        query = text("SELECT * FROM SearchHistory")
        history = db.session.execute(query).fetchall()
        return jsonify([{'search_id': h[0], 'search_query': h[1], 'timestamp': h[2]} for h in history])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
