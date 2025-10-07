from fastapi import APIRouter
import requests
import json

router = APIRouter()

@router.get("/jobs")
def get_jobs():
    return {"message": "Jobs endpoint is working!", "jobs": [], "total": 0, "status": "success"}

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