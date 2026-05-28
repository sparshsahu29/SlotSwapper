import os
from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Generates structural targets cleanly on load
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True)