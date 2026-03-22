from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.models.job import Job
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("/ai/analyze-job/{job_id}")
def analyze_job(job_id: int, db: Session = Depends(get_db)):
    """
    Analyzes a specific job from the database using AI.
    Returns insights like pros, cons, a summary, and interview questions.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if not job.description:
        raise HTTPException(status_code=400, detail="Job description is empty. Cannot analyze without a description.")
        
    result = ai_service.analyze_job(description=job.description, title=job.title)
    
    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result
