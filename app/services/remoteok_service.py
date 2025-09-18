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
    logger.info("Fetching jobs from RemoteOK API")
    try:
        # Configure retries
        session = requests.Session()
        retries = Retry(
            total=5, #Maximum number of retries
            backoff_factor=1, #Time between retries (exponential)
            status_forcelist=[500,502,503,504] # HTTP status codes to retry
        )
        session.mount("https://", HTTPAdapter(max_retries=retries))
        response = requests.get(REMOTEOK_API_URL)
        response.raise_for_status() # Raise exception for HTTP errors
        jobs = response.json() # Get the JSON content
        
        # Filter only valid job entries (those with an 'id' field)
        filtered_jobs = [job for job in jobs if "id" in job]
        logger.info(f"Fetched {len(filtered_jobs)} jobs from RemoteOK API")
        return filtered_jobs
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching data from RemoteOk API {e}")
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