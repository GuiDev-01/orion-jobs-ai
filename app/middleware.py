from fastapi import Request, HTTPException
from time import time
from collections import defaultdict
import logging
import uuid

logger = logging.getLogger(__name__)

# In-memory rate limiting
request_counts = defaultdict(list)

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware using in-memory storage."""
    client_ip = request.client.host
    current_time = time()

    # Skip rate limiting for health checks and docs
    if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
        return await call_next(request)
    
    # Clean old requests (older than 60 seconds)
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip]
        if current_time - req_time < 60
    ]

    # Check rate limit (30 requests per minute)
    if len(request_counts[client_ip]) >= 30:
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again in a minute."
        )
    
    # Add current request
    request_counts[client_ip].append(current_time)
    
    response = await call_next(request)
    return response


async def request_id_middleware(request: Request, call_next):
    """Add unique request ID for tracing and debugging."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    
    return response