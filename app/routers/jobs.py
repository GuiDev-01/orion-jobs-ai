from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.job import Job
from fastapi import HTTPException

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET Endpoint
@router.get("/jobs")
def read_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs

# POST Endpoint
@router.post("/jobs")
def create_job(title: str, company: str, work_modality: str, db: Session = Depends(get_db)):
    db_job = Job(title=title, company=company, work_modality=work_modality)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

# GET by ID Endpoint
@router.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found") 
    return job 

#PUT Endpoint
@router.put("/jobs/{job_id}")
def update_job(job_id: int, title: str, company: str, work_modality: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id== job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.title = title
    job.company = company
    job.work_modality = work_modality
    db.commit()
    db.refresh(job)
    return job

@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}