from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=True)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    additional_metadata = db.Column(db.Text)  # Changed the name to 'additional_metadata'
    children = db.relationship('Block', backref=db.backref('parent', remote_side=[id]), lazy=True)

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    block_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=False, unique=True)
    title = db.Column(db.String(100), nullable=False)

@app.route('/blocks', methods=['GET', 'POST'])
def handle_blocks():
    if request.method == 'GET':
        blocks = Block.query.all()
        return jsonify([{'id': block.id, 'content': block.content, 'type': block.type} for block in blocks])
    elif request.method == 'POST':
        data = request.json
        new_block = Block(content=data['content'], type=data['type'], metadata=data.get('metadata', ''))
        db.session.add(new_block)
        db.session.commit()
        return jsonify({'id': new_block.id}), 201

@app.route('/blocks/<int:block_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_block(block_id):
    block = Block.query.get(block_id)
    if not block:
        abort(404)

    if request.method == 'GET':
        return jsonify({'id': block.id, 'content': block.content, 'type': block.type, 'metadata': block.metadata})
    elif request.method == 'PUT':
        data = request.json
        block.content = data['content']
        block.type = data['type']
        block.metadata = data.get('metadata', block.metadata)
        db.session.commit()
        return jsonify({'id': block.id})
    elif request.method == 'DELETE':
        # Recursively delete child blocks
        delete_recursive(block_id)
        db.session.commit()
        return jsonify({}), 204

def delete_recursive(block_id):
    block = Block.query.get(block_id)
    for child in block.children:
        delete_recursive(child.id)
    db.session.delete(block)

@app.route('/pages', methods=['GET', 'POST'])
def handle_pages():
    if request.method == 'GET':
        pages = Page.query.all()
        return jsonify([{'id': page.id, 'title': page.title, 'block_id': page.block_id} for page in pages])
    elif request.method == 'POST':
        data = request.json
        new_page = Page(title=data['title'], block_id=data['block_id'])
        db.session.add(new_page)
        db.session.commit()
        return jsonify({'id': new_page.id}), 201

@app.route('/pages/<int:page_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_page(page_id):
    page = Page.query.get(page_id)
    if not page:
        abort(404)

    if request.method == 'GET':
        return jsonify({'id': page.id, 'title': page.title, 'block_id': page.block_id})
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
