from fastapi import FastAPI
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions import(
    global_exception_handler,
    job_not_found_handler,
    database_exception_handler,
    JobNotFoundError
)
from app.routers import jobs_router
from app.middleware import rate_limit_middleware

app = FastAPI(
    title="OrionJobs AI",
    description="Navigate your career journey with AI-powered precision",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.add_exception_handler(JobNotFoundError, job_not_found_handler)
app.add_exception_handler(IntegrityError, database_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.middleware("http")(rate_limit_middleware)
# Cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(jobs_router.router, tags=["jobs"])

@app.get("/")
async def root():
    return {
        "message": "OrionJobs AI - Navigate your career journey",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/health")
async def healt_check():
    return {
        "status": "healthy",
        "service": "OrionJobs AI",
        "features": ["error_handling", "logging", "cors"]
    }