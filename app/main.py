from fastapi import FastAPI
from app.routers import jobs

app = FastAPI()
app.include_router(jobs.router)