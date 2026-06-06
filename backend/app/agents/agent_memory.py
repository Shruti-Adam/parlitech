"""
Memory management for agents
Stores and retrieves previous arguments
"""

from typing import List, Dict, Optional
from datetime import datetime
import json

class AgentMemoryManager:
    """Manages memory for a single agent"""
    
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.memories = []  # List of memory entries
    
    def add_memory(self, memory: Dict):
        """Add a new memory entry"""
        memory["timestamp"] = datetime.now().isoformat()
        self.memories.append(memory)
        
        # Keep only recent 20 memories
        if len(self.memories) > 20:
            self.memories = self.memories[-20:]
    
    def get_recent_memories(self, count: int = 5) -> List[Dict]:
        """Get most recent memories"""
        return self.memories[-count:] if self.memories else []
    
    def get_memories_by_topic(self, topic: str) -> List[Dict]:
        """Get memories related to a specific topic"""
        return [m for m in self.memories if topic.lower() in m.get("topic", "").lower()]
    
    def clear(self):
        """Clear all memories"""
        self.memories = []


# Global memory store
AGENT_MEMORIES = {}

def get_agent_memory(agent_id: str) -> AgentMemoryManager:
    """Get or create memory manager for an agent"""
    if agent_id not in AGENT_MEMORIES:
        AGENT_MEMORIES[agent_id] = AgentMemoryManager(agent_id)
    return AGENT_MEMORIES[agent_id]