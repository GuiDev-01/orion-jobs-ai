import os
import logging
from typing import Dict, Any, Optional
from google import genai
import json

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY environment variable not found. AI features may not work.")
            self.client = None
        else:
            self.client = genai.Client(api_key=self.api_key)
            self.model = "gemini-2.5-flash-lite"
    def analyze_job(self, description: str, title: str) -> Optional[Dict[str, Any]]:
        """
        Analyzes a job description and extracts insights using Gemini.
        Returns a dictionary with match insights, pros/cons, and suggested interview questions.
        """
        if not self.client:
            return {"error": "AI service not configured."}
        
        prompt = f"""
        You are an expert tech career consultant. Analyze the following job posting:
        Role: {title}
        
        Job Description:
        {description}
        
        Provide the following details in a clean JSON format in English with these exact keys:
        - "summary": A brief 2-sentence summary of what this role is actually about.
        - "pros": Array of 3 positive aspects or perks of this job.
        - "cons": Array of 3 potential red flags or challenges (be critical).
        - "interview_questions": Array of 3 technical or behavioral questions to prepare for.
        
        Return ONLY valid JSON. Do not include markdown code block formatting like ```json.
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            raw_text = response.text.strip()
            # Clean up if it returned markdown
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
                
            return json.loads(raw_text)
            
        except Exception as e:
            logger.error(f"Error analyzing job with AI: {e}")
            return {"error": f"Failed to analyze job: {str(e)}"}

ai_service = AIService()