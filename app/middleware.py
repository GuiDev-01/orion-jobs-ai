from fastapi import Request, HTTPException
from time import time
from collections import defaultdict

request_counts = defaultdict(list)

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time()
    
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip]
        if current_time - req_time < 60
    ]
    
    if len(request_counts[client_ip]) >= 30:
        raise HTTPException(
            status_code=429,
            detail= "Too many requests. Try again later."
        )
        
    request_counts[client_ip].append(current_time)
    
    response = await call_next(request)
    return response