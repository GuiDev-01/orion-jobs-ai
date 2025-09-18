from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title: str
    company: str
    work_modality: str

class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    work_modality: str
    
    class Config:
        from_attributes = True
        
class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    work_modality: Optional[str] = None
    
class MessageResponse(BaseModel):
    message: str