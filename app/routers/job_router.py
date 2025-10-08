from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobCreate(BaseModel):
    title: str
    company: str
    work_modality: str
    tags: Optional[List[str]] = None
    url: str

class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    work_modality: str
    tags: Optional[List[str]] = None
    url: str
    created_at: datetime
    
    class Config:
        from_attributes = True
        
class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    work_modality: Optional[str] = None
    tags: Optional[List[str]] = None
    url: Optional[str] = None
    
class MessageResponse(BaseModel):
    message: str