from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
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
from sqlalchemy import text
from app.routers.jobs_router import get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for FastAPI application
    Handles startup and shutdown events
    """
    # Startup
    print("🚀 Starting OrionJobs AI...")
    from job_schedule import start_scheduler
    scheduler = start_scheduler()
    print("✅ Scheduler initialized successfully")
    
    yield # Application is running
    
    # Shutdown
    print("🔄️ Shutting down OrionJobs AI...")
    if scheduler:
        scheduler.shutdown()
        print("✅ Scheduler shutdown successfully")

app = FastAPI(
    title="OrionJobs AI",
    description="Navigate your career journey with AI-powered precision",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Exception handlers
app.add_exception_handler(JobNotFoundError, job_not_found_handler)
app.add_exception_handler(IntegrityError, database_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Middleware
app.middleware("http")(rate_limit_middleware)

# Cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Routers
app.include_router(jobs_router.router, tags=["jobs"])

@app.get("/")
async def root():
    return {
        "message": "OrionJobs AI - Navigate your career journey",
        "status": "operational",
        "version": "1.0.0"
    }

# Only fixing the typo in the function name
@app.get("/health")
async def health_check(db=Depends(get_db)):
    """ Health check endpoint - checks API and database"""
    db_status = "unhealthy"
    try:
        result = db.execute(text("SELECT 1")).scalar()
        db_status = "healthy" if result == 1 else "unhealthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    return {
        "status": "healthy",
        "service": "OrionJobs AI",
        "database": db_status,
        "features": ["error_handling", "logging", "cors", "db_check"],
        "version": "1.0.0"
    }