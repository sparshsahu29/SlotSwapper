import os
from app import create_app, db
import requests
from flask import jsonify
import threading

app = create_app()
FASTAPI_HEALTH_URL = "https://slotswapper-xkwm.onrender.com/health"

def fire_and_forget_ping():
    """Runs inside a background thread so it never blocks Gunicorn."""
    try:
        print("[Waker] Sending background ping to FastAPI...")
        # A generous timeout is now perfectly fine because it's non-blocking
        response = requests.get(FASTAPI_HEALTH_URL, timeout=60)
        print(f"[Waker] FastAPI response received: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[Waker] Background ping encountered an expected cold-start delay or error: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    """
    Hit by Uptime Robot. Instantly returns 200 OK to stay alive,
    while spinning up a thread to wake up FastAPI.
    """
    # Start the ping process in a separate background thread
    threading.Thread(target=fire_and_forget_ping, daemon=True).start()
    
    # Instantly return a success status code to Uptime Robot and Gunicorn
    return jsonify({
        "waker_status": "alive",
        "background_ping": "triggered"
    }), 200

@app.route('/')
def home():
    return "Simple Non-Blocking Waker is Active."

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Generates structural targets cleanly on load
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True)