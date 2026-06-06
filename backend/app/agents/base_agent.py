"""
Base Agent Class for Parliamentary Debate
All 15 agents inherit from this class
"""

from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel

class AgentMemory(BaseModel):
    """Stores agent's memory of previous arguments"""
    speech_id: str
    topic: str
    content: str
    timestamp: datetime
    reaction_to: Optional[str] = None

class DebateAgent:
    """Base class for parliamentary debate agents"""
    
    def __init__(
        self, 
        agent_id: str,
        name: str, 
        role: str, 
        party: str, 
        ideology: str,
        constituency: Optional[str] = None,
        influence_score: int = 50
    ):
        self.id = agent_id
        self.name = name
        self.role = role
        self.party = party
        self.ideology = ideology  # Left, Right, Centrist, Regional
        self.constituency = constituency
        self.influence_score = influence_score  # 0-100
        self.voting_tendency = "neutral"  # for, against, abstain
        self.memory: List[AgentMemory] = []
        self.speaking_count = 0
        
        # Party colors for visualization
        self.party_colors = {
            "BJP": "#FF9933",      # Saffron
            "INC": "#0066FF",      # Blue
            "DMK": "#FF0000",      # Red
            "TMC": "#00FF00",      # Green
            "AAP": "#00CC66",      # Light Green
            "NCP": "#FF6600",      # Orange
            "RSP": "#800080",      # Purple
            "Independent": "#808080",  # Grey
        }
        self.color = self.party_colors.get(party, "#6366f1")
    
    def get_persona_prompt(self) -> str:
        """Generate agent persona for LLM context"""
        persona = f"""
You are {self.name}, the {self.role} in the Indian Lok Sabha.
Party: {self.party}
Ideology: {self.ideology}
Influence Score: {self.influence_score}/100

Key characteristics:
"""
        
        # Role-specific characteristics
        if self.role == "Prime Minister":
            persona += "- Assertive and commanding leader of the nation\n- Focuses on national development and security\n- Represents the ruling government's vision\n"
        elif self.role == "Speaker of the House":
            persona += "- Neutral and procedural authority\n- Ensures orderly conduct of debates\n- Does not take sides in political arguments\n"
        elif self.role == "Opposition Leader":
            persona += "- Holds government accountable\n- Represents alternative vision for the country\n- Scrutinizes every government proposal\n"
        elif self.role == "Finance Minister":
            persona += "- Data-driven and analytical\n- Focuses on economic impact and fiscal responsibility\n- Presents budget and economic policies\n"
        elif "Minister" in self.role:
            persona += f"- Expert in {self.role.replace('Minister', '').strip()} sector\n- Balances departmental needs with national priorities\n"
        elif "Representative" in self.role:
            persona += f"- Advocates for {self.role.replace('MP', '').strip()} rights\n- Brings grassroots perspectives to parliament\n- Focuses on inclusive policies\n"
        else:
            persona += "- Brings unique perspective to debates\n- Represents specific constituency interests\n"
        
        persona += """
Speaking style: Formal parliamentary language. Address as "Honorable Speaker" and "Respected colleagues".
Remember previous arguments from your memory when reacting to them.
"""
        return persona
    
    def to_dict(self) -> dict:
        """Convert agent to JSON-serializable dict"""
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "party": self.party,
            "ideology": self.ideology,
            "constituency": self.constituency,
            "influence_score": self.influence_score,
            "voting_tendency": self.voting_tendency,
            "color": self.color,
            "speaking_count": self.speaking_count
        }
    
    def update_memory(self, speech_id: str, topic: str, content: str, reaction_to: str = None):
        """Add a speech to agent's memory"""
        self.memory.append(AgentMemory(
            speech_id=speech_id,
            topic=topic,
            content=content[:200],  # Store first 200 chars
            timestamp=datetime.utcnow(),
            reaction_to=reaction_to
        ))
        
        # Keep only last 10 memories to prevent overflow
        if len(self.memory) > 10:
            self.memory = self.memory[-10:]