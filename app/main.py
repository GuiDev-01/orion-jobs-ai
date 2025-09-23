from contextlib import asynccontextmanager
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

@app.get("/health")
async def healt_check():
    return {
        "status": "healthy",
        "service": "OrionJobs AI",
        "features": ["error_handling", "logging", "cors"]
    }