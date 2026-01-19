import sys
import os
from dotenv import load_dotenv

load_dotenv()

import logging
import time
from app.services.adzuna_service import fetch_adzuna_jobs, normalize_adzuna_jobs
import uvicorn
from app.services.remoteok_service import fetch_remote_jobs, normalize_remote_jobs
from app.database import SessionLocal
from app.services.cache_service import get_cached_response
from app.services.remoteok_service import save_jobs_to_db
from sqlalchemy import text

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_database_connection():
    """Test if database is accessible"""
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f" Database connection failed: {e}")
        return False

def test_remoteok_integration():
    
    logger.info("Testing integration with RemoteOK API...")
    raw_jobs = fetch_remote_jobs()
    logger.info(f"Raw jobs found: {len(raw_jobs)}")
    
    normalized_jobs = normalize_remote_jobs(raw_jobs)
    logger.info(f"Normalized jobs: {len(normalized_jobs)}")
    
    db = SessionLocal()
    try:
        # Save a small batch first to avoid large inserts during tests
        save_jobs_to_db(normalized_jobs[:10], db)
        logger.info("✅ Jobs saved to database successfully!")
    finally:
        db.close()
    
    # Show sample jobs    
    logger.info("📋 Sample jobs:")
    for job in normalized_jobs[:5]:
        logger.info(f"ID: {job['id']}, Title: {job['title']}, Company: {job['company']}, Work Modality: {job['work_modality']}")
    return True    
        
def test_adzuna_integration():
    """Test integration with Adzuna API"""
    try:
        logger.info("Testing Adzuna integration...")
        from app.services.adzuna_service import fetch_adzuna_jobs, normalize_adzuna_jobs
        
        queries = ["developer", "python", "javascript", "react", "node", "fullstack", "backend", "frontend" ]
        countries = ["gb", "us", "ca", "au"]
        
        all_normalized_jobs = []
        
        # Adzuna API request safety: limit total external requests per run
        ADZUNA_MAX_REQUESTS = int(os.getenv("COLLECT_ADZUNA_MAX_REQUESTS", "40"))
        adzuna_calls = 0
        stop_all = False

        for country in countries:
            logger.info(f"\n📍 Collecting jobs from {country.upper()}...")
            # Pagination / rate limiting config (safe defaults)
            MAX_PAGES = int(os.getenv("COLLECT_MAX_PAGES", "2"))
            SLEEP_SECONDS = float(os.getenv("COLLECT_SLEEP_SECONDS", "1.5"))

            for query in queries:
                try:
                    for page in range(1, MAX_PAGES + 1):
                        if stop_all:
                            break
                        logger.info(f"   🔍 Searching for {query} jobs (page {page})...")

                        # Check cache first to avoid external requests
                        with SessionLocal() as db:
                            cached = get_cached_response(query, country, db)
                            if cached:
                                raw_jobs = cached.response
                                used_cache = True
                            else:
                                used_cache = False

                        if not used_cache:
                            # If we already hit the limit, stop further external calls
                            if adzuna_calls >= ADZUNA_MAX_REQUESTS:
                                logger.warning(f"   ⚠️ Reached Adzuna request limit ({ADZUNA_MAX_REQUESTS}). Stopping further Adzuna queries.")
                                stop_all = True
                                break

                            raw_jobs = fetch_adzuna_jobs(
                                country=country,
                                query=query,
                                results_per_page=50,
                                page=page,
                                salary_min=30000 if country in ["gb", "us", "ca", "au"] else None
                            )
                            adzuna_calls += 1

                        if not raw_jobs:
                            logger.info(f"   ℹ️ No more results for {query} in {country.upper()} at page {page}")
                            break

                        normalized_jobs = normalize_adzuna_jobs(raw_jobs)
                        all_normalized_jobs.extend(normalized_jobs)
                        logger.info(f"   ✅ Found {len(normalized_jobs)} jobs for {query} in {country.upper()} (page {page})")
                        # Respect rate limits
                        time.sleep(SLEEP_SECONDS)
                except Exception as query_error:
                    logger.error(f"   ❌ Error searching '{query}' in {country.upper()}: {query_error}")
                    continue
            if stop_all:
                logger.warning("Stopping Adzuna collection due to request limit.")
                break
                
        unique_jobs = {}
        for job in all_normalized_jobs:
            unique_jobs[job['id']] = job
            
        final_jobs = list(unique_jobs.values())
        
        logger.info(f"\n🎯 TOTAL RESULTS:")
        logger.info(f"   📊 Total jobs collected: {len(all_normalized_jobs)}")
        logger.info(f"   🔥 Unique jobs (after deduplication): {len(final_jobs)}")
        
        if final_jobs:
            db = SessionLocal()
            try:
                save_jobs_to_db(final_jobs, db)
                logger.info(f"   💾 {(len(final_jobs))} jobs saved to database")
            except Exception as save_error:
                logger.error(f"   ⚠️ Error saving to database: {save_error}")
            finally:
                db.close()
        
        logger.info(f" \n📋 Sample of collected jobs:")
        for i, job in enumerate(final_jobs[:5], 1):
            logger.info(f"   {i}. ID: {job['id']}, Title: {job['title']}, Company: {job['company']}")
                 
        logger.info(f"\n Adzuna: Successfully collected {len(final_jobs)} unique jobs!")
        return True
    
    except Exception as e:
        logger.error(f"❌ Adzuna integration failed: {e}")
        return False
        
def run_tests():
    """Run all integration tests"""
    logger.info("-" *60)
    logger.info("🧪 Running integration tests...")
    logger.info('-' * 60)

    # Test connection with database first
    if not test_database_connection():
        logger.warning("Cannot proceed without database connection")
        return False

    # Ensure DB tables exist (useful for SQLite test DB)
    try:
        from app.database import engine
        from app.base import Base
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables ensured/created")
    except Exception as e:
        logger.error(f"⚠️ Could not ensure DB tables: {e}")
    
    remote_ok = test_remoteok_integration()
    logger.info('-' *60)

    adzuna_ok = test_adzuna_integration()
    
    logger.info('-' *60)
    
    
    if remote_ok and adzuna_ok:
        logger.info("✅ All integration tests passed!")
        return True
    else:
        logger.error("❌ Some integration tests failed!")
        return False

if __name__ == "__main__":
    # Check if running in test mode
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        # Just run tests
        logger.info("🔧 OrionJobs AI - Running Tests Only")
        success= run_tests()
        sys.exit(0 if success else 1)
    else:
        # Run tests first, then start server
        logger.info("🔧 OrionJobs AI - Starting Integration Tests")
        tests_passed = run_tests()
        
        if tests_passed:
            logger.info("\n✅ All tests passed! Starting OrionJobs AI server...")
        else:
            logger.warning("\n⚠️ Some tests failed, but starting server anyway...")
        
        # Start server
        logger.info("🚀 Starting FastAPI server on http://127.0.0.1:8000")
        uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
            
