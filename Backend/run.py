import os
from app import create_app, db

from flask import jsonify

app = create_app()

@app.route('/health', methods=['GET'])
def health_check():
    """
    A simple endpoint for Uptime Robot to ping.
    Returns a 200 OK instantly.
    """
    return jsonify({"status": "healthy"}), 200

@app.route('/')
def home():
    return "Waker App is running."



if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Generates structural targets cleanly on load
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True)