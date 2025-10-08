from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Job
import requests
import json

router = APIRouter()

@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    """Get all jobs from database"""
    try:
        jobs = db.query(Job).all()
        
        jobs_list = []
        for job in jobs:
            formatted_tags = job.tags if isinstance(job.tags, list) else job.tags.split(",") if job.tags else []
            jobs_list.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "work_modality": job.work_modality,
                "tags": formatted_tags,
                "url": job.url,
                "created_at": str(job.created_at)
            })
        
        return {
            "message": "Jobs retrieved successfully!",
            "jobs": jobs_list,
            "total": len(jobs_list),
            "status": "success"
        }
    except Exception as e:
        return {
            "message": "Error retrieving jobs", 
            "error": str(e), 
            "jobs": [], 
            "total": 0,
            "status": "error"
        }

@router.post("/jobs/collect")
def collect_jobs_manual():
    """Manually trigger job collection for testing"""
    try:
        sample_jobs = [
            {
                "id": 1,
                "title": "Python Developer",
                "company": "TechCorp",
                "work_modality": "Remote",
                "url": "https://example.com/job1"
            },
            {
                "id": 2,
                "title": "Full Stack Developer",
                "company": "StartupX",
                "work_modality": "Hybrid",
                "url": "https://example.com/job2"
            }
        ]
        
        return {
            "message": "Jobs collected successfully!",
            "jobs": sample_jobs,
            "total": len(sample_jobs),
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}