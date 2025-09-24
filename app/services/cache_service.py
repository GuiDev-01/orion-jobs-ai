from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta, timezone
from app.models.cache import APICache

CACHE_EXPIRATION_HOURS = 24  # Cache expiration time (24 hours)


def get_cached_response(query: str, country: str, db: Session):
    expiration_time = datetime.now(timezone.utc) - timedelta(hours=CACHE_EXPIRATION_HOURS)
    return (
        db.query(APICache)
        .filter(
            and_(
                APICache.query == query,
                APICache.country == country,
                APICache.created_at >= expiration_time,
            )
        )
        .first()
    )


def save_response_to_cache(query: str, country: str, response: dict, db: Session):
    """Insert or update cached response for a query/country pair."""
    existing = (
        db.query(APICache)
        .filter(APICache.query == query, APICache.country == country)
        .first()
    )
    if existing:
        existing.response = response
        try:
            existing.created_at = datetime.now(timezone.utc)
        except Exception:
            # If created_at is server default, it's fine to skip update
            pass
    else:
        cached_entry = APICache(query=query, country=country, response=response)
        db.add(cached_entry)

    db.commit()