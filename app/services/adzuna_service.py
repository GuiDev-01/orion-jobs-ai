import os
import requests
import logging
from typing import List, Dict 
from dotenv import load_dotenv
import hashlib
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# Load Adzuna API credentials from environment variables
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

# Adzuna API endpoint
ADZUNA_API_URL = "https://api.adzuna.com/v1/api/jobs"

def fetch_adzuna_jobs(
    country: str = "gb",
    query: str = "developer",
    results_per_page: int = 10,
    salary_min: int = None,
    location: str = None,
    sort_by: str = None,
    full_time: bool = None,
    permanent: bool = None
) -> List[Dict]:
    """
    Fetches job data from Adzuna API.
    """
    logger.info(f"Fetching jobs from Adzuna API for query '{query}' in country '{country}'...")
    try:
        url = f"{ADZUNA_API_URL}/{country}/search/1"
        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "results_per_page": results_per_page,
            "what": query
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
        
        # Log URL and Params
        logger.info(f"URL: {url}")
        logger.info(f"Params: {params}")
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        jobs = response.json().get("results", [])
        logger.info(f"Fetched {len(jobs)} jobs from Adzuna API.")
        return jobs
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching jobs from Adzuna API: {e}")
        return []

def normalize_adzuna_jobs(raw_jobs: List[Dict]) -> List[Dict]:
    """
    Normalizes job data fetched from Adzuna API.
    Ensures consistent structure for database insertion.
    """
    logger.info("Normalizing Adzuna jobs...")
    normalized_jobs = []
    for job in raw_jobs:
        original_id = str(job.get("id", ""))
        hash_object = hashlib.md5(original_id.encode())
        unique_id = int(hash_object.hexdigest()[:8], 16) % 2147483647
        
        
        normalized_jobs.append({
            "id": unique_id,
            "title": job.get("title"),
            "company": job.get("company", {}).get("display_name"),
            "work_modality": "Remote",
            "tags": [],
            "location": job.get("location", {}).get("display_name") or "Unknown",
            "description": (job.get("description")[:200].strip() + "...") if job.get("description") else "No description available",
            "url": job.get("redirect_url").split("?")[0] if job.get("redirect_url") else "No URL available",
            "created_at": job.get("created")
        })
    logger.info(f"Normalized {len(normalized_jobs)} Adzuna jobs.")
    return normalized_jobs

if __name__ == "__main__":
    from app.database import SessionLocal
    from app.services.remoteok_service import save_jobs_to_db
    
    # Buscar dados da Adzuna
    raw_jobs = fetch_adzuna_jobs(country="gb", query="developer", results_per_page=5)
    normalized_jobs = normalize_adzuna_jobs(raw_jobs)
    
    # Exibir dados normalizados
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
    
    # Salvar no banco de dados
    print("\n=== SAVING TO DATABASE ===")
    db = SessionLocal()
    try:
        save_jobs_to_db(normalized_jobs, db)
        print("✅ Data saved successfully")
    except Exception as e:
        print(f"❌ Error saving data: {e}")
    finally:
        db.close()