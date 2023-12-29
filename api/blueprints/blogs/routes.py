from flask import request, jsonify
from . import blogs_bp

from api import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
import os
from werkzeug.utils import secure_filename
import shutil

@blogs_bp.route('/', methods=['GET'])
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

@blogs_bp.route('/<int:post_id>', methods=['GET'])
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
    
    
@blogs_bp.route('/', methods=['POST'])
def create_blog():
    data = request.get_json()
    try:
        query = text("INSERT INTO Posts (title, content, number_of_views, tag) VALUES (:title, :content, 0, :tag) RETURNING post_id")
        post_id = db.session.execute(query, {"title": data['title'], "content": data['content'], "tag": data.get('tag', '')}).fetchone()[0]
        db.session.commit()
        create_folder(post_id)
        return jsonify({'message': 'Post created successfully', 'post_id': post_id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
def create_folder(blog_id):
    directory = f"../public/blog_image/{blog_id}"
    
    if not os.path.exists(directory):
        os.makedirs(directory)
        return f"Folder '{blog_id}' created successfully."
    else:
        return f"Folder '{blog_id}' already exists."

@blogs_bp.route('/<int:post_id>/increment-views', methods=['POST'])
def increment_views(post_id):
    try:
        query = text("""
        UPDATE Posts SET number_of_views = number_of_views + 1 WHERE post_id = :post_id
        """)
        db.session.execute(query, {"post_id": post_id})
        db.session.commit()
        return jsonify({'message': 'View count incremented successfully'}), 200
    except Exception as e:
        blogs_bp.logger.error(f'Error incrementing view count: {str(e)}')
        return jsonify({'error': 'Internal Server Error'}), 500




@blogs_bp.route('/imageupload/<int:currentPostId>', methods=['POST'])
def upload_file(currentPostId):
    UPLOAD_FOLDER = f'../public/blog_image/{currentPostId}'
    blogs_bp.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(blogs_bp.config['UPLOAD_FOLDER'], filename))
        return jsonify({'message': 'File uploaded successfully'}), 200
    
@blogs_bp.route('/<int:post_id>', methods=['PUT'])
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
    
    
@blogs_bp.route('/<int:post_id>', methods=['DELETE'])
def delete_blog(post_id):
    try:
        db.session.execute(text("DELETE FROM Posts WHERE post_id = :post_id"), {"post_id": post_id})
        db.session.commit()
        delete_folder(post_id)
        return jsonify({'message': 'Post deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
def delete_folder(blog_id):
    directory = f"../../../public/blog_image/{blog_id}"
    if os.path.exists(directory):
        shutil.rmtree(directory)
        return f"Folder '{blog_id}' deleted successfully."
    else:
        return f"Folder '{blog_id}' does not exist."


@blogs_bp.route('/latestblogs', methods=['GET'])
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
    
@blogs_bp.route('/numberofblogs', methods=['GET'])
def get_number_of_blogs():
    try:
        query = text("SELECT COUNT(*) FROM Posts")
        result = db.session.execute(query).fetchone()
        count = result[0]

        return jsonify({'numberOfBlogs': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
