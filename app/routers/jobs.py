from fastapi import APIRouter

router = APIRouter()

# Mock data for testing (will be replaced with database integration later)
fake_jobs = [
    {"id": 1, "title": "Python Developer", "company": "Tech Corp", "work_modality": "Remote"},
    {"id": 2, "title": "FastAPI Developer", "company": "API Solutions", "work_modality": "Hybrid"},
]

# GET Endpoint
@router.get("/jobs")
def read_jobs():
    return fake_jobs
