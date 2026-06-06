from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

from app.config import Config
from app.services.llm_service import LLMService
from app.services.debate_service import DebateOrchestrator
from app.agents.debate_agents import ALL_AGENTS, AGENTS_BY_ROLE

# ============ IMPORT THE ROUTERS ============
from app.routes import settings, reports

# Initialize FastAPI
app = FastAPI(
    title="ParliTech - Multi-Agent Parliamentary Debate System",
    description="Lok Sabha debate simulation with 15 AI agents and 245 MPs",
    version="1.0.0"
)

# CORS for frontend
# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://parlitech-frontend-b3ei.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
llm_service = LLMService()
debate_orchestrator = DebateOrchestrator()

# ============ REGISTER THE ROUTERS ============
app.include_router(settings.router)
app.include_router(reports.router)

# ============ Request/Response Models ============

class DebateStartRequest(BaseModel):
    topic: str
    simulate_real_time: bool = True

class AgentResponse(BaseModel):
    id: str
    name: str
    role: str
    party: str
    ideology: str
    influence_score: int
    color: str

class AgentsListResponse(BaseModel):
    agents: List[Dict]
    total: int

class HealthResponse(BaseModel):
    status: str
    llm_service: str
    timestamp: str

# ============ API Routes ============

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "ParliTech Parliamentary Debate System",
        "version": "1.0.0",
        "status": "running",
        "agents": len(ALL_AGENTS),
        "llm_available": Config.HAS_LLM,
        "endpoints": {
            "docs": "/docs",
            "agents": "/api/agents",
            "debate": "/api/debate/start",
            "settings": "/api/settings",
            "reports": "/api/reports",
            "health": "/health"
        }
    }

@app.get("/api/agents", response_model=AgentsListResponse)
async def get_agents():
    """Get all 15 debate agents with their details"""
    agents_list = []
    for agent in ALL_AGENTS:
        agents_list.append({
            "id": agent.id,
            "name": agent.name,
            "role": agent.role,
            "party": agent.party,
            "ideology": agent.ideology,
            "influence_score": agent.influence_score,
            "voting_tendency": agent.voting_tendency,
            "color": agent.color,
            "speaking_count": agent.speaking_count
        })
    
    return {
        "agents": agents_list,
        "total": len(agents_list)
    }

@app.get("/api/agents/{role}")
async def get_agent_by_role(role: str):
    """Get specific agent by their role"""
    from urllib.parse import unquote
    role_decoded = unquote(role)
    
    for agent in ALL_AGENTS:
        if agent.role.lower() == role_decoded.lower():
            return {
                "id": agent.id,
                "name": agent.name,
                "role": agent.role,
                "party": agent.party,
                "ideology": agent.ideology,
                "constituency": agent.constituency,
                "influence_score": agent.influence_score,
                "voting_tendency": agent.voting_tendency,
                "color": agent.color
            }
    
    raise HTTPException(status_code=404, detail=f"Agent with role '{role}' not found")

# ============ MAIN DEBATE ENDPOINT ============
@app.post("/api/debate/start")
async def start_full_debate(request: DebateStartRequest):
    """Start a complete parliamentary debate with all 15 agents and 245 MP voting"""
    
    print(f"\n{'='*50}")
    print(f"NEW DEBATE STARTED")
    print(f"Topic: {request.topic}")
    print(f"{'='*50}\n")
    
    # Run the debate
    result = await debate_orchestrator.start_debate(request.topic)
    
    # Store in active debates
    debate_id = f"debate_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    result["debate_id"] = debate_id
    
    return result

@app.get("/api/debate/status")
async def get_debate_status():
    """Get current debate status"""
    return {
        "has_active_debate": len(debate_orchestrator.debate_state["speeches"]) > 0,
        "speeches_count": len(debate_orchestrator.debate_state["speeches"]),
        "topic": debate_orchestrator.debate_state["topic"],
        "public_opinion": debate_orchestrator.debate_state["public_opinion"]
    }

@app.get("/api/debate/transcript")
async def get_debate_transcript():
    """Get full debate transcript"""
    return {
        "topic": debate_orchestrator.debate_state["topic"],
        "speeches": debate_orchestrator.debate_state["speeches"],
        "total_speeches": len(debate_orchestrator.debate_state["speeches"])
    }

@app.post("/api/debate/reset")
async def reset_debate():
    """Reset debate state"""
    debate_orchestrator.debate_state = {
        "topic": "",
        "speeches": [],
        "sentiment_history": [],
        "public_opinion": 0.5,
        "current_speaker": None,
        "speech_order": 0
    }
    return {"status": "reset", "message": "Debate state cleared"}

@app.get("/api/agents/roles")
async def get_all_roles():
    """Get list of all agent roles"""
    roles = [agent.role for agent in ALL_AGENTS]
    return {
        "roles": roles,
        "count": len(roles)
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "llm_service": "available" if Config.HAS_LLM else "fallback_mode",
        "timestamp": datetime.now().isoformat()
    }