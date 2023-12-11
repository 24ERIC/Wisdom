from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import json
from difflib import get_close_matches
from collections import Counter

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, resources={r"/api/*": {"origins": "*"}})
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
    
    