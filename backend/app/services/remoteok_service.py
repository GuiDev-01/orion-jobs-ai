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
    
def normalize_remote_jobs(raw_jobs: List[Dict]) -> List[Dict]:
    """Normalize job data from RemoteOK API."""
    logger.info("Normalizing RemoteOK jobs...")
    normalized_jobs = []
    
    for job in raw_jobs:
        if 'position' not in job or not job.get('id'):
            continue  # Skip invalid jobs
            
        tags_list = []
        raw_tags = job.get('tags', [])
        
        if isinstance(raw_tags, str) and (raw_tags.startswith('{') and raw_tags.endswith('}')):
            clean_str = raw_tags.strip('{}')
            if clean_str:
                import re
                matches = re.findall(r'"([^"]+)"|([^,]+)', clean_str)
                tags_list = [match[0] if match[0] else match[1].strip() for match in matches]
        elif isinstance(raw_tags, list):
            # Clean and filter list items
            tags_list = [str(tag).strip() for tag in raw_tags 
                        if tag and isinstance(tag, (str, int, float))]
            
        # Clean out empty or single-char tags
        tags_list = [tag for tag in tags_list if tag and len(tag) > 1]
            
        # Add the normalized job
        normalized_jobs.append({
            "id": int(job.get("id")),
            "title": job.get("position", ""),
            "company": job.get("company", ""),
            "work_modality": job.get("work_modality") or "Remote",
            "tags": tags_list,  # Properly formatted tags list
            "url": job.get("url", ""),
            "created_at": job.get("date") or datetime.utcnow().isoformat()
        })
    
    logger.info(f"Normalized {len(normalized_jobs)} RemoteOK jobs")
    return normalized_jobs

from sqlalchemy.orm import Session
from app.models.job import Job

def save_jobs_to_db(jobs: List[Dict], db: Session) -> None:
    """
    Saves a list of jobs to the database.
    """
    logger.info("Saving jobs to database...")
    for job in jobs:
        # Check if the job already exists in the database by ID
        existing_job = db.query(Job).filter(Job.id == job["id"]).first()
        if existing_job:
            continue

        # Normalize tags: accept list or CSV -> produce Python list or None
        raw_tags = job.get("tags")
        tags_val = None
        if raw_tags:
            if isinstance(raw_tags, list):
                cleaned = [str(tag).strip() for tag in raw_tags if isinstance(tag, str) and tag.strip()]
                tags_val = cleaned if cleaned else None
            elif isinstance(raw_tags, str):
                cleaned = [tag.strip() for tag in raw_tags.split(",") if tag.strip()]
                tags_val = cleaned if cleaned else None

        new_job = Job(
            id=job["id"],
            title=job.get("title") or "",
            company=job.get("company") or "",
            work_modality=job.get("work_modality") or "",
            tags=tags_val if tags_val is not None else [],  # Use empty array if None
            url=job.get("url") or "",
            created_at=datetime.utcnow() 
        )

        # Insert job with per-job commit to avoid whole-batch failure
        try:
            db.add(new_job)
            db.commit()
        except Exception as e:
            logger.exception(f"Failed to insert job id={job.get('id')}: {e}")
            db.rollback()

    logger.info("Jobs saved (attempted) to database")