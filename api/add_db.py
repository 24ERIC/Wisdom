from api import app, db, Tag

# Create an application context
with app.app_context():
    # Create the parent tag
    parent_tag = Tag(name='Finance')
    db.session.add(parent_tag)
    db.session.commit()

    # Create child tags
    child_tag1 = Tag(name='Money', parent_id=parent_tag.id)
    child_tag2 = Tag(name='Child', parent_id=parent_tag.id)
    db.session.add_all([child_tag1, child_tag2])
    db.session.commit()

    print("Tags added successfully.")
