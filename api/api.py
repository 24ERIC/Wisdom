from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, nullable=True)
    child_id = db.Column(db.Integer, nullable=True)
    content = db.Column(db.Text, nullable=True)
    type = db.Column(db.String(50), nullable=True)
    meta = db.Column(db.Text, nullable=True)
    indent = db.Column(db.Integer, default=0)
# INSERT INTO block (parent_id, child_id, content, type, meta, indent) VALUES (NULL, 2, 'Blog id 1 content', 'Blog id 1 type', 'Blog id 1 Meta', 0);
# INSERT INTO block (parent_id, child_id, content, type, meta, indent) VALUES (1, 3, 'Blog id 2 content', 'Blog id 2 type', 'Blog id 2 Meta', 0);
# INSERT INTO block (parent_id, child_id, content, type, meta, indent) VALUES (2, 4, 'Blog id 3 content', 'Blog id 3 type', 'Blog id 3 Meta', 0);
class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    block_id = db.Column(db.Integer, nullable=True)
    title = db.Column(db.String(100), nullable=True)
# INSERT INTO page (block_id, block_id) VALUES (1, 'Root Page title');

@app.route('/blocks/<int:block_id>', methods=['PUT', 'DELETE'])
def handle_block(block_id):
    block = Block.query.get(block_id)
    if not block:
        abort(404)

    if request.method == 'PUT':
        data = request.json
        block.content = data['content']
        block.type = data['type']
        block.metadata = data.get('metadata', block.metadata)
        db.session.commit()
        return jsonify({'id': block.id})
    elif request.method == 'DELETE':
        delete_recursive(block_id)
        db.session.commit()
        return jsonify({}), 204

def delete_recursive(block_id):
    block = Block.query.get(block_id)
    for child in block.children:
        delete_recursive(child.id)
    db.session.delete(block)

@app.route('/pages/<int:page_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_page_put_delete(page_id):
    page = Page.query.get(page_id)
    if not page:
        abort(404)
    if request.method == 'GET':
        def get_block_chain(block_id):
            current_block = Block.query.get(block_id)
            block_linked_list = []
            while current_block is not None:
                block_linked_list.append({
                    'block_id': current_block.id,
                    'block_content': current_block.content,
                    'block_type': current_block.type,
                    'block_meta': current_block.meta,
                    'block_indent': current_block.indent
                })
                current_block = Block.query.get(current_block.child_id)
                
            return block_linked_list
        response_data = [{
            'page_id': page.id,
            'page_title': page.title
        }]
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", 
              get_block_chain(page.block_id))
        response_data.extend(get_block_chain(page.block_id))

        return jsonify(response_data)
    elif request.method == 'PUT':
        data = request.json
        page.title = data['title']
        page.block_id = data['block_id']
        db.session.commit()
        return jsonify({'id': page.id})
    elif request.method == 'DELETE':
        db.session.delete(page)
        db.session.commit()
        return jsonify({}), 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
