from flask import Flask, request
from flask_cors import CORS
from flask_sock import Sock
import jwt
import json
from app.config import Config
from app.models import db

sock = Sock()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    sock.init_app(app)

    # Register Blueprint Modules
    from app.routes.auth import auth_bp
    from app.routes.events import events_bp
    from app.routes.swaps import swaps_bp, connected_clients
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(swaps_bp)

    # Isolated clean implementation of generic standard standalone WebSocket routes
    @sock.route('/ws')
    def ws_connect(ws):
        token = request.args.get('token')
        if not token:
            ws.send(json.dumps({"error": "Missing Token"}))
            ws.close()
            return
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = data['user_id']
            connected_clients[user_id] = ws
        except Exception:
            ws.send(json.dumps({"error": "Invalid Token"}))
            ws.close()
            return

        try:
            while True:
                msg = ws.receive()
                if msg is None: break
        except Exception:
            pass
        finally:
            if user_id in connected_clients and connected_clients[user_id] == ws:
                del connected_clients[user_id]

    return app