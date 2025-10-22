import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal
from app.models.job import Job
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_broken_tags():
    db = SessionLocal()
    try:
        jobs = db.query(Job).all()
        logger.info(f"Found {len(jobs)} jobs to check")
        
        fixed_count = 0
        
        for job in jobs:
            if not job.tags or not isinstance(job.tags, list):
                continue
                
            single_chars = [t for t in job.tags if isinstance(t, str) and len(t) == 1]
            
            if len(single_chars) == len(job.tags): 
                original_tags = job.tags.copy()
                
                reconstructed = ''.join(job.tags)
                logger.info(f"Job {job.id} - Reconstructed: {reconstructed}")
                
                if reconstructed.startswith('{') and reconstructed.endswith('}'):
                    clean_content = reconstructed[1:-1]  
                    
                    if clean_content.strip():
                        raw_tags = clean_content.split(',')
                        new_tags = []
                        
                        for tag in raw_tags:
                            cleaned_tag = tag.strip()
                            if cleaned_tag and len(cleaned_tag) > 1:  
                                new_tags.append(cleaned_tag)
                        
                        if new_tags:
                            job.tags = new_tags
                            fixed_count += 1
                            logger.info(f"FIXED Job {job.id}: {len(original_tags)} chars -> {new_tags}")
                        else:
                            job.tags = []
                            fixed_count += 1
                            logger.info(f"CLEARED Job {job.id}: no valid tags found")
                    else:
                        job.tags = []
                        fixed_count += 1
                        logger.info(f"CLEARED Job {job.id}: empty tags")
                
                if fixed_count % 50 == 0:
                    db.commit()
                    logger.info(f"Committed {fixed_count} fixes so far...")
        
        db.commit()
        logger.info(f"Successfully fixed {fixed_count} jobs!")
        
        logger.info("\n=== EXAMPLES OF FIXED JOBS ===")
        sample_jobs = db.query(Job).filter(Job.tags.isnot(None)).limit(5).all()
        for job in sample_jobs:
            logger.info(f"Job {job.id}: {job.tags}")
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    fix_broken_tags()
