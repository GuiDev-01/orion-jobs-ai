from sqlalchemy.orm import Session
from sqlalchemy import and_ 
from datetime import datetime, timedelta
from app.models.cache import APICache

CACHE_EXPIRATION_HOURS = 24 # Cache expiration time (24 hours)

def get_cached_response(query: str, country: str, db: Session):
    expiration_time = datetime.now() - timedelta(hours=CACHE_EXPIRATION_HOURS)
    return db.query(APICache).filter(
        and_(
            APICache.query == query,
            APICache.country == country,
            APICache.created_at >= expiration_time
        )
    ).first()

def save_response_to_cache(query: str, country: str, response: dict, db: Session):
   cached_entry= APICache(query=query, country=country, response=response)
   db.add(cached_entry)
   db.commit()