from fastapi import FastAPI
from app.routers import items

app = FastAPI()
app.include_router(items.router)
