from app.base import Base
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

class Job(Base):
    __tablename__ = "jobs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True) # Integer column, primary key
    title: Mapped[str] = mapped_column(String) # String column for job title
    company:Mapped[str] = mapped_column(String) # String column for company name
    work_modality: Mapped[str]= mapped_column(String) #String Column for work modality (remote, hybrid, on-site)
