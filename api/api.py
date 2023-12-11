import markdown
import os

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate


app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
# Existing code...

@app.route('/api/blog/markdown/<path:filename>', methods=['GET'])
def get_markdown_file(filename):
    md_file_path = os.path.join('../blog', filename)
    if not os.path.exists(md_file_path) or not md_file_path.endswith('.md'):
        return jsonify({'error': 'File not found'}), 404

    with open(md_file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        html_content = markdown.markdown(content)
        return jsonify({'content': html_content})







class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('tag.id'), nullable=True)
    children = db.relationship('Tag', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

with app.app_context():
    db.create_all()

@app.route('/api/blog/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()

    def serialize(tag):
        return {
            'id': tag.id,
            'name': tag.name,
            'parent_id': tag.parent_id,
            'children': [serialize(child) for child in tag.children]
        }

    root_tags = [serialize(tag) for tag in tags if tag.parent_id is None]
    return jsonify(root_tags)


article_tags = db.Table('article_tags',
    db.Column('article_id', db.Integer, db.ForeignKey('article.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

FAKE_DATA = [
    {'title': 'Blog Post 1', 'tags': ['Tag1', 'Tag2'], 'date': '2023-01-01', 'content': 'This is the content of blog post 1...'},
    {'title': 'Blog Post 2', 'tags': ['Tag3', 'Tag4'], 'date': '2023-02-01', 'content': 'This is the content of blog post 2...'},
    {'title': 'Blog Post 3', 'tags': ['Tag5', 'Tag6'], 'date': '2023-03-01', 'content': 'This is the content of blog post 3...'}
]

@app.route('/api/blog/searchResult', methods=['GET'])
def get_search_result():
    search_query = request.args.get('query')
    return jsonify(FAKE_DATA)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)