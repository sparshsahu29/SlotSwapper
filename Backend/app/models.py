import enum
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class SlotStatus(enum.Enum):
    BUSY = 'BUSY'
    SWAPPABLE = 'SWAPPABLE'
    SWAP_PENDING = 'SWAP_PENDING'

class RequestStatus(enum.Enum):
    PENDING = 'PENDING'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    start_time = db.Column(db.DateTime(timezone=True), nullable=False)
    end_time = db.Column(db.DateTime(timezone=True), nullable=False)
    status = db.Column(db.Enum(SlotStatus), default=SlotStatus.BUSY, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', backref=db.backref('events', cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id, "title": self.title,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(), "status": self.status.value
        }

class SwapRequest(db.Model):
    __tablename__ = 'swap_requests'
    __table_args__ = (db.UniqueConstraint('requester_slot_id', 'responder_slot_id', name='unique_active_proposals'),)
    
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    responder_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    requester_slot_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False)
    responder_slot_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.Enum(RequestStatus), default=RequestStatus.PENDING, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))