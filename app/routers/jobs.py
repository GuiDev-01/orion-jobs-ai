from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.job import Job

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
