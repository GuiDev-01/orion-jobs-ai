from app.base import Base
from sqlalchemy import Integer, String, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

class Job(Base):
    __tablename__ = "jobs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)  # Integer column, primary key
    title: Mapped[str] = mapped_column(String)  # String column for job title
    company: Mapped[str] = mapped_column(String)  # String column for company name
    work_modality: Mapped[str] = mapped_column(String, nullable=False)  # String Column for work modality (remote, hybrid, on-site)
    tags: Mapped[list[str]] = mapped_column(Text, default="") # Tags (Skills, etc.)
    url: Mapped[str] = mapped_column(String, nullable=False) # URL for job details
    created_at: Mapped[str] = mapped_column(DateTime, nullable=False) # Date the job was posted
    