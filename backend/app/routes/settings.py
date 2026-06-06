from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import json
import os

router = APIRouter(prefix="/api/settings", tags=["settings"])

# Use a simple JSON file for settings storage (works without database)
SETTINGS_FILE = "settings.json"

class SettingsUpdate(BaseModel):
    theme: str = "dark"
    voice_speed: float = 0.85
    voice_volume: float = 1.0
    voice_pitch: float = 1.0
    auto_scroll: bool = True
    realtime_updates: bool = True
    api_url: str = "http://localhost:8000"
    notifications_enabled: bool = True

def load_settings_from_file():
    """Load settings from JSON file"""
    try:
        if os.path.exists(SETTINGS_FILE):
            with open(SETTINGS_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading settings: {e}")
    
    # Default settings
    return {
        "theme": "dark",
        "voice_speed": 0.85,
        "voice_volume": 1.0,
        "voice_pitch": 1.0,
        "auto_scroll": True,
        "realtime_updates": True,
        "api_url": "http://localhost:8000",
        "notifications_enabled": True
    }

def save_settings_to_file(settings):
    """Save settings to JSON file"""
    try:
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(settings, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving settings: {e}")
        return False

@router.get("/")
async def get_settings():
    """Get user settings"""
    try:
        settings = load_settings_from_file()
        return settings
    except Exception as e:
        print(f"Error in get_settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def update_settings(settings_data: SettingsUpdate):
    """Update user settings"""
    try:
        settings = {
            "theme": settings_data.theme,
            "voice_speed": settings_data.voice_speed,
            "voice_volume": settings_data.voice_volume,
            "voice_pitch": settings_data.voice_pitch,
            "auto_scroll": settings_data.auto_scroll,
            "realtime_updates": settings_data.realtime_updates,
            "api_url": settings_data.api_url,
            "notifications_enabled": settings_data.notifications_enabled,
            "updated_at": datetime.now().isoformat()
        }
        
        if save_settings_to_file(settings):
            return {"message": "Settings saved successfully", "settings": settings}
        else:
            raise HTTPException(status_code=500, detail="Failed to save settings")
    except Exception as e:
        print(f"Error in update_settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))