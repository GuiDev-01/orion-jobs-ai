from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
import time
from app.database import SessionLocal
from app.services.remoteok_service import fetch_remote_jobs, normalize_remote_jobs, save_jobs_to_db
from app.services.adzuna_service import fetch_adzuna_jobs, normalize_adzuna_jobs
from app.services.jsearch_service import fetch_jsearch_jobs, normalize_jsearch_jobs
from app.config import (
    COLLECT_ADZUNA_COUNTRIES,
    COLLECT_ADZUNA_MAX_REQUESTS,
    COLLECT_ADZUNA_QUERIES,
    COLLECT_ADZUNA_RESULTS_PER_PAGE,
    COLLECT_JSEARCH_COUNTRY,
    COLLECT_JSEARCH_ENABLED,
    COLLECT_JSEARCH_LOCATION,
    COLLECT_JSEARCH_MAX_REQUESTS,
    COLLECT_JSEARCH_QUERIES,
    COLLECT_MAX_PAGES,
    COLLECT_SLEEP_SECONDS,
)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def collect_remote_jobs() -> dict:
    """
    Collects jobs from RemoteOK API, normalizes them, and saves to database.
    This function is scheduled to run daily.
    """
    logger.info("Starting scheduled job collection...")
    summary = {
        "remoteok": 0,
        "adzuna": 0,
        "jsearch": 0,
        "adzuna_requests": 0,
        "jsearch_requests": 0,
        "status": "success",
    }
    db = None
    try:
        # Get a new database session
        db = SessionLocal()
        
        # Collect and process jobs
        logger.info("Collecting RemoteOK jobs...")
        raw_remote_jobs = fetch_remote_jobs()
        normalized_jobs = normalize_remote_jobs(raw_remote_jobs)
        summary["remoteok"] = len(normalized_jobs)
        save_jobs_to_db(normalized_jobs, db)

        # Adzuna jobs (config-driven matrix with request cap)
        logger.info("Collecting Adzuna jobs with pagination and guardrails...")
        adzuna_requests = 0
        for country in COLLECT_ADZUNA_COUNTRIES:
            for query in COLLECT_ADZUNA_QUERIES:
                for page in range(1, COLLECT_MAX_PAGES + 1):
                    if adzuna_requests >= COLLECT_ADZUNA_MAX_REQUESTS:
                        logger.warning("Reached COLLECT_ADZUNA_MAX_REQUESTS cap, stopping Adzuna collection")
                        break

                    raw_adzuna_jobs = fetch_adzuna_jobs(
                        country=country,
                        query=query,
                        results_per_page=COLLECT_ADZUNA_RESULTS_PER_PAGE,
                        page=page,
                    )
                    adzuna_requests += 1
                    summary["adzuna_requests"] = adzuna_requests

                    if not raw_adzuna_jobs:
                        continue

                    normalized_adzuna_jobs = normalize_adzuna_jobs(raw_adzuna_jobs)
                    summary["adzuna"] += len(normalized_adzuna_jobs)
                    save_jobs_to_db(normalized_adzuna_jobs, db)
                    time.sleep(COLLECT_SLEEP_SECONDS)

                if adzuna_requests >= COLLECT_ADZUNA_MAX_REQUESTS:
                    break
            if adzuna_requests >= COLLECT_ADZUNA_MAX_REQUESTS:
                break

        # JSearch jobs (optional, capped)
        if COLLECT_JSEARCH_ENABLED:
            logger.info("Collecting JSearch jobs with guardrails...")
            jsearch_requests = 0
            for query in COLLECT_JSEARCH_QUERIES:
                if jsearch_requests >= COLLECT_JSEARCH_MAX_REQUESTS:
                    logger.warning("Reached COLLECT_JSEARCH_MAX_REQUESTS cap, stopping JSearch collection")
                    break

                raw_jsearch_jobs = fetch_jsearch_jobs(
                    query=query,
                    location=COLLECT_JSEARCH_LOCATION,
                    page=1,
                    country=COLLECT_JSEARCH_COUNTRY,
                )
                jsearch_requests += 1
                summary["jsearch_requests"] = jsearch_requests

                if not raw_jsearch_jobs:
                    continue

                normalized_jsearch_jobs = normalize_jsearch_jobs(raw_jsearch_jobs)
                summary["jsearch"] += len(normalized_jsearch_jobs)
                save_jobs_to_db(normalized_jsearch_jobs, db)
                time.sleep(COLLECT_SLEEP_SECONDS)
        
        logger.info("Scheduled job collection completed successfully")
        logger.info(f"Collection summary: {summary}")
        return summary
    except Exception as e:
        summary["status"] = "failed"
        summary["error"] = str(e)
        logger.error(f"Error during scheduled job collection: {e}")
        return summary
    finally:
        if db is not None:
            db.close()

def start_scheduler():
    """
    Starts the APScheduler to run the job collection daily at 9:00 AM.
    """
    scheduler = BackgroundScheduler()
    
    # Schedule the job to run daily at 9:00 AM
    scheduler.add_job(
        collect_remote_jobs,
        trigger=CronTrigger(hour=9, minute=0),
        id="collect_jobs_daily",
        name="Collect jobs from RemoteOK API",
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Scheduler started. Jobs will be collected daily at 9:00 AM.")
    
    return scheduler

if __name__ == "__main__":
    # If run directly, start the scheduler and keep the script running
    scheduler = start_scheduler()
    
    try:
        # Keep the main thread alive
        while True:
            import time
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        # Shut down the scheduler gracefully
        scheduler.shutdown()
        logger.info("Scheduler shut down")