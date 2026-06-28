import os
from app import create_app, db
import requests
from flask import jsonify

app = create_app()
FASTAPI_HEALTH_URL = "https://slotswapper-xkwm.onrender.com/health"

@app.route('/health', methods=['GET'])
def health_check():
    """
    Hit by Uptime Robot. Pings FastAPI immediately to keep it awake too.
    """
    fastapi_status = "unknown"
    
    try:
        # Ping your FastAPI backend (timeout set long enough for Render to cold-start if needed)
        response = requests.get(FASTAPI_HEALTH_URL, timeout=45)
        if response.status_code == 200:
            fastapi_status = "online"
        else:
            fastapi_status = f"error_code_{response.status_code}"
    except requests.exceptions.RequestException as e:
        fastapi_status = f"failed_to_reach: {str(e)}"

    # Respond back to Uptime Robot
    return jsonify({
        "waker_status": "alive",
        "target_fastapi_status": fastapi_status
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Generates structural targets cleanly on load
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True)