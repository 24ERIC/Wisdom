# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('block.id'), nullable=True)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)
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
        new_block = Block(content=data['content'], type=data['type'])
        db.session.add(new_block)
        db.session.commit()
        return jsonify({'id': new_block.id}), 201

@app.route('/blocks/<int:block_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_block(block_id):
    block = Block.query.get_or_404(block_id)
    if request.method == 'GET':
        return jsonify({'id': block.id, 'content': block.content, 'type': block.type})
    elif request.method == 'PUT':
        data = request.json
        block.content = data['content']
        block.type = data['type']
        db.session.commit()
        return jsonify({'id': block.id})
    elif request.method == 'DELETE':
        db.session.delete(block)
        db.session.commit()
        return jsonify({}), 204

@app.route('/pages', methods=['GET', 'POST'])
def handle_pages():
    # Similar to blocks, implement CRUD for pages
    pass

# Add more routes as needed

if __name__ == '__main__':
    app.run(debug=True)
