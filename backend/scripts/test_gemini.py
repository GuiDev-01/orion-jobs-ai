import os
import sys
from dotenv import load_dotenv

# Load env variables BEFORE importing ai_service
load_dotenv()

# Add backend directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ai_service import ai_service

def main():
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY is not set in environment or .env file.")
        sys.exit(1)
        
    print("Testing Gemini AI Service...")
    
    title = "Senior React Developer"
    description = """
    We are looking for an experienced frontend developer to lead our web team.
    You will be working with React 18, TypeScript, and TailwindCSS.
    Requirements:
    - 5+ years of experience with React
    - Extensive knowledge of state management (Redux, Zustand)
    - Experience with CI/CD pipelines
    
    What we offer:
    - Fully remote work
    - Competitive salary ($120k - $150k)
    - Unlimited PTO (but we actually want you to work 60 hours a week)
    - Health insurance
    """
    
    print(f"\nAnalyzing job: {title}...\n")
    result = ai_service.analyze_job(description, title)
    
    import json
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
