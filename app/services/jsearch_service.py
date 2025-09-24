import os
import requests
import logging
import hashlib
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY")
JSEARCH_API_URL = "https://jsearch.p.rapidapi.com/search"

HEADERS = {
    "x-rapidapi-key": JSEARCH_API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com"
}

def fetch_jsearch_jobs(query: str, location: str = "remote", page: int = 1, country: str = "us", date_posted: str = "all" ) -> List[Dict]:
    """
    Fetches job data from JSearch API.
    
    Args:
        query(str): Search term (e.g., "Python Developer)".
        location (str): Job location (default: "remote").
        page (int): Page number for pagination (default: 1).
        
    Returns:
        List[Dict]: List of job dictionaries from JSearch API
    """
    logger.info(f"Fetching jobs from JSearch API with query= '{query}', location='{location}', page={page}")
    try:
        params = {
            "query": query,
            "location": location,
            "page": page,
            "country": country,
            "date_posted": date_posted
        }
        response = requests.get(JSEARCH_API_URL, headers=HEADERS, params=params)
        response.raise_for_status()
        jobs = response.json()
        return jobs.get("data", [])
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching jobs from JSearch API: {e}. Params: {params}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching jobs from JSearch API: {e}")
        return []
        
def normalize_jsearch_jobs(raw_jobs: List[Dict]) -> List[Dict]:
    """
    Normalizes job data fetched from JSearch API.
    
    Args:
        raw_jobs (List[Dict]): List of raw job data from JSearch API.
    
    Returns:
        List[Dict]: List of normalized job dictionaries.    
    """
    logger.info("Normalizing JSearch jobs...")
    normalized_jobs = []
    def to_int_id(external_id: str) -> int:
        """Deterministic int id from external string id (md5 -> int slice)."""
        if not external_id:
            return 0
        h = hashlib.md5(external_id.encode()).hexdigest()[:8]
        return int(h, 16) % 2147483647

    def parse_iso_datetime(dt_str: str):
        if not dt_str:
            return None
        try:
            # Accept 'Z' as UTC
            dt = dt_str.replace("Z", "+00:00")
            return datetime.fromisoformat(dt)
        except Exception:
            # Try parsing common formats
            try:
                return datetime.utcfromtimestamp(int(dt_str))
            except Exception:
                return None

    for job in raw_jobs:
        # Build normalized record
        external_id = job.get("job_id")
        # Tests expect the original external id string; keep both forms
        int_id = to_int_id(external_id)

        # Truncate URL for display
        url = job.get("job_apply_link") or job.get("job_google_link") or "N/A"
        truncated_url = url[:50] + "..." if url and len(url) > 50 else (url or "N/A")

        # Tags: join skills if available
        tags_list = job.get("skills") or job.get("job_highlights") or []
        if isinstance(tags_list, dict):
            # job_highlights may be a dict of lists -> flatten keys
            flattened = []
            for v in tags_list.values():
                if isinstance(v, list):
                    flattened.extend(v)
            tags_list = flattened
        if isinstance(tags_list, (list, tuple)):
            cleaned = [str(t).strip() for t in tags_list if str(t).strip()]
            tags_list_clean = cleaned if cleaned else None
        else:
            s = str(tags_list).strip()
            tags_list_clean = [t.strip() for t in s.split(",") if t.strip()] if s else None

        created = job.get("job_posted_at_datetime_utc") or job.get("job_posted_at")
        created_dt = parse_iso_datetime(created)

        normalized_jobs.append({
            # Keep original string id for compatibility with tests and some flows
            "id": external_id if external_id is not None else int_id,
            "title": job.get("job_title", "N/A"),
            "company": job.get("employer_name", "N/A"),
            "location": job.get("job_location", "N/A"),
            "work_modality": "Remote" if job.get("job_is_remote") else "On-site",
            "tags": tags_list_clean,
            "url": truncated_url,
            "posted_at": job.get("job_posted_at", job.get("job_posted_at_datetime_utc")),
            "created_at": created_dt,
        })
    logger.info(f"Normalized {len(normalized_jobs)} JSearch jobs")
    return normalized_jobs

if __name__ == "__main__":
    # Test fetch function
    raw_jobs = fetch_jsearch_jobs(query="Python Developer", location="remote", page=1)
    
    print("=== RAW JOBS (Sample) ===")
    for i, job in enumerate(raw_jobs[:2]):  # Show only first 2 jobs
        print(f"Job {i+1}:")
        print(f"  ID: {job.get('job_id')}")
        print(f"  Title: {job.get('job_title')}")
        print(f"  Company: {job.get('employer_name')}")
        print(f"  Location: {job.get('job_location')}")
        print(f"  Posted: {job.get('job_posted_at')}")
        print("  ---")
        
    # Test normalization function
    print("\n=== NORMALIZED JOBS ===")
    normalized_jobs = normalize_jsearch_jobs(raw_jobs)
    for i, job in enumerate(normalized_jobs[:3]):  # Show only first 3 normalized jobs
        print(f"Job {i+1}: {job['title']}")
        print(f"  Company: {job['company']}")
        print(f"  Location: {job['location']}")
        print(f"  Posted: {job['posted_at']}")
        print(f"  URL: {job['url']}")
        print("  ---")
    
    print(f"\nTotal jobs fetched: {len(raw_jobs)}")
    print(f"Total jobs normalized: {len(normalized_jobs)}")