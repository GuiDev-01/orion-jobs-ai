import logging
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.job import Job
from job_schedule import collect_remote_jobs
from typing import Optional

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/jobs")
def get_jobs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by title or company"),
    remote: Optional[bool] = Query(None, description="Filter remote jobs only"),
    db: Session = Depends(get_db)
):
    """
    Get paginated list of jobs with filters.
    Optimized with database-level pagination.
    """
    try:
        # Base query
        query = db.query(Job)
        
        # Apply filters
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Job.title.ilike(search_pattern),
                    Job.company.ilike(search_pattern)
                )
            )
        
        if remote is True:
            # Filter by remote work modality (case-insensitive)
            query = query.filter(
                Job.work_modality.ilike("%remote%")
            )
        
        # Get total count BEFORE pagination
        total = query.count()
        
        # Apply pagination (OFFSET and LIMIT)
        offset = (page - 1) * page_size
        jobs = query.order_by(Job.created_at.desc()).offset(offset).limit(page_size).all()
        
        # Format jobs for response
        jobs_list = []
        for job in jobs:
            # Handle tags formatting
            if isinstance(job.tags, list):
                formatted_tags = job.tags
            elif isinstance(job.tags, str) and job.tags:
                formatted_tags = job.tags.split(",")
            else:
                formatted_tags = []
            
            jobs_list.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": getattr(job, 'location', None),
                "work_modality": job.work_modality,
                "description": getattr(job, 'description', None),
                "tags": formatted_tags,
                "url": job.url,
                "created_at": str(job.created_at),
                "source": getattr(job, 'source', None)
            })
        
        return {
            "jobs": jobs_list,
            "total": total,
            "page": page,
            "page_size": page_size
        }
        
    except Exception as e:
        logger.exception(f"Error in get_jobs: {str(e)}")  # Debug log
        return {
            "jobs": [],
            "total": 0,
            "page": page,
            "page_size": page_size,
            "error": str(e)
        }


@router.get("/jobs/{job_id}")
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    """Get single job by ID"""
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        
        if not job:
            return {
                "message": "Job not found",
                "status": "error"
            }
        
        # Handle tags formatting
        if isinstance(job.tags, list):
            formatted_tags = job.tags
        elif isinstance(job.tags, str) and job.tags:
            formatted_tags = job.tags.split(",")
        else:
            formatted_tags = []
        
        return {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": getattr(job, 'location', None),
            "work_modality": job.work_modality,
            "description": getattr(job, 'description', None),
            "tags": formatted_tags,
            "url": job.url,
            "created_at": str(job.created_at),
            "source": getattr(job, 'source', None)
        }
        
    except Exception as e:
        return {
            "message": "Error retrieving job",
            "error": str(e),
            "status": "error"
        }


@router.post("/jobs/collect")
def collect_jobs_manual():
    """Manually trigger real job collection and return execution summary."""
    try:
        summary = collect_remote_jobs()

        return {
            "message": "Jobs collected successfully!",
            "summary": summary,
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}