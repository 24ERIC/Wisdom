from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer)
    child_id = db.Column(db.Integer)
    list_child_id = db.Column(db.Integer)
    content = db.Column(db.Text)
    type = db.Column(db.String(50))
    meta = db.Column(db.Text)

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    block_id = db.Column(db.Integer)
    title = db.Column(db.String(100))

@app.route('/blocks/<int:current_block_id>', methods=['POST'])
def split_block(current_block_id):
    data = request.json
    curr_content = data.get('currContent')
    new_content = data.get('newContent')
    original_block = Block.query.get(current_block_id)
    if not original_block:
        return jsonify({"error": "Block not found"}), 404
    original_block.content = curr_content
    new_block = Block(
        parent_id=current_block_id,
        content=new_content,
        type=original_block.type,
        list_child_id=original_block.list_child_id
    )
    db.session.add(new_block)
    db.session.commit()
    original_block.list_child_id = None
    if original_block.child_id:
        existing_child_block = Block.query.get(original_block.child_id)
        if existing_child_block:
            existing_child_block.parent_id = new_block.id
            new_block.child_id = original_block.child_id
    original_block.child_id = new_block.id
    db.session.commit()
    return jsonify(block_id=new_block.id), 201

@app.route('/blocks/<int:block_id>', methods=['PUT'])
def handle_block_put(block_id):
    block = Block.query.get(block_id)
    if not block:
        abort(404)
    if request.method == 'PUT':
        data = request.json
        print(data)
        block.content = data.get('content')
        db.session.commit()
        return jsonify(block_id=block.id), 200
    elif request.method == 'DELETE':
        delete_recursive(block_id)
        db.session.commit()
        return '', 204

@app.route('/blocks/<int:block_id>/single', methods=['DELETE'])
def handle_block_delete_single(block_id):
    block_to_delete = Block.query.get(block_id)
    if not block_to_delete:
        abort(404)

    def delete_block_and_children(block):
        # Recursive function to delete a block and its list children
        if block.list_child_id:
            list_child_block = Block.query.get(block.list_child_id)
            delete_block_and_children(list_child_block)
        db.session.delete(block)

    # If the block to delete is the root block of a page, handle accordingly
    page = Page.query.filter_by(block_id=block_id).first()
    if page:
        if block_to_delete.child_id:
            page.block_id = block_to_delete.child_id
        else:
            # If there's no child, create a new block to replace the deleted root block
            new_block = Block()
            db.session.add(new_block)
            db.session.flush()  # To get the new block's ID
            page.block_id = new_block.id

    # If the block to delete is not a root block, handle its parent and children
    else:
        # If the block to delete has a list_child_id, we need to handle this scenario
        if block_to_delete.list_child_id:
            # Find the parent block whose child_id is the block to delete
            parent_block = Block.query.filter_by(child_id=block_id).first()
            if parent_block:
                # If the block to delete has a child_id, link it to the parent
                if block_to_delete.child_id:
                    parent_block.child_id = block_to_delete.child_id
                else:
                    # If there is no child_id, remove the link from the parent
                    parent_block.child_id = None

        # Delete the block and its list children
        delete_block_and_children(block_to_delete)

    db.session.commit()
    return '', 204





@app.route('/blocks/<int:block_id>/children', methods=['DELETE'])
def handle_block_delete_children(block_id):
    delete_recursive(block_id)
    db.session.commit()
    return '', 204


@app.route('/pages', methods=['POST'])
def create_page():
    data = request.json
    new_page = Page(
        block_id=data.get('block_id'),
        title=data.get('title')
    )
    db.session.add(new_page)
    db.session.commit()
    return jsonify(page_id=new_page.id), 201



def delete_recursive(block_id):
    block = Block.query.get(block_id)
    if block.child_id:
        delete_recursive(block.child_id)
    if block.list_child_id:
        delete_recursive(block.list_child_id)
    db.session.delete(block)

@app.route('/pages/<int:page_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_page_put_delete(page_id):
    page = Page.query.get(page_id)
    if not page:
        abort(404)
    if request.method == 'GET':
        def get_block_children(block_id):
            children = []
            while block_id:
                child_block = Block.query.get(block_id)
                if child_block is None:
                    break
                block_data = {
                    'block_id': child_block.id,
                    'block_content': child_block.content,
                    'block_type': child_block.type,
                    'block_meta': child_block.meta,
                    'children': []
                }
                if child_block.list_child_id:
                    block_data['children'] = get_block_children(child_block.list_child_id)
                children.append(block_data)
                block_id = child_block.child_id
            return children
        page_data = {
            'page_id': page.id,
            'page_title': page.title,
            'blocks': get_block_children(page.block_id)
        }
        return jsonify(page_data)
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