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
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

#########################################################################################################
# Table of Content
# - 
# - 
# - 
# - 
#########################################################################################################



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



#########################################################################################################
# Blog Search Indexing, Generate/Update blog_index.json #################################################
#########################################################################################################
def extract_tags(content):
    match = re.search(r'^Tags:\s*(.+)$', content, re.MULTILINE)
    if match:
        return [tag.strip() for tag in match.group(1).split(',')]
    return []

def index_blog(directory):
    index = []
    base_url = "https://24eric.github.io/Wisdom/Blog/"
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                relative_path = os.path.relpath(root, directory)
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as md_file:
                    content = md_file.read()
                tags = extract_tags(content)
                # Convert file path to URL
                if relative_path != '.':
                    web_path = base_url + os.path.join(relative_path, file).replace('.md', '.html').replace('\\', '/')
                else:
                    web_path = base_url + file.replace('.md', '.html')
                index.append({'name': file, 'path': web_path, 'tags': tags})
                print(f'Indexed: {file}')
    return index
#########################################################################################################



if __name__ == '__main__':
    # Blog Search Indexing, Generate/Update blog_index.json
    with open('api/blog_index.json', 'w') as index_file:
        json.dump(index_blog('Blog'), index_file)
    app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
    
    
    