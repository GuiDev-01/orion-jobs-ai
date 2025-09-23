from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.base import Base
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from app.models import Job
# print("Creating table...")
# print (f"Registered tables: {list(Base.metadata.tables.keys())}") #Debug
# Base.metadata.create_all(bind=engine)
# print("Table created!")


