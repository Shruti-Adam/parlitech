from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    theme = Column(String, default="dark")
    voice_speed = Column(Float, default=0.85)
    voice_volume = Column(Float, default=1.0)
    voice_pitch = Column(Float, default=1.0)
    auto_scroll = Column(Boolean, default=True)
    realtime_updates = Column(Boolean, default=True)
    api_url = Column(String, default="http://localhost:8000")
    notifications_enabled = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class BillDocument(Base):
    __tablename__ = "bill_documents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(500))
    filename = Column(String(500))
    content = Column(Text)
    summary = Column(Text)
    key_points = Column(JSON)
    advantages = Column(JSON)
    disadvantages = Column(JSON)
    economic_impact = Column(Text)
    social_impact = Column(Text)
    ai_recommendation = Column(Text)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class DebateSession(Base):
    __tablename__ = "debate_sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    topic = Column(String(500))
    bill_id = Column(String, nullable=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String(20), default="active")
    winner = Column(String(100), nullable=True)
    winner_reason = Column(Text, nullable=True)
    winner_influence = Column(Float, nullable=True)
    public_support = Column(Float, default=0.5)