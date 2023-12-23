import psutil
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import logging
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError


app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog_database.db'
db = SQLAlchemy(app)


migrate = Migrate(app, db)
logging.basicConfig(level=logging.DEBUG)


@app.route('/api/tools/audio/system_info')
def system_info():
    memory = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=1)
    return jsonify({
        'memory': memory.percent,
        'cpu': cpu
    })


@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    offset = (page - 1) * per_page
    try:
        query = text("""
        SELECT post_id, title, content, number_of_views, tag
        FROM Posts
        ORDER BY number_of_views DESC, title ASC
        LIMIT :per_page OFFSET :offset
        """)
        posts = db.session.execute(query, {'per_page': per_page, 'offset': offset}).fetchall()
        posts_list = []
        for post in posts:
            post_dict = {
                'post_id': post.post_id,
                'title': post.title,
                'content': post.content,
                'number_of_views': post.number_of_views,
                'tag': post.tag
            }
            posts_list.append(post_dict)
        return jsonify(posts_list)
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/blogs/<int:post_id>', methods=['GET'])
def get_blog(post_id):
    try:
        query = text("""
        SELECT post_id, title, content, number_of_views, tag
        FROM Posts
        WHERE post_id = :post_id
        """)
        post = db.session.execute(query, {'post_id': post_id}).fetchone()
        return jsonify(dict(post)) if post else jsonify({'error': 'Post not found'}), 404 if post is None else 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/blogs', methods=['POST'])
def create_blog():
    data = request.get_json()
    try:
        query = text("INSERT INTO Posts (title, content, number_of_views, tag) VALUES (:title, :content, 0, :tag) RETURNING post_id")
        post_id = db.session.execute(query, {"title": data['title'], "content": data['content'], "tag": data.get('tag', '')}).fetchone()[0]
        db.session.commit()
        return jsonify({'message': 'Post created successfully', 'post_id': post_id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/blogs/<int:post_id>', methods=['PUT'])
def update_blog(post_id):
    data = request.get_json()
    try:
        query = text("UPDATE Posts SET title = :title, content = :content, tag = :tag WHERE post_id = :post_id")
        db.session.execute(query, {"title": data['title'], "content": data['content'], "tag": data.get('tag', ''), "post_id": post_id})
        db.session.commit()
        return jsonify({'message': 'Post updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/blogs/<int:post_id>', methods=['DELETE'])
def delete_blog(post_id):
    try:
        db.session.execute(text("DELETE FROM Posts WHERE post_id = :post_id"), {"post_id": post_id})
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/numberofblogs', methods=['GET'])
def get_number_of_blogs():
    try:
        query = text("SELECT COUNT(*) FROM Posts")
        result = db.session.execute(query).fetchone()
        count = result[0]

        return jsonify({'numberOfBlogs': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/numberoftags', methods=['GET'])
def number_of_tags():
    try:
        query = text("SELECT COUNT(*) FROM Tags")
        count = db.session.execute(query).scalar()
        return jsonify(count)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/search/history', methods=['GET'])
def get_search_history():
    try:
        query = text("SELECT * FROM SearchHistory")
        history = db.session.execute(query).fetchall()
        return jsonify([{'search_id': h[0], 'search_query': h[1], 'timestamp': h[2]} for h in history])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/latestblogs', methods=['GET'])
def get_latest_blogs():
    try:
        query = text("""
            SELECT post_id, title FROM Posts 
            ORDER BY number_of_views DESC LIMIT 10
        """)
        latest_posts = db.session.execute(query).fetchall()
        posts = [{"id": post[0], "title": post[1]} for post in latest_posts]
        return jsonify(posts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/latesttools', methods=['GET'])
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
    

@app.route('/api/blogs/<int:post_id>/increment-views', methods=['POST'])
def increment_views(post_id):
    try:
        query = text("""
        UPDATE Posts SET number_of_views = number_of_views + 1 WHERE post_id = :post_id
        """)
        db.session.execute(query, {"post_id": post_id})
        db.session.commit()
        return jsonify({'message': 'View count incremented successfully'}), 200
    except Exception as e:
        app.logger.error(f'Error incrementing view count: {str(e)}')
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)