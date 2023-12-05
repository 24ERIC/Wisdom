from api import app, db  # Import Flask app and db instance

with app.app_context():
    db.create_all()