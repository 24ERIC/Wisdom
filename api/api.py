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



class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    root_page_id = db.Column(db.Integer)
    parent_id = db.Column(db.Integer)
    child_id = db.Column(db.Integer)
    content = db.Column(db.Text)
    type = db.Column(Enum('page', 'page-link', 'unordered-list-item', 'ordered-list-item', 'header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six', 'blockquote', 'code-block', 'atomic', name='valid_block_type')) 
    media_data = db.Column(db.Text)
    depth = db.Column(db.Integer, default=0)
    
    @classmethod
    def get_root_blocks(cls): 
        return cls.query.filter(cls.root_page_id.is_(None)).all()
    
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





    
    
@app.route('/test', methods=['GET'])
def test():
    


@app.route('/blocks/<int:current_block_id>', methods=['POST'])
@app.route('/blocks/<int:block_id>', methods=['PUT'])
@app.route('/blocks/<int:block_id>/single', methods=['DELETE'])
@app.route('/blocks/<int:block_id>/children', methods=['DELETE'])
@app.route('/pages', methods=['POST'])
@app.route('/pages/<int:page_id>', methods=['GET', 'PUT', 'DELETE'])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)