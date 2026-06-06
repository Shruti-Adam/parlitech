"""
15 AI Debate Agents for Indian Lok Sabha
Each agent has unique identity, ideology, party, and influence score
"""

from app.agents.base_agent import DebateAgent

def create_all_agents() -> list:
    """Create all 15 Lok Sabha debate agents"""
    
    agents = [
        # 1. Prime Minister
        DebateAgent(
            agent_id="pm_001",
            name="Narendra Modi",
            role="Prime Minister",
            party="BJP",
            ideology="Right",
            constituency="Varanasi",
            influence_score=95
        ),
        
        # 2. Speaker of the House
        DebateAgent(
            agent_id="speaker_001",
            name="Om Birla",
            role="Speaker of the House",
            party="BJP",
            ideology="Neutral",
            constituency="Kota",
            influence_score=85
        ),
        
        # 3. Opposition Leader
        DebateAgent(
            agent_id="opp_001",
            name="Rahul Gandhi",
            role="Opposition Leader",
            party="INC",
            ideology="Center-Left",
            constituency="Wayanad",
            influence_score=88
        ),
        
        # 4. Finance Minister
        DebateAgent(
            agent_id="fin_001",
            name="Nirmala Sitharaman",
            role="Finance Minister",
            party="BJP",
            ideology="Right",
            constituency="Rajya Sabha",
            influence_score=90
        ),
        
        # 5. Education Minister
        DebateAgent(
            agent_id="edu_001",
            name="Dharmendra Pradhan",
            role="Education Minister",
            party="BJP",
            ideology="Right",
            constituency="Sambalpur",
            influence_score=75
        ),
        
        # 6. Health Minister
        DebateAgent(
            agent_id="health_001",
            name="Mansukh Mandaviya",
            role="Health Minister",
            party="BJP",
            ideology="Right",
            constituency="Rajya Sabha",
            influence_score=78
        ),
        
        # 7. Agriculture Minister
        DebateAgent(
            agent_id="agri_001",
            name="Narendra Tomar",
            role="Agriculture Minister",
            party="BJP",
            ideology="Right",
            constituency="Morena",
            influence_score=80
        ),
        
        # 8. Progressive MP
        DebateAgent(
            agent_id="prog_001",
            name="Shashi Tharoor",
            role="Progressive MP",
            party="INC",
            ideology="Left",
            constituency="Thiruvananthapuram",
            influence_score=82
        ),
        
        # 9. Conservative MP
        DebateAgent(
            agent_id="cons_001",
            name="Anurag Thakur",
            role="Conservative MP",
            party="BJP",
            ideology="Right",
            constituency="Hamirpur",
            influence_score=76
        ),
        
        # 10. Neutral MP
        DebateAgent(
            agent_id="neut_001",
            name="N K Premachandran",
            role="Neutral MP",
            party="RSP",
            ideology="Centrist",
            constituency="Kollam",
            influence_score=70
        ),
        
        # 11. Regional Party Leader
        DebateAgent(
            agent_id="region_001",
            name="Mamata Banerjee",
            role="Regional Party Leader",
            party="TMC",
            ideology="Regional",
            constituency="Bhowanipore",
            influence_score=85
        ),
        
        # 12. Independent MP
        DebateAgent(
            agent_id="ind_001",
            name="Kapil Sibal",
            role="Independent MP",
            party="Independent",
            ideology="Centrist",
            constituency="Rajya Sabha",
            influence_score=78
        ),
        
        # 13. Women's Representative
        DebateAgent(
            agent_id="women_001",
            name="Supriya Sule",
            role="Women's Representative",
            party="NCP",
            ideology="Center-Left",
            constituency="Baramati",
            influence_score=74
        ),
        
        # 14. Youth Representative
        DebateAgent(
            agent_id="youth_001",
            name="Tejasvi Surya",
            role="Youth Representative",
            party="BJP",
            ideology="Right",
            constituency="Bangalore South",
            influence_score=72
        ),
        
        # 15. Economic Policy Expert
        DebateAgent(
            agent_id="eco_001",
            name="Arvind Subramanian",
            role="Economic Policy Expert",
            party="Independent",
            ideology="Centrist",
            constituency="Rajya Sabha",
            influence_score=88
        ),
    ]
    
    # Set voting tendencies based on ideology
    for agent in agents:
        if agent.ideology == "Right":
            agent.voting_tendency = "for"
        elif agent.ideology == "Left":
            agent.voting_tendency = "against"
        elif agent.ideology == "Regional":
            agent.voting_tendency = "abstain"
        else:  # Centrist, Neutral
            agent.voting_tendency = "abstain"
    
    return agents

# ============ IMPORTANT: These lines create the global variables ============
ALL_AGENTS = create_all_agents()
AGENTS_BY_ROLE = {agent.role: agent for agent in ALL_AGENTS}
AGENTS_BY_NAME = {agent.name: agent for agent in ALL_AGENTS}