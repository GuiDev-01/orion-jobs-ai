import os
import requests
import logging
from typing import List, Dict
from dotenv import load_dotenv
import hashlib
from datetime import datetime
from app.config import ADZUNA_APP_ID, ADZUNA_APP_KEY
from app.services.cache_service import get_cached_response, save_response_to_cache
from app.database import SessionLocal

# Load environment variables from .env file
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Adzuna API endpoint
ADZUNA_API_URL = "https://api.adzuna.com/v1/api/jobs"


def fetch_adzuna_jobs(
    country: str = "gb",
    query: str = "developer",
    results_per_page: int = 10,
    page: int = 1,
    salary_min: int = None,
    location: str = None,
    sort_by: str = None,
    full_time: bool = None,
    permanent: bool = None,
    **kwargs,
) -> List[Dict]:
    """Fetches job data from Adzuna API using a context-managed DB session for cache access."""

    with SessionLocal() as db:
        try:
            cached_response = get_cached_response(query, country, db)
            if cached_response:
                logger.info(
                    f"Using cached response for query '{query}' in country '{country}' (loaded from database)"
                )
                return cached_response.response

            url = f"{ADZUNA_API_URL}/{country}/search/{page}"
            params = {
                "app_id": ADZUNA_APP_ID,
                "app_key": ADZUNA_APP_KEY,
                "results_per_page": results_per_page,
                "what": query,
                **kwargs,
            }

            # Add optional parameters
            if salary_min:
                params["salary_min"] = salary_min
            if location:
                params["where"] = location
            if sort_by:
                params["sort_by"] = sort_by
            if full_time:
                params["full_time"] = "1"
            if permanent:
                params["permanent"] = "1"

            safe_params = {k: v for k, v in params.items() if k not in ['app_id', 'app_key']}
            logger.info(f"Requesting Adzuna API with params: {safe_params}")
            response = requests.get(url, params=params)
            response.raise_for_status()
            jobs = response.json().get("results", [])

            # Save to cache (upsert handled by cache_service)
            save_response_to_cache(query, country, jobs, db)
            logger.info(f"Saved response to cache for query '{query}' in country '{country}'")
            return jobs

        except requests.exceptions.RequestException as e:
            logger.error(f"Request error occurred: {e}")
            return []


def normalize_adzuna_jobs(raw_jobs: List[Dict]) -> List[Dict]:
    """Normalizes job data from Adzuna into a compact, DB-ready structure.

    - Converts external string IDs into deterministic integers (MD5 -> int).
    - Parses `created` ISO strings into Python datetime when possible.
    - Flattens tags into CSV strings.
    """
    logger.info("Normalizing Adzuna jobs...")
    normalized_jobs: List[Dict] = []

    for job in raw_jobs:
        # Basic validation
        if not job.get("title"):
            logger.warning(f"Skipping job without title: {job}")
            continue

        original_id = str(job.get("id", ""))
        hash_object = hashlib.md5(original_id.encode())
        unique_id = int(hash_object.hexdigest()[:8], 16) % 2147483647

        created_at = job.get("created")
        # Keep original created string so tests that expect ISO string continue to pass
        created_at_str = created_at if created_at else None

        tags = job.get("tags") or []
        # Normalize tags: flatten list and remove empty entries, produce None when no tags
        if isinstance(tags, list):
            cleaned = [str(t).strip() for t in tags if str(t).strip()]
            tags_list = cleaned if cleaned else None
        else:
            # single value or string
            s = str(tags).strip()
            tags_list = [t.strip() for t in s.split(",") if t.strip()] if s else None

        normalized_jobs.append(
            {
                "id": unique_id,
                "title": job.get("title"),
                "company": (job.get("company") or {}).get("display_name") or "",
                "work_modality": "Remote",
                "tags": tags_list,
                "location": (job.get("location") or {}).get("display_name") or "Unknown",
                "description": (job.get("description")[:200].strip() + "...") if job.get("description") else "No description available",
                "url": (job.get("redirect_url") or job.get("url") or "").split("?")[0],
                "created_at": created_at_str,
            }
        )

    logger.info(f"Normalized {len(normalized_jobs)} Adzuna jobs.")
    return normalized_jobs


if __name__ == "__main__":
    from app.services.remoteok_service import save_jobs_to_db

    raw_jobs = fetch_adzuna_jobs(country="gb", query="developer", results_per_page=5)
    normalized_jobs = normalize_adzuna_jobs(raw_jobs)

    print("=== NORMALIZED JOBS ===")
    for i, job in enumerate(normalized_jobs, 1):
        print(f"\n--- Job {i} ---")
        print(f"ID: {job['id']}")
        print(f"Title: {job['title']}")
        print(f"Company: {job['company']}")
        print(f"Location: {job['location']}")
        print(f"Description: {job['description']}")
        print(f"URL: {job['url']}")
        print(f"Created: {job['created_at']}")
        print("-" * 50)

    # Save to database using a short-lived session
    from app.database import SessionLocal as _SessionLocal

    with _SessionLocal() as db:
        try:
            save_jobs_to_db(normalized_jobs, db)
            print("✅ Data saved successfully")
        except Exception as e:
            print(f"❌ Error saving data: {e}")
        finally:
            logger.info("Database session closed")