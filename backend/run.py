#!/usr/bin/env python
"""
ParliTech Backend Server Launcher
"""

import uvicorn
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import Config

if __name__ == "__main__":
    print("=" * 60)
    print("PARLITECH - Multi-Agent Parliamentary Debate System")
    print("=" * 60)
    
    print(f"\nServer Configuration:")
    print(f"   - Host: {Config.HOST}")
    print(f"   - Port: {Config.PORT}")
    print(f"   - LLM Available: {Config.HAS_LLM}")
    
    try:
        from app.agents.debate_agents import ALL_AGENTS
        print(f"\nAvailable Agents ({len(ALL_AGENTS)}):")
        for agent in ALL_AGENTS[:5]:
            print(f"   - {agent.role}: {agent.name} ({agent.party})")
        print(f"   ... and {len(ALL_AGENTS) - 5} more")
    except Exception as e:
        print(f"\nCould not load agents: {e}")
    
    print("\nStarting server...")
    print(f"API Docs: http://{Config.HOST}:{Config.PORT}/docs")
    print(f"Health Check: http://{Config.HOST}:{Config.PORT}/health")
    print("\nPress Ctrl+C to stop\n")
    
    uvicorn.run(
        "app.main:app",
        host=Config.HOST,
        port=Config.PORT,
        reload=True,
        log_level="info"
    )