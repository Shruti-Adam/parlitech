"""
LLM Service with Free API Support (Groq + Gemini fallback)
No API key needed - uses fallback responses if no keys provided
"""

import httpx
import random
from typing import Optional
from textblob import TextBlob
from app.config import Config

class LLMService:
    """Handles all LLM interactions with automatic fallback"""
    
    def __init__(self):
        self.groq_key = Config.GROQ_API_KEY
        self.gemini_key = Config.GEMINI_API_KEY
        self.use_groq = bool(self.groq_key)
        self.use_gemini = bool(self.gemini_key)
        
        print(f"📡 LLM Service initialized - Groq: {self.use_groq}, Gemini: {self.use_gemini}")
    
    async def generate(self, prompt: str, temperature: float = 0.7) -> str:
        """Generate response using best available API or fallback"""
        
        if self.use_groq:
            return await self._call_groq(prompt, temperature)
        elif self.use_gemini:
            return await self._call_gemini(prompt, temperature)
        else:
            return self._fallback_response(prompt)
    
    async def _call_groq(self, prompt: str, temperature: float) -> str:
        """Call Groq API (free, 14,400 requests/day)"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.groq_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama3-70b-8192",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": temperature,
                        "max_tokens": 500
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    print(f"Groq API error: {response.status_code}")
                    return self._fallback_response(prompt)
        except Exception as e:
            print(f"Groq API exception: {e}")
            return self._fallback_response(prompt)
    
    async def _call_gemini(self, prompt: str, temperature: float) -> str:
        """Call Gemini API (free, 1,500 requests/day)"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}",
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {
                            "temperature": temperature,
                            "maxOutputTokens": 500
                        }
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                else:
                    print(f"Gemini API error: {response.status_code}")
                    return self._fallback_response(prompt)
        except Exception as e:
            print(f"Gemini API exception: {e}")
            return self._fallback_response(prompt)
    
    def _fallback_response(self, prompt: str) -> str:
        """Generate realistic responses without API"""
        
        prompt_lower = prompt.lower()
        
        # Role-based responses
        if "prime minister" in prompt_lower:
            return """Honorable Speaker, respected colleagues. The government has carefully considered this bill. We believe it will drive economic growth and benefit the common citizen. I urge all members to support this progressive legislation that aligns with our vision of a developed India. The data clearly shows the positive impact this will have on our GDP and employment rates."""
        
        elif "opposition leader" in prompt_lower:
            return """Mr. Speaker, the opposition has serious concerns. While the government claims this bill is beneficial, we see significant flaws in its implementation. The people's interests must come first. We demand transparency and proper debate before any rushed legislation is passed."""
        
        elif "finance minister" in prompt_lower:
            return """Thank you, Mr. Speaker. From a fiscal perspective, this bill requires careful allocation of resources. Our analysis shows a positive return on investment of approximately 15% over five years. However, we must ensure proper budgeting and avoid unnecessary expenditure."""
        
        elif "women's representative" in prompt_lower:
            return """Respected Speaker, I rise to speak on behalf of millions of women across this nation. This bill must address gender parity and ensure equal opportunities. We have seen how previous policies failed rural women. Let us learn from those lessons and create inclusive legislation."""
        
        elif "youth representative" in prompt_lower:
            return """Honorable members, the youth of India are watching. We represent over 600 million people under 25. This bill must create jobs, improve education, and provide digital infrastructure. The future belongs to our young citizens, and their voice must be heard in this debate."""
        
        elif "agriculture minister" in prompt_lower:
            return """Mr. Speaker, our farmers are the backbone of this nation. This bill, if implemented correctly, could transform rural economy. We have consulted with agricultural experts and farmer unions. The provisions ensure MSP remains protected while modernizing our supply chains."""
        
        else:
            return """Thank you, Honorable Speaker. I rise to contribute to this important debate. After careful consideration of all aspects, I believe this bill has merit but requires amendments. We must balance national interest with local concerns. I look forward to hearing other members' perspectives on this matter."""