from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)

class JobNotFoundError(Exception):
    def __init__(self, job_id: int):
        self.job_id = job_id
        super().__init__(f"Job with id {job_id} not found")

class DatabaseError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "server_error",
            "path": str(request.url)
        }
    )

async def job_not_found_handler(request: Request, exc: JobNotFoundError):
    logger.warning(f"Job {exc.job_id} not found on {request.url}")
    return JSONResponse(
        status_code=404,
        content={
            "detail": str(exc),
            "type": "not_found_error",
            "job_id": exc.job_id
        }
    )
    
async def database_exception_handler(request: Request, exc: IntegrityError):
    logger.error(f"Database error on {request.url}: {exc}")
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Database constraint violation",
            "type": "database_error",
            "hint": "Check if data already exists or violates constraints"
        }
    )