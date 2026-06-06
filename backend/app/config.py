import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration"""
    
    # Free LLM APIs (get from websites)
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./parlitech.db")
    
    # Server
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key-change-me")
    
    # Check if at least one API key is available
    HAS_LLM = bool(GROQ_API_KEY or GEMINI_API_KEY)
    
    @classmethod
    def print_status(cls):
        """Print configuration status"""
        print(f"✅ LLM Available: {cls.HAS_LLM}")
        if cls.GROQ_API_KEY:
            print(f"   - Groq API: Configured (14,400 req/day FREE)")
        if cls.GEMINI_API_KEY:
            print(f"   - Gemini API: Configured (1,500 req/day FREE)")
        if not cls.HAS_LLM:
            print(f"   - ⚠️ No API keys found. Using fallback responses.")