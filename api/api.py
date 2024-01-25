from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import Enum

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)


orange_text = "\033[38;5;202m"
reset_format = "\033[0m"
larger_header = "\033[1m"

def add_fake_data():
    db.session.query(Block).delete()

    blocks = [
        Block(id=1, parent_id=None, child_id=2, content="Root 1", type="unordered-list-item", media_data="", depth=0),
        Block(id=2, parent_id=1, child_id=3, content="2, d=1", type="unordered-list-item", media_data="", depth=1),
        Block(id=3, parent_id=2, child_id=4, content="3, d=2", type="unordered-list-item", media_data="", depth=2),
        Block(id=4, parent_id=3, child_id=None, content="4, d=0", type="unordered-list-item", media_data="", depth=0),
    ]
    db.session.add_all(blocks)
    db.session.commit()
    print("Fake data added successfully!")


class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer)
    child_id = db.Column(db.Integer)
    content = db.Column(db.Text)
    type = db.Column(Enum('page', 'page-link', 'unordered-list-item', 'ordered-list-item', 'header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six', 'blockquote', 'code-block', 'atomic', name='valid_block_type')) 
    media_data = db.Column(db.Text)
    depth = db.Column(db.Integer, default=0)
    
    @classmethod
    def get_root_blocks(cls): 
        return cls.query.filter(cls.parent_id.is_(None)).all()
    
    @staticmethod
    def get_block_and_descendants(block_id):
        def get_descendants(block):
            descendants = []
            current_block = block
            while current_block:
                descendants.append(current_block)
                current_block = Block.query.filter_by(parent_id=current_block.id).first()
            return descendants

        root_block = Block.query.get(block_id)
        if not root_block:
            return None
        return get_descendants(root_block)
    
    def update_content(self, new_content):
        self.content = new_content
        db.session.commit()
        
    def add_child(self, child_block):
        child_block.parent_id = self.id
        db.session.add(child_block)
        db.session.commit()
        
    def delete_child(self, child_block_id):
        child_block = Block.query.get(child_block_id)
        if child_block and child_block.parent_id == self.id:
            db.session.delete(child_block)
            db.session.commit()
            
    def get_children(self):
        return Block.query.filter_by(parent_id=self.id).all()
    
    def set_type(self, new_type):
        self.type = new_type
        db.session.commit()
        
    def get_parent(self):
        return Block.query.get(self.parent_id) if self.parent_id else None

    def delete_recursive(self):
        for child in self.get_children():
            child.delete_recursive()
        db.session.delete(self)
        db.session.commit()

    def split_block(self, split_index):
        new_block = Block(
            content=self.content[split_index:],
            type=self.type
        )
        self.content = self.content[:split_index]
        self.add_child(new_block)
        return new_block








@app.route('/api/root-blocks', methods=['GET'])
def get_root_blocks():
    try:
        root_blocks = Block.get_root_blocks()

        root_blocks_data = [{
            'id': block.id,
            'parent_id': block.parent_id,
            'child_id': block.child_id,
            'content': block.content,
            'type': block.type,
            'media_data': block.media_data,
            'depth': block.depth
        } for block in root_blocks]
        return jsonify(root_blocks_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/page/<int:block_id>', methods=['GET'])
def get_block_and_its_descendants(block_id):
    try:
        blocks = Block.get_block_and_descendants(block_id)
        if blocks is None:
            return jsonify({"error": "Block not found"}), 404

        blocks_data = [{
            'id': block.id,
            'parent_id': block.parent_id,
            'child_id': block.child_id,
            'content': block.content,
            'type': block.type,
            'media_data': block.media_data,
            'depth': block.depth
        } for block in blocks]

        return jsonify(blocks_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
    
# @app.route('/test', methods=['GET'])
# @app.route('/blocks/<int:current_block_id>', methods=['POST'])
# @app.route('/blocks/<int:block_id>', methods=['PUT'])
# @app.route('/blocks/<int:block_id>/single', methods=['DELETE'])
# @app.route('/blocks/<int:block_id>/children', methods=['DELETE'])
# @app.route('/pages', methods=['POST'])
# @app.route('/pages/<int:page_id>', methods=['GET', 'PUT', 'DELETE'])




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        add_fake_data()
    app.run(debug=True)