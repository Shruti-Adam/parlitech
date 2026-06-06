"""
Database models for storing debate sessions, speeches, and votes
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid
import os

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./parlitech.db")

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class DebateSession(Base):
    """Stores each debate session"""
    __tablename__ = "debate_sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    topic = Column(String(500), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String(20), default="active")  # active, completed
    public_opinion = Column(Float, default=0.5)  # 0-1 scale
    final_outcome = Column(String(20), nullable=True)  # passed, rejected
    
    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "status": self.status,
            "public_opinion": self.public_opinion,
            "final_outcome": self.final_outcome
        }

class Speech(Base):
    """Stores each speech in a debate"""
    __tablename__ = "speeches"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    debate_id = Column(String, nullable=False)
    agent_id = Column(String, nullable=False)
    agent_name = Column(String(100))
    agent_role = Column(String(100))
    speech_text = Column(Text)
    sentiment_score = Column(Float, default=0.0)
    speech_order = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "debate_id": self.debate_id,
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "agent_role": self.agent_role,
            "speech_text": self.speech_text,
            "sentiment_score": self.sentiment_score,
            "speech_order": self.speech_order,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

class Vote(Base):
    """Stores voting results"""
    __tablename__ = "votes"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    debate_id = Column(String, nullable=False)
    votes_for = Column(Integer, default=0)
    votes_against = Column(Integer, default=0)
    votes_abstain = Column(Integer, default=0)
    party_breakdown = Column(JSON)  # Store JSON of party-wise votes
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "debate_id": self.debate_id,
            "votes_for": self.votes_for,
            "votes_against": self.votes_against,
            "votes_abstain": self.votes_abstain,
            "party_breakdown": self.party_breakdown,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

# Initialize database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()