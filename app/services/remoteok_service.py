from typing import List, Dict
import requests
from sqlalchemy.orm import Session
from app.models.job import Job
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
        normalized_jobs.append({
            "id": int(job.get("id")),
            "title": job.get("position"),
            "company": job.get("company"),
            "work_modality": job.get("work_modality") if job.get("work_modality") else "Remote",
            "tags": job.get("tags", []), # List of tags (skills, etc.)
            "url": job.get("url"),
            "created_at": job.get("date") # Date the job was posted
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
        existing_job = db.query(Job).filter(Job.id == job["id"]).first()
        if not existing_job:
            # Create a new record
            new_job = Job(
                id=job["id"],
                title=job["title"],
                company=job["company"],
                work_modality=job["work_modality"],
                tags=job["tags"],
                url=job["url"],
                created_at=job["created_at"]
            )
            db.add(new_job)
    db.commit()
    logger.info("Jobs saved successfully")