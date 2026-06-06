# Database models for Parliament
from app.models.parliament_models import DebateSession, Speech, Vote, get_db

__all__ = ['DebateSession', 'Speech', 'Vote', 'get_db']