from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.job import Job
from fastapi import HTTPException
from app.routers.job_router import JobResponse, JobCreate, JobUpdate, MessageResponse
from typing import List
from app.exceptions import JobNotFoundError
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET Endpoint
@router.get("/jobs", response_model=List[JobResponse])
def read_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs

# POST Endpoint
@router.post("/jobs", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

# GET by ID Endpoint
@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise JobNotFoundError(job_id) 
    return job 

#PUT Endpoint
@router.put("/jobs/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job_update: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id== job_id).first()
    if job is None:
        raise JobNotFoundError(job_id)
    
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}",response_model=MessageResponse)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise JobNotFoundError(job_id)
    
    db.delete(job)
    db.commit()
    return MessageResponse(message = "Job deleted successfully")