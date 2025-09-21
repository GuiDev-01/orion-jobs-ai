from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
from app.database import SessionLocal
from app.services.remoteok_service import fetch_remote_jobs, normalize_remote_jobs, save_jobs_to_db
from app.services.adzuna_service import fetch_adzuna_jobs, normalize_adzuna_jobs
# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def collect_remote_jobs():
    """
    Collects jobs from RemoteOK API, normalizes them, and saves to database.
    This function is scheduled to run daily.
    """
    logger.info("Starting scheduled job collection...")
    try:
        # Get a new database session
        db = SessionLocal()
        
        # Collect and process jobs
        logger.info("Collecting RemoteOK jobs...")
        raw_remote_jobs = fetch_remote_jobs()
        normalized_jobs = normalize_remote_jobs(raw_remote_jobs)
        save_jobs_to_db(normalized_jobs, db)
        
        # Adzuna jobs
        logger.info("Collecting Adzuna jobs...")
        raw_adzuna_jobs = fetch_adzuna_jobs(country="gb", query="developer", results_per_page= 20)
        normalized_adzuna_jobs = normalize_adzuna_jobs(raw_adzuna_jobs)
        save_jobs_to_db(normalized_adzuna_jobs, db)
        
        logger.info("Scheduled job collection completed successfully")
    except Exception as e:
        logger.error(f"Error during scheduled job collection: {e}")
    finally:
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