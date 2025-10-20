from app.database import get_db, SessionLocal
from app.models.job import Job
import re
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def fix_tags_in_database():
    """Fix malformatted tags in existing database records"""
    db = SessionLocal()
    try:
        # Get all jobs with problematic tags
        jobs = db.query(Job).all()
        logger.info(f"Found {len(jobs)} jobs to check")
        
        fixed_count = 0
        for job in jobs:
            needs_fixing = False
            
            # Check if tags are malformatted
            if job.tags and isinstance(job.tags, list):
                # Check for single character tags (like '{', '}', etc)
                single_chars = [t for t in job.tags if isinstance(t, str) and len(t) == 1]
                if single_chars and len(single_chars) > 3:
                    needs_fixing = True
                
            if needs_fixing:
                # Try to reconstruct proper tags
                raw_tags = ''.join(job.tags) if job.tags else ""
                if raw_tags.startswith('{') and raw_tags.endswith('}'):
                    # Extract actual tags
                    clean_str = raw_tags.strip('{}')
                    if ',' in clean_str:
                        # Split by commas
                        tags_list = [t.strip() for t in clean_str.split(',') if t.strip()]
                        
                        # Update the job
                        job.tags = tags_list
                        fixed_count += 1
                        logger.info(f"Fixed tags for job {job.id}: {tags_list}")
                    else:
                        # It might be a JSON-like string
                        matches = re.findall(r'"([^"]+)"', clean_str)
                        if matches:
                            job.tags = matches
                            fixed_count += 1
                            logger.info(f"Fixed JSON-like tags for job {job.id}: {matches}")
        
        db.commit()
        logger.info(f"Fixed tags for {fixed_count} jobs")
        
    except Exception as e:
        logger.error(f"Error fixing tags: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_tags_in_database()