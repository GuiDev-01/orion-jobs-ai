from typing import List, Dict
import requests
from sqlalchemy.orm import Session
from app.models.job import Job
from datetime import datetime
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
 
REMOTEOK_API_URL = "https://remoteok.io/api"

def fetch_remote_jobs() -> List[Dict]:
    """
    Fetches job data from RemoteOK API.
    
    Returns:
        List[Dict]: List of job dictionaries from RemoteOK API
    """
    logger.info("Fetching jobs from RemoteOK API")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"  # Some APIs require a user agent
        }
        response = requests.get(REMOTEOK_API_URL, headers=headers)
        response.raise_for_status()
        jobs = response.json()
        # First item is usually the API documentation
        jobs = jobs[1:] if len(jobs) > 0 else []
        return jobs
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching jobs from RemoteOK API: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching jobs from RemoteOK API: {e}")
        return []
    
def normalize_remote_jobs(raw_jobs: List[Dict]):
    logger.info("Normalizing jobs... ")
    normalized_jobs = []
    for job in raw_jobs:
        # prepare tags as CSV string (tests expect "python,django")
        raw_tags = job.get("tags", [])
        if isinstance(raw_tags, (list, tuple)):
            tags_list = [str(t).strip() for t in raw_tags if str(t).strip()]
        else:
            tags_list = [t.strip() for t in str(raw_tags).split(",") if t.strip()]
        tags_csv = ",".join(tags_list) if tags_list else ""

        normalized_jobs.append({
            "id": int(job.get("id")),
            "title": job.get("position"),
            "company": job.get("company"),
            "work_modality": job.get("work_modality") if job.get("work_modality") else "Remote",
            "tags": tags_csv,
            "url": job.get("url"),
            "created_at": job.get("date")  # Date the job was posted (keeps string as tests expect)
        })
        
    logger.info(f"Normalized {len(normalized_jobs)} jobs")
    return normalized_jobs

from sqlalchemy.orm import Session
from app.models.job import Job

def save_jobs_to_db(jobs: List[Dict], db: Session) -> None:
    logger.info("Saving jobs to database...")
    """
    Saves a list of jobs to the database.
    """
    for job in jobs:
        # Check if the job already exists in the database by ID
        try:
            existing_job = db.query(Job).filter(Job.id == job["id"]).first()
        except Exception:
            # If the session is in a bad state, try to rollback and continue
            try:
                db.rollback()
            except Exception:
                pass
            existing_job = None

        if existing_job:
            continue

        # Create a new record
        created = job.get("created_at")
        # If created_at is a string, try to parse to datetime
        if isinstance(created, str):
            try:
                created_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            except Exception:
                # fallback: leave as None
                created_dt = None
        elif isinstance(created, (datetime,)):
            created_dt = created
        else:
            created_dt = None

        # Normalize tags: accept list or CSV -> produce Python list or None
        raw_tags = job.get("tags")
        tags_val = None
        if raw_tags:
            if isinstance(raw_tags, (list, tuple)):
                cleaned = [str(t).strip() for t in raw_tags if str(t).strip()]
                tags_val = cleaned if cleaned else None
            else:
                s = str(raw_tags).strip()
                cleaned = [t.strip() for t in s.split(",") if t.strip()]
                tags_val = cleaned if cleaned else None

        new_job = Job(
            id=job["id"],
            title=job.get("title") or "",
            company=job.get("company") or "",
            work_modality=job.get("work_modality") or "",
            tags=tags_val if tags_val is not None else [],  # Use empty array if None (Postgres array column requires non-null)
            url=job.get("url") or "",
            created_at=created_dt if created_dt is not None else datetime.utcnow()
        )

        # Insert job with per-job commit to avoid whole-batch failure
        try:
            db.add(new_job)
            db.commit()
        except Exception as e:
            logger.exception(f"Failed to insert job id={job.get('id')}: {e}")
            try:
                db.rollback()
            except Exception:
                pass

    logger.info("Jobs saved (attempted) to database")