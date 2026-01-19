import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal
from app.models.job import Job
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def debug_tags():
    db = SessionLocal()
    try:
        jobs = db.query(Job).limit(10).all()
        
        for job in jobs:
            print(f"\n--- Job {job.id}: {job.title[:50]}... ---")
            print(f"Tags type: {type(job.tags)}")
            print(f"Tags value: {repr(job.tags)}")
            print(f"Tags length: {len(job.tags) if job.tags else 0}")
            
            if job.tags and isinstance(job.tags, list) and len(job.tags) > 0:
                print(f"First tag: {repr(job.tags[0])} (type: {type(job.tags[0])})")
                print(f"First tag length: {len(job.tags[0]) if job.tags[0] else 0}")
                
                single_chars = [t for t in job.tags if isinstance(t, str) and len(t) == 1]
                print(f"Single char tags: {len(single_chars)}/{len(job.tags)}")
                
            print("=" * 60)
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_tags()