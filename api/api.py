import psutil
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import json
from difflib import get_close_matches
from collections import Counter
import os
import json
import re
from flask import render_template, abort
import logging
import sqlite3
from sqlalchemy import text

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog_database.db'
db = SQLAlchemy(app)

migrate = Migrate(app, db)
logging.basicConfig(level=logging.DEBUG)


# Table of Content
# 1 - CPU RAM



#########################################################################################################
# 1 - CPU RAM #################################################################################################
#########################################################################################################
@app.route('/api/tools/audio/system_info')
def system_info():
    memory = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=1)

    return jsonify({
        'memory': memory.percent,
        'cpu': cpu
    })
#########################################################################################################
#########################################################################################################
#########################################################################################################

@app.route('/api/blogs', methods=['GET'])
@app.route('/api/blogs/<int:post_id>', methods=['GET'])
def get_blogs(post_id=None):
    try:
        if post_id is None:
            # Fetch all blog posts
            query = text("""
            SELECT p.post_id, p.title, p.content, p.number_of_views, t.tag_name
            FROM Posts p
            LEFT JOIN PostTags pt ON p.post_id = pt.post_id
            LEFT JOIN Tags t ON pt.tag_id = t.tag_id
            ORDER BY p.number_of_views DESC, p.title ASC
            """)
        else:
            # Fetch a specific blog post by ID
            query = text("""
            SELECT p.post_id, p.title, p.content, p.number_of_views, t.tag_name
            FROM Posts p
            LEFT JOIN PostTags pt ON p.post_id = pt.post_id
            LEFT JOIN Tags t ON pt.tag_id = t.tag_id
            WHERE p.post_id = :post_id
            """)
            query = query.bindparams(post_id=post_id)

        all_posts = db.session.execute(query).fetchall()
        posts = [{"id": post[0], "title": post[1], "content": post[2], "number_of_views": post[3], "tag": post[4]} for post in all_posts]
        return jsonify(posts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/api/blogs/<int:post_id>', methods=['PUT'])
def update_blog(post_id):
    data = request.get_json()
    try:
        query = text("""
        UPDATE Posts SET title = :title, content = :content, number_of_views = :number_of_views
        WHERE post_id = :post_id
        """)
        db.session.execute(
            query,
            {
                "title": data['title'],
                "content": data['content'],
                "number_of_views": data['number_of_views'],
                "post_id": post_id,
            },
        )
        db.session.commit()
        return jsonify({'message': 'Post updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    


@app.route('/api/blogs', methods=['POST'])
def create_blog():
    data = request.get_json()
    try:
        number_of_views = data.get('number_of_views', 0)
        query = text("INSERT INTO Posts (title, content, number_of_views) VALUES (:title, :content, :number_of_views) RETURNING post_id")
        result = db.session.execute(query, {"title": data['title'], "content": data['content'], "number_of_views": number_of_views})
        post_id = result.fetchone()[0]

        # Handle tags
        if 'tag' in data and data['tag']:
            # Check if the tag exists
            tag_query = text("SELECT tag_id FROM Tags WHERE tag_name = :tag_name")
            tag_result = db.session.execute(tag_query, {"tag_name": data['tag']}).fetchone()

            if tag_result:
                tag_id = tag_result[0]
            else:
                # Insert new tag
                insert_tag_query = text("INSERT INTO Tags (tag_name) VALUES (:tag_name) RETURNING tag_id")
                tag_result = db.session.execute(insert_tag_query, {"tag_name": data['tag']})
                tag_id = tag_result.fetchone()[0]

            # Link post with tag
            post_tag_query = text("INSERT INTO PostTags (post_id, tag_id) VALUES (:post_id, :tag_id)")
            db.session.execute(post_tag_query, {"post_id": post_id, "tag_id": tag_id})

        db.session.commit()
        return jsonify({'message': 'Post created successfully'}), 201
    except Exception as e:
        app.logger.error(f'Error creating blog post: {str(e)}')
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route('/api/blogs/<int:post_id>', methods=['DELETE'])
def delete_blog(post_id):
    try:
        query = text("DELETE FROM Posts WHERE post_id = :post_id")
        db.session.execute(query, {"post_id": post_id})
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/tags', methods=['GET'])
def get_tags():
    try:
        query = text("SELECT * FROM Tags")
        tags = db.session.execute(query).fetchall()
        return jsonify([{'id': tag[0], 'name': tag[1]} for tag in tags])
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
        # Sample data for latest tools (replace with your actual data)
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

        # Return the sample data as JSON
        return jsonify(sample_tools)
    except Exception as e:
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
