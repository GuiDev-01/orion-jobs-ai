from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.base import Base
from app.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_size = 5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
from app.models import Job
# print("Creating table...")
# print (f"Registered tables: {list(Base.metadata.tables.keys())}") #Debug
# Base.metadata.create_all(bind=engine)
# print("Table created!")


