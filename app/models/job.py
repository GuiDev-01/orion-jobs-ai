from app.base import Base
from sqlalchemy import Integer, String, DateTime, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime


class Job(Base):
    __tablename__ = "jobs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)  # Integer column, primary key
    title: Mapped[str] = mapped_column(String)  # String column for job title
    company: Mapped[str] = mapped_column(String)  # String column for company name
    work_modality: Mapped[str] = mapped_column(String, nullable=False)  # String Column for work modality (remote, hybrid, on-site)
    tags: Mapped[str] = mapped_column(ARRAY(Text), nullable=True)  # Tags (Skills) stored as Postgres text[]
    url: Mapped[str] = mapped_column(String, nullable=False)  # URL for job details
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)  # Date the job was posted
    