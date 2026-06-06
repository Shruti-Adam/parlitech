"""
Complete Debate Orchestrator with 15 Agents + 245 MP Voting Simulation
No individual API calls for MPs - uses rule-based voting system
"""

import asyncio
import random
from datetime import datetime
from typing import Dict, List, Optional
from textblob import TextBlob

from app.services.llm_service import LLMService
from app.agents.debate_agents import ALL_AGENTS, AGENTS_BY_ROLE
from app.models.parliament_models import DebateSession, Speech, Vote, get_db

class DebateOrchestrator:
    """Manages complete parliamentary debate with 15 agents and 245 MPs"""
    
    def __init__(self):
        self.llm = LLMService()
        self.current_debate = None
        self.debate_state = {
            "topic": "",
            "speeches": [],
            "sentiment_history": [],
            "public_opinion": 0.5,
            "current_speaker": None,
            "speech_order": 0
        }
    
    async def start_debate(self, topic: str) -> Dict:
        """Start full parliamentary debate on given bill/policy"""
        
        print(f"\n🎤 Starting debate on: {topic}")
        
        # Reset debate state
        self.debate_state = {
            "topic": topic,
            "speeches": [],
            "sentiment_history": [],
            "public_opinion": 0.5,
            "current_speaker": None,
            "speech_order": 0
        }
        
        # Clear agent memories for new debate
        for agent in ALL_AGENTS:
            agent.memory = []
            agent.speaking_count = 0
        
        # 1. Speaker opens the house
        speaker = AGENTS_BY_ROLE["Speaker of the House"]
        opening = await self._generate_speech(
            speaker, topic, "opening",
            "The house is now in session. Honorable members, we are here to discuss:"
        )
        
        # 2. Prime Minister presents government stance
        pm = AGENTS_BY_ROLE["Prime Minister"]
        pm_speech = await self._generate_speech(
            pm, topic, "government_stance",
            f"As Prime Minister, I present the government's position on: {topic}"
        )
        
        # 3. Opposition Leader responds
        opp = AGENTS_BY_ROLE["Opposition Leader"]
        opp_speech = await self._generate_speech(
            opp, topic, "opposition_response",
            f"The opposition stands to scrutinize this bill. Respected Speaker,"
        )
        
        # 4. Get all other agents (excluding Speaker, PM, Opposition)
        remaining_agents = [a for a in ALL_AGENTS if a.role not in 
                           ["Speaker of the House", "Prime Minister", "Opposition Leader"]]
        
        # Shuffle remaining agents for natural order (except specific roles have priority)
        # Finance Minister speaks early, others randomized
        priority_roles = ["Finance Minister", "Economic Policy Expert"]
        priority_agents = [a for a in remaining_agents if a.role in priority_roles]
        other_agents = [a for a in remaining_agents if a.role not in priority_roles]
        
        # Randomize other agents but keep priority agents first
        random.shuffle(other_agents)
        ordered_agents = priority_agents + other_agents
        
        # Generate speeches for all agents
        all_speeches = [opening, pm_speech, opp_speech]
        
        for agent in ordered_agents:
            # Agents can react to previous speeches
            previous = all_speeches[-1] if all_speeches else None
            speech = await self._generate_speech(
                agent, topic, "debate",
                previous_speech=previous
            )
            all_speeches.append(speech)
            agent.speaking_count += 1
            
            # Update public opinion based on speech sentiment
            self._update_public_opinion(speech)
            
            # Small delay to simulate real debate
            await asyncio.sleep(0.5)
        
        # Store all speeches
        self.debate_state["speeches"] = all_speeches
        self.debate_state["topic"] = topic
        
        # 5. Simulate 245 MP voting (NO INDIVIDUAL API CALLS)
        voting_results = await self.simulate_245_mp_voting()
        
        # 6. Calculate final sentiment analysis
        sentiment_analysis = self._analyze_debate_sentiment()
        
        return {
            "topic": topic,
            "speeches": all_speeches,
            "voting_results": voting_results,
            "public_opinion": self.debate_state["public_opinion"],
            "sentiment_history": self.debate_state["sentiment_history"],
            "sentiment_analysis": sentiment_analysis,
            "agent_participation": self._get_agent_participation_scores()
        }
    
    async def _generate_speech(self, agent, topic: str, speech_type: str, 
                                opening_line: str = None, previous_speech: Dict = None) -> Dict:
        """Generate a speech for an agent using LLM or fallback"""
        
        # Build context from agent's memory
        memory_context = ""
        if agent.memory:
            recent = agent.memory[-3:]
            memory_context = "\n".join([f"Previously you argued: {m.content[:150]}..." 
                                        for m in recent])
        
        # Build reaction to previous speaker
        reaction = ""
        if previous_speech and previous_speech.get("agent_name") != agent.name:
            reaction = f"""
Previous speaker ({previous_speech.get('agent_name', 'Unknown')}, {previous_speech.get('agent_role', 'MP')}) said:
"{previous_speech.get('speech_text', '')[:200]}..."

As {agent.role}, you should respond to or acknowledge their points.
"""
        
        # Build prompt
        prompt = f"""
{agent.get_persona_prompt()}

Debate Topic: {topic}
Speech Type: {speech_type}

{memory_context}

{reaction}

Generate a realistic parliamentary speech (150-200 words) that:
1. States your clear position on the topic
2. {'Supports the government bill' if agent.voting_tendency == 'for' else 'Opposes the bill' if agent.voting_tendency == 'against' else 'Takes a balanced, neutral stance'}
3. Uses formal parliamentary language (address "Honorable Speaker")
4. Includes specific policy points relevant to your role as {agent.role}

{opening_line or f"As the {agent.role}, I rise to speak on this matter."}

Remember to speak in first person as {agent.name}.
"""
        
        # Generate using LLM or fallback
        speech_text = await self.llm.generate(prompt)
        
        # Clean up speech text
        speech_text = speech_text.strip()
        
        # Analyze sentiment
        blob = TextBlob(speech_text)
        sentiment_score = blob.sentiment.polarity
        
        # Store in agent memory
        from app.agents.base_agent import AgentMemory
        agent.update_memory(
            speech_id=f"speech_{len(agent.memory)}",
            topic=topic,
            content=speech_text[:200],
            reaction_to=previous_speech.get("agent_name") if previous_speech else None
        )
        
        speech_data = {
            "agent_id": agent.id,
            "agent_name": agent.name,
            "agent_role": agent.role,
            "party": agent.party,
            "speech_text": speech_text,
            "sentiment_score": round(sentiment_score, 3),
            "speech_type": speech_type,
            "speech_order": len(self.debate_state["speeches"]),
            "timestamp": datetime.now().isoformat(),
            "influence_score": agent.influence_score,
            "voting_tendency": agent.voting_tendency
        }
        
        self.debate_state["speeches"].append(speech_data)
        self.debate_state["sentiment_history"].append(sentiment_score)
        
        print(f"   ✓ {agent.role} ({agent.name}) spoke - Sentiment: {sentiment_score:.2f}")
        
        return speech_data
    
    def _update_public_opinion(self, speech: Dict):
        """Update simulated public opinion based on speech sentiment and agent influence"""
        current = self.debate_state["public_opinion"]
        influence = speech.get("influence_score", 50) / 100
        sentiment_impact = speech.get("sentiment_score", 0) * influence * 0.15
        
        new_opinion = current + sentiment_impact
        self.debate_state["public_opinion"] = max(0, min(1, new_opinion))
    
    async def simulate_245_mp_voting(self) -> Dict:
        """
        Simulate 245 MP voting WITHOUT individual API calls.
        MPs vote based on: Party ideology, Coalition, Public Opinion, Debate Sentiment
        """
        
        # Actual seat distribution in Lok Sabha 2024
        PARTY_SEATS = {
            "BJP": 240,
            "INC": 99,
            "DMK": 24,
            "AITC": 29,
            "AAP": 3,
            "TMC": 1,
            "NCP": 5,
            "RSP": 1,
            "Others": 43  # Remaining 43 seats from various parties
        }
        
        # Coalition alignment
        NDA_PARTIES = {"BJP", "SS", "LJP", "RLP", "AD(S)", "NPP", "AGP"}
        INDIA_PARTIES = {"INC", "DMK", "AITC", "AAP", "TMC", "NCP", "RSP", "JDU", "RJD", "SP"}
        
        # Calculate debate sentiment (average of all speeches)
        debate_sentiment = sum(self.debate_state["sentiment_history"]) / len(self.debate_state["sentiment_history"]) if self.debate_state["sentiment_history"] else 0
        public_opinion = self.debate_state["public_opinion"]
        
        # Calculate votes
        votes_for = 0
        votes_against = 0
        votes_abstain = 0
        party_breakdown = {}
        
        for party, seats in PARTY_SEATS.items():
            # Base vote probability based on coalition
            if party in NDA_PARTIES:
                base_support = 0.75  # 75% support from ruling coalition
            elif party in INDIA_PARTIES:
                base_support = 0.35  # 35% support from opposition
            else:
                base_support = 0.50  # 50% from neutral parties
            
            # Adjust based on debate sentiment and public opinion
            sentiment_influence = debate_sentiment * 0.25
            public_influence = (public_opinion - 0.5) * 0.2
            
            support_probability = base_support + sentiment_influence + public_influence
            support_probability = max(0, min(1, support_probability))
            
            # Calculate votes for this party
            party_for = int(seats * support_probability)
            party_against = int(seats * (1 - support_probability) * 0.7)
            party_abstain = seats - party_for - party_against
            
            votes_for += party_for
            votes_against += party_against
            votes_abstain += party_abstain
            
            party_breakdown[party] = {
                "total_seats": seats,
                "for": party_for,
                "against": party_against,
                "abstain": party_abstain,
                "support_percentage": round(support_probability * 100, 1)
            }
        
        total_votes = votes_for + votes_against + votes_abstain
        bill_status = "PASSED" if votes_for > total_votes / 2 else "REJECTED"
        
        print(f"\n📊 Voting Results:")
        print(f"   For: {votes_for} | Against: {votes_against} | Abstain: {votes_abstain}")
        print(f"   Status: {bill_status}")
        print(f"   Public Opinion: {public_opinion * 100:.1f}%")
        
        return {
            "votes": {
                "for": votes_for,
                "against": votes_against,
                "abstain": votes_abstain,
                "total": total_votes,
                "required_majority": total_votes // 2 + 1
            },
            "status": bill_status,
            "party_breakdown": party_breakdown,
            "coalitions": {
                "NDA": sum(PARTY_SEATS.get(p, 0) for p in NDA_PARTIES if p in PARTY_SEATS),
                "INDIA": sum(PARTY_SEATS.get(p, 0) for p in INDIA_PARTIES if p in PARTY_SEATS),
                "Others": PARTY_SEATS.get("Others", 0)
            },
            "debate_sentiment": debate_sentiment,
            "public_opinion": public_opinion
        }
    
    def _analyze_debate_sentiment(self) -> Dict:
        """Analyze sentiment trends across the debate"""
        sentiments = self.debate_state["sentiment_history"]
        
        if not sentiments:
            return {"average": 0, "trend": "neutral", "volatility": 0}
        
        avg_sentiment = sum(sentiments) / len(sentiments)
        
        if avg_sentiment > 0.2:
            trend = "positive"
        elif avg_sentiment < -0.2:
            trend = "negative"
        else:
            trend = "neutral"
        
        # Calculate volatility
        if len(sentiments) > 1:
            variance = sum((s - avg_sentiment) ** 2 for s in sentiments) / len(sentiments)
            volatility = variance ** 0.5
        else:
            volatility = 0
        
        return {
            "average": round(avg_sentiment, 3),
            "trend": trend,
            "volatility": round(volatility, 3),
            "total_speeches": len(sentiments),
            "timeline": sentiments
        }
    
    def _get_agent_participation_scores(self) -> List[Dict]:
        """Calculate participation and influence scores for each agent"""
        scores = []
        
        for agent in ALL_AGENTS:
            # Find agent's speeches
            agent_speeches = [s for s in self.debate_state["speeches"] if s.get("agent_id") == agent.id]
            
            if agent_speeches:
                avg_sentiment = sum(s.get("sentiment_score", 0) for s in agent_speeches) / len(agent_speeches)
                total_speeches = len(agent_speeches)
            else:
                avg_sentiment = 0
                total_speeches = 0
            
            scores.append({
                "agent_id": agent.id,
                "name": agent.name,
                "role": agent.role,
                "party": agent.party,
                "influence_score": agent.influence_score,
                "voting_tendency": agent.voting_tendency,
                "speeches_given": total_speeches,
                "avg_sentiment": round(avg_sentiment, 3)
            })
        
        # Sort by influence score
        scores.sort(key=lambda x: x["influence_score"], reverse=True)
        return scores