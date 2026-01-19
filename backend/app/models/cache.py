from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from app.database import Base

class APICache(Base):
    __tablename__ = "api_cache"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    query = Column(String, nullable=False)
    country = Column(String, nullable=False)
    response = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now())