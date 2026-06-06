"""
Sentiment analysis service for debate speeches
"""

from textblob import TextBlob
from typing import Dict, List

class SentimentService:
    """Analyzes sentiment of parliamentary speeches"""
    
    @staticmethod
    def analyze(text: str) -> Dict:
        """Analyze sentiment of a speech text"""
        blob = TextBlob(text)
        
        polarity = blob.sentiment.polarity  # -1 (negative) to 1 (positive)
        subjectivity = blob.sentiment.subjectivity  # 0 (objective) to 1 (subjective)
        
        # Categorize sentiment
        if polarity > 0.2:
            sentiment = "positive"
        elif polarity < -0.2:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return {
            "polarity": round(polarity, 3),
            "subjectivity": round(subjectivity, 3),
            "sentiment": sentiment
        }
    
    @staticmethod
    def analyze_debate(speeches: List[Dict]) -> Dict:
        """Analyze sentiment trend across a debate"""
        
        if not speeches:
            return {"trend": [], "average": 0, "volatility": 0}
        
        sentiments = []
        for speech in speeches:
            sentiment = SentimentService.analyze(speech.get("speech_text", ""))
            sentiments.append(sentiment["polarity"])
        
        average = sum(sentiments) / len(sentiments) if sentiments else 0
        
        # Calculate volatility (standard deviation)
        if len(sentiments) > 1:
            variance = sum((x - average) ** 2 for x in sentiments) / len(sentiments)
            volatility = variance ** 0.5
        else:
            volatility = 0
        
        return {
            "trend": sentiments,
            "average": round(average, 3),
            "volatility": round(volatility, 3),
            "total_speeches": len(speeches)
        }
    
    @staticmethod
    def get_public_opinion(sentiment_trend: List[float]) -> float:
        """Convert sentiment trend to public opinion score (0-1)"""
        if not sentiment_trend:
            return 0.5
        
        # Weight recent speeches more heavily
        weighted_sum = 0
        total_weight = 0
        
        for i, score in enumerate(sentiment_trend[-10:]):  # Last 10 speeches
            weight = i + 1  # Recent speeches get higher weight
            weighted_sum += score * weight
            total_weight += weight
        
        # Convert from -1..1 to 0..1
        raw_score = weighted_sum / total_weight if total_weight > 0 else 0
        public_opinion = (raw_score + 1) / 2
        
        return min(1, max(0, public_opinion))