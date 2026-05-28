from flask import Blueprint, request, jsonify
from app.models import db, Event, SlotStatus
from app.middleware import token_required
from datetime import datetime

events_bp = Blueprint('events', __name__, url_prefix='/api/events')

@events_bp.route('', methods=['GET'])
@token_required
def get_events(current_user_id):
    events = Event.query.filter_by(user_id=current_user_id).order_by(Event.start_time.asc()).all()
    return jsonify([e.to_dict() for e in events]), 200

@events_bp.route('', methods=['POST'])
@token_required
def create_event(current_user_id):
    data = request.get_json() or {}
    try:
        start_dt = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
    except (KeyError, ValueError):
        return jsonify({'message': 'Invalid or missing ISO timestamps'}), 400

    new_event = Event(
        user_id=current_user_id, title=data.get('title'),
        start_time=start_dt, end_time=end_dt, status=SlotStatus[data.get('status', 'BUSY')]
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.to_dict()), 201

@events_bp.route('/<int:event_id>/status', methods=['PATCH'])
@token_required
def update_event_status(current_user_id, event_id):
    data = request.get_json() or {}
    event = Event.query.filter_by(id=event_id, user_id=current_user_id).first()
    if not event:
        return jsonify({'message': 'Event not found or unauthorized'}), 404
    try:
        event.status = SlotStatus[data.get('status')]
        db.session.commit()
    except KeyError:
        return jsonify({'message': 'Invalid status'}), 400
    return jsonify(event.to_dict()), 200

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user_id, event_id):
    event = Event.query.filter_by(id=event_id, user_id=current_user_id).first()
    if not event:
        return jsonify({'message': 'Event not found or unauthorized'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event cancelled successfully'}), 200