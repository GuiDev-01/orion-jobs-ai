<<<<<<< HEAD
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.job import Job
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_broken_tags():
    db = SessionLocal()
    try:
=======
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
>>>>>>> d19e04434f073371540ca667b51000824c042575
        jobs = db.query(Job).all()
        logger.info(f"Found {len(jobs)} jobs to check")
        
        fixed_count = 0
<<<<<<< HEAD
        
        for job in jobs:
            if not job.tags or not isinstance(job.tags, list):
                continue
                
            # Verifica se todas as tags são caracteres únicos (problema identificado)
            single_chars = [t for t in job.tags if isinstance(t, str) and len(t) == 1]
            
            if len(single_chars) == len(job.tags):  # 100% são caracteres únicos
                original_tags = job.tags.copy()
                
                # Reconstroi a string original
                reconstructed = ''.join(job.tags)
                logger.info(f"Job {job.id} - Reconstructed: {reconstructed}")
                
                # Remove as chaves no início e fim
                if reconstructed.startswith('{') and reconstructed.endswith('}'):
                    clean_content = reconstructed[1:-1]  # Remove { e }
                    
                    # Divide por vírgulas para obter as tags individuais
                    if clean_content.strip():
                        raw_tags = clean_content.split(',')
                        new_tags = []
                        
                        for tag in raw_tags:
                            cleaned_tag = tag.strip()
                            if cleaned_tag and len(cleaned_tag) > 1:  # Ignora tags muito pequenas
                                new_tags.append(cleaned_tag)
                        
                        if new_tags:
                            job.tags = new_tags
                            fixed_count += 1
                            logger.info(f"FIXED Job {job.id}: {len(original_tags)} chars -> {new_tags}")
                        else:
                            # Se não conseguiu extrair tags válidas, deixa vazio
                            job.tags = []
                            fixed_count += 1
                            logger.info(f"CLEARED Job {job.id}: no valid tags found")
                    else:
                        # String vazia entre {}, limpa as tags
                        job.tags = []
                        fixed_count += 1
                        logger.info(f"CLEARED Job {job.id}: empty tags")
                
                # Commit a cada 50 jobs para não perder progresso
                if fixed_count % 50 == 0:
                    db.commit()
                    logger.info(f"Committed {fixed_count} fixes so far...")
        
        # Commit final
        db.commit()
        logger.info(f"Successfully fixed {fixed_count} jobs!")
        
        # Mostra alguns exemplos do resultado
        logger.info("\n=== EXAMPLES OF FIXED JOBS ===")
        sample_jobs = db.query(Job).filter(Job.tags.isnot(None)).limit(5).all()
        for job in sample_jobs:
            logger.info(f"Job {job.id}: {job.tags}")
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        db.rollback()
        raise
=======
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
>>>>>>> d19e04434f073371540ca667b51000824c042575
    finally:
        db.close()

if __name__ == "__main__":
<<<<<<< HEAD
    fix_broken_tags()
=======
    fix_tags_in_database()
>>>>>>> d19e04434f073371540ca667b51000824c042575
