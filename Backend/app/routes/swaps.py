from flask import Blueprint, request, jsonify, current_app
from app.models import db, Event, User, SwapRequest, SlotStatus, RequestStatus
from app.middleware import token_required
import json

swaps_bp = Blueprint('swaps', __name__, url_prefix='/api')
connected_clients = {}  # Direct references can be stored at runtime globally or managed by room IDs

def get_sockets_registry():
    """Fetches global instance mapping established via application context."""
    return connected_clients

@swaps_bp.route('/swap-requests/outgoing', methods=['GET'])
@token_required
def get_outgoing_swap_requests(current_user_id):
    outgoing_requests = SwapRequest.query.filter_by(
        requester_id=current_user_id,
        status=RequestStatus.PENDING
    ).all()
    
    payload = []
    for req in outgoing_requests:
        from app.models import Event, User
        my_offered_slot = Event.query.get(req.requester_slot_id)
        their_target_slot = Event.query.get(req.responder_slot_id)
        
        # Safely get the person receiving it
        receiver = User.query.get(req.responder_id)
        receiver_name = receiver.name if receiver else "Unknown User"
        
        payload.append({
            "id": req.id,
            "status": "PENDING", 
            "receiver_name": receiver_name,
            "responder_name": receiver_name,
            "my_slot": my_offered_slot.to_dict() if my_offered_slot else None,
            "offered_slot": my_offered_slot.to_dict() if my_offered_slot else None,
            "their_slot": their_target_slot.to_dict() if their_target_slot else None,
            "target_slot": their_target_slot.to_dict() if their_target_slot else None,
            "created_at": req.created_at.isoformat() + 'Z'
        })
        
    return jsonify(payload), 200


@swaps_bp.route('/swap-requests/incoming', methods=['GET'])
@token_required
def get_incoming_swap_requests(current_user_id):
    incoming_requests = SwapRequest.query.filter_by(
        responder_id=current_user_id,
        status=RequestStatus.PENDING
    ).all()
    
    payload = []
    for req in incoming_requests:
        from app.models import Event, User
        my_target_slot = Event.query.get(req.responder_slot_id)
        their_offered_slot = Event.query.get(req.requester_slot_id)
        
        # Safely get the person who sent it
        requester = User.query.get(req.requester_id)
        requester_name = requester.name if requester else "Unknown User"
        
        payload.append({
            "id": req.id,
            "status": "PENDING",  # CRITICAL: Frontend needs this to render the card!
            "sender_name": requester_name,
            "requester_name": requester_name,
            "my_slot": my_target_slot.to_dict() if my_target_slot else None,
            "target_slot": my_target_slot.to_dict() if my_target_slot else None,
            "their_slot": their_offered_slot.to_dict() if their_offered_slot else None,
            "offered_slot": their_offered_slot.to_dict() if their_offered_slot else None,
            "created_at": req.created_at.isoformat() + 'Z'
        })
        
    return jsonify(payload), 200

@swaps_bp.route('/swappable-slots', methods=['GET'])
@token_required
def get_swappable_slots(current_user_id):
    slots = Event.query.filter(Event.status == SlotStatus.SWAPPABLE, Event.user_id != current_user_id).all()
    payload = [{
        "id": s.id, "owner_name": s.user.name, "title": s.title,
        "start_time": s.start_time.isoformat() + 'Z', "end_time": s.end_time.isoformat() + 'Z',
        "status": s.status.value
    } for s in slots]
    return jsonify(payload), 200

@swaps_bp.route('/swap-request', methods=['POST'])
@token_required
def create_swap_request(current_user_id):
    data = request.get_json() or {}
    my_slot_id, their_slot_id = data.get('my_slot_id'), data.get('their_slot_id')
    
    their_slot = Event.query.get(their_slot_id)
    my_slot = Event.query.filter_by(id=my_slot_id, user_id=current_user_id).first()
    if not their_slot or not my_slot:
        return jsonify({'message': 'Slots context invalid'}), 404
        
    new_request = SwapRequest(
        requester_id=current_user_id, responder_id=their_slot.user_id,
        requester_slot_id=my_slot_id, responder_slot_id=their_slot_id
    )
    my_slot.status = SlotStatus.SWAP_PENDING
    db.session.add(new_request)
    db.session.commit()
    
    # Real-time WebSocket dispatch handler
    sockets = get_sockets_registry()
    if their_slot.user_id in sockets:
        sender = User.query.get(current_user_id)
        try:
            sockets[their_slot.user_id].send(json.dumps({
                "type": "NEW_SWAP_REQUEST", "sender_name": sender.name, "request_id": new_request.id
            }))
        except Exception:
            del sockets[their_slot.user_id]

    return jsonify({'message': 'Request sent', 'request_id': new_request.id}), 201

@swaps_bp.route('/swap-response/<int:request_id>', methods=['POST'])
@token_required
def handle_swap_response(current_user_id, request_id):
    data = request.get_json() or {}
    accepted = data.get('accepted', False)
    swap_req = SwapRequest.query.filter_by(id=request_id, responder_id=current_user_id).first()
    if not swap_req:
        return jsonify({'message': 'Not found'}), 404
        
    requester_slot = Event.query.get(swap_req.requester_slot_id)
    responder_slot = Event.query.get(swap_req.responder_slot_id)
    
    try:
        if accepted:
            swap_req.status = RequestStatus.ACCEPTED
            requester_slot.user_id, responder_slot.user_id = current_user_id, swap_req.requester_id
            requester_slot.status, responder_slot.status = SlotStatus.BUSY, SlotStatus.BUSY
            
            # Conflict pruning logic
            conflicts = SwapRequest.query.filter(
                SwapRequest.id != request_id,
                (SwapRequest.requester_slot_id.in_([requester_slot.id, responder_slot.id])) |
                (SwapRequest.responder_slot_id.in_([requester_slot.id, responder_slot.id]))
            ).all()
            for req in conflicts:
                req.status = RequestStatus.REJECTED
            ws_type = "SWAP_ACCEPTED"
        else:
            swap_req.status = RequestStatus.REJECTED
            requester_slot.status, responder_slot.status = SlotStatus.SWAPPABLE, SlotStatus.SWAPPABLE
            ws_type = "SWAP_REJECTED"
            
        db.session.commit()
        
        sockets = get_sockets_registry()
        if swap_req.requester_id in sockets:
            try:
                sockets[swap_req.requester_id].send(json.dumps({
                    "type": ws_type, "event_title": responder_slot.title
                }))
            except Exception:
                del sockets[swap_req.requester_id]
                
        return jsonify({'message': 'Response processed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Transaction aborted', 'error': str(e)}), 500