from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import json

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)


@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query', '').lower()
    tag_query = request.args.get('tag', '').lower().split(',')
    with open('blog_index.json', 'r') as index_file:
        blog_index = json.load(index_file)
    
    results = []
    for item in blog_index:
        if query in item['name'].lower() or any(tag in item['tags'] for tag in tag_query):
            results.append(item)
    
    return jsonify(results)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)