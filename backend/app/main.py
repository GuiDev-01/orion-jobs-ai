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
from app.routers.notifications_router import router as notifications_router
from app.middleware import rate_limit_middleware
from sqlalchemy import text
from app.database import get_db
from app.routers.summary_router import router as summary_router
import logging

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for FastAPI application
    Handles startup and shutdown events
    """
    # Startup
    logger.info("🚀 Starting OrionJobs AI...")

    job_scheduler = None
    email_scheduler = None
    
    # Try to start scheduler, but don't fail if it doesn't work
    try:
        from job_schedule import start_scheduler
        job_scheduler = start_scheduler()
        logger.info("✅ Job collection scheduler initialized successfully")
    except Exception as e:
        logger.error(f"⚠️ Scheduler failed to start: {e}")
        logger.info("✅ Application will continue without scheduler")
    
    # Start email notification scheduler
    try:
        from app.features.notifications.schedulers.daily_scheduler import start_scheduler as start_email_scheduler
        email_scheduler = start_email_scheduler()
        logger.info("✅ Email notification scheduler initialized")
    except Exception as e:
        logger.error(f"⚠️ Email scheduler failed: {e}")
    
    yield # Application is running
    
    # Shutdown
    logger.info("🔄️ Shutting down OrionJobs AI...")
    if job_scheduler:
        try:
            job_scheduler.shutdown()
            logger.info("✅ Job scheduler shutdown successfully")
        except Exception as e:
            logger.error(f"⚠️ Job scheduler shutdown failed: {e}")
    
    if email_scheduler:
        try:
            email_scheduler.shutdown()
            logger.info(f"✅ Email scheduler shutdown successfully")
        except Exception as e:
            logger.error(f"⚠️ Email scheduler shutdown failed: {e}")

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
app.include_router(jobs_router.router, prefix="/api/v1", tags=["jobs"])
app.include_router(summary_router)
app.include_router(notifications_router)

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