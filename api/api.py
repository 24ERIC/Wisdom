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

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog_database.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)


from flask import render_template, abort
import logging
import sqlite3



logging.basicConfig(level=logging.DEBUG)


#########################################################################################################
# Blog Search ###########################################################################################
#########################################################################################################
def rank_results(query, results):
    query_terms = Counter(query.split())
    ranked_results = sorted(
        results,
        key=lambda x: sum(query_terms[word] for word in x['name'].lower().split() if word in query_terms),
        reverse=True
    )
    return ranked_results

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query', '').lower()
    tag_query = request.args.get('tag', '').lower().split(',')
    
    # Load the blog index
    with open('blog_index.json', 'r') as index_file:
        blog_index = json.load(index_file)
    
    # Basic search functionality
    results = [
        item for item in blog_index
        if query in item['name'].lower() or any(tag in item['tags'] for tag in tag_query)
    ]

    # Rank the results based on the number of query term occurrences
    results = rank_results(query, results)
    
    # Suggest similar tags if no results found
    if not results and query:
        all_tags = {tag for item in blog_index for tag in item['tags']}
        suggested_tags = get_close_matches(query, all_tags)
        if suggested_tags:
            results = [
                item for item in blog_index
                if any(suggested_tag in item['tags'] for suggested_tag in suggested_tags)
            ]
            message = f"No direct matches found. Showing results for related tags: {', '.join(suggested_tags)}"
            results = rank_results(query, results)
        else:
            message = "No matches or similar tags found."
        return jsonify({'message': message, 'results': results})
    
    return jsonify(results)
#########################################################################################################

def db_operation(query, args=(), commit=False):
    with sqlite3.connect('./api/blog_database.db') as conn:
        cursor = conn.cursor()
        cursor.execute(query, args)
        if commit:
            conn.commit()
            return cursor.lastrowid
        else:
            return cursor.fetchall()

@app.route('/api/blogs', methods=['POST'])
def add_blog_post():
    try:
        data = request.get_json()
        if not all(key in data for key in ['title', 'tags', 'content']):
            return jsonify({'error': 'Missing title, tags, or content'}), 400

        with sqlite3.connect('./api/blog_database.db') as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO blogs (title, tags, content) VALUES (?, ?, ?)",
                           (data['title'], data['tags'], data['content']))
            conn.commit()
            return jsonify({"id": cursor.lastrowid}), 201
    except sqlite3.Error as e:
        app.logger.error('Database error: %s', e)
        abort(500, description="Database Error")
    except Exception as e:
        app.logger.error('Failed to add blog post: %s', e)
        abort(500, description="Internal Server Error")

@app.route("/api/blogs/<int:blog_id>", methods=["PUT", "DELETE"])
def blog_post(blog_id):
    try:
        if request.method == "PUT":
            data = request.get_json()
            if not all(key in data for key in ['title', 'tags', 'content']):
                return jsonify({'error': 'Missing title, tags, or content'}), 400
            db_operation("UPDATE blogs SET title = ?, tags = ?, content = ? WHERE id = ?",
                         (data['title'], data['tags'], data['content'], blog_id), commit=True)
            return jsonify({"success": True}), 200

        elif request.method == "DELETE":
            db_operation("DELETE FROM blogs WHERE id = ?", (blog_id,), commit=True)
            return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/blogs', methods=['GET'])
def get_all_blogs():
    try:
        all_posts = db_operation("SELECT * FROM blogs")
        # Format the results into a list of dicts, or use a model serialization approach
        posts = [{"id": post[0], "title": post[1], "tags": post[2], "content": post[3]} for post in all_posts]
        return jsonify(posts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


import psutil

@app.route('/api/tools/audio/system_info')
def system_info():
    memory = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=1)
    ram_usage = memory.percent
    network_speed = "N/A"  # Placeholder, implement based on your requirements
    temperature = "N/A"  # Placeholder, implement based on your system's capability

    return jsonify({
        'memory': memory.percent,
        'cpu': cpu,
        'ramUsage': ram_usage,
        'networkSpeed': network_speed,
        'temperature': temperature
    })




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

    
    
    