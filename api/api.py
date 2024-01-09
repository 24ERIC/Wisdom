from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=True)
    child_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=True)
    content = db.Column(db.Text, nullable=True)
    type = db.Column(db.String(50), nullable=True)
    meta = db.Column(db.Text, nullable=True)
    indent = db.Column(db.Integer, default=0)

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    block_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=True)
    title = db.Column(db.String(100), nullable=True)

@app.route('/blocks/<int:block_id>', methods=['PUT', 'DELETE'])
def handle_block(block_id):
    block = Block.query.get(block_id)
    if not block:
        abort(404)

    if request.method == 'PUT':
        data = request.json
        block.content = data.get('content')
        block.type = data.get('type')
        block.meta = data.get('meta')
        block.indent = data.get('indent')
        db.session.commit()
        return jsonify(block_id=block.id), 200

    elif request.method == 'DELETE':
        delete_recursive(block_id)
        db.session.commit()
        return '', 204

def delete_recursive(block_id):
    block = Block.query.get(block_id)
    if block.child_id:
        delete_recursive(block.child_id)
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
        response_data.extend(get_block_chain(page.block_id))
        return jsonify(response_data)

    elif request.method == 'PUT':
        data = request.json
        page.title = data.get('title')
        db.session.commit()
        return jsonify(page_id=page.id), 200

    elif request.method == 'DELETE':
        if page.block_id:
            delete_recursive(page.block_id)
        db.session.delete(page)
        db.session.commit()
        return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


