from typing import List, Dict, Optional
from sqlalchemy.orm import Session
<<<<<<< HEAD
from sqlalchemy import func, or_, String
from app.models.job import Job
from datetime import datetime, timedelta
from collections import Counter
import logging
import json

logging.basicConfig(level=logging.INFO)
=======
from sqlalchemy import func, text, or_
from app.models.job import Job
from datetime import datetime, timedelta
from collections import Counter
>>>>>>> d19e04434f073371540ca667b51000824c042575

class SummaryService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_daily_summary(
        self, 
        location: Optional[str] = None,
        tags: Optional[List[str]] = None,
        period_days: int = 1,
        limit: int = 50
    ) -> Dict:
        """Get daily job summary with filters."""
        
        try:
<<<<<<< HEAD
            logging.info(f"Filters applied: location={location}, tags={tags}, period_days={period_days}, limit={limit}")            
            
=======
>>>>>>> d19e04434f073371540ca667b51000824c042575
            # Date filter
            since_date = datetime.now() - timedelta(days=period_days)
            query = self.db.query(Job).filter(Job.created_at >= since_date)
            
            # Apply location filter using work_modality
            if location and location.strip():
                query = query.filter(
                    func.lower(Job.work_modality).like(f"%{location.lower()}%")
                )
            
<<<<<<< HEAD
            # Apply tags filter 
            if tags and len(tags) > 0:
                clean_tags = [tag.strip().lower() for tag in tags if tag.strip()]
                if clean_tags: 
                    tag_conditions = []
                    for tag in clean_tags:
                        tag_conditions.append(func.lower(func.cast(Job.tags, String)).like(f"%{tag}%"))
                    query = query.filter(or_(*tag_conditions))
            
            jobs = query.order_by(Job.created_at.desc()).limit(limit).all()
            
            logging.info(f"Jobs found after query: {len(jobs)}")

            # Fallback
            if not jobs:
                logging.info("No jobs found. Expanding search period to 7 days.")
                since_date = datetime.now() - timedelta(days=7)
                query = self.db.query(Job).filter(Job.created_at >= since_date)
                
                if location and location.strip():
                    query = query.filter(
                        func.lower(Job.work_modality).like(f"%{location.lower()}%")
                    )
                
                if tags and len(tags) > 0:
                    clean_tags = [tag.strip().lower() for tag in tags if tag.strip()]
                    if clean_tags:
                        tag_conditions = []
                        for tag in clean_tags:
                            tag_conditions.append(func.lower(func.cast(Job.tags, String)).like(f"%{tag}%"))
                        query = query.filter(or_(*tag_conditions))
                
                jobs = query.order_by(Job.created_at.desc()).limit(limit).all()            

=======
            # Apply tags filter
            if tags and len(tags) > 0:
                clean_tags = [tag.strip().lower() for tag in tags if tag.strip()]
                if clean_tags:
                    # Execute query without complex array operations
                    jobs = query.limit(limit).all()
                    
                    # Filter in Python instead of SQL for compatibility
                    filtered_jobs = []
                    for job in jobs:
                        if not job.tags:
                            continue
                            
                        job_tags = [t.lower() for t in job.tags if isinstance(t, str)]
                        if any(tag in job_tags for tag in clean_tags):
                            filtered_jobs.append(job)
                            
                    # Replace jobs with filtered list
                    jobs = filtered_jobs[:limit]
                else:
                    jobs = query.limit(limit).all()
            else:
                # No tag filtering
                jobs = query.limit(limit).all()
            
>>>>>>> d19e04434f073371540ca667b51000824c042575
            # Generate analytics
            total_jobs = len(jobs)
            companies = list(set([job.company for job in jobs if job.company]))
            work_modalities = list(set([job.work_modality for job in jobs if job.work_modality]))
            
<<<<<<< HEAD
            # Process tags correctly
            all_tags = []
            for job in jobs:
                parsed_tags = self._parse_job_tags(job.tags)
                all_tags.extend(parsed_tags)
=======
            # Most common tags
            all_tags = []
            for job in jobs:
                if job.tags and isinstance(job.tags, list):
                    all_tags.extend([tag for tag in job.tags if tag])
>>>>>>> d19e04434f073371540ca667b51000824c042575
            
            top_tags = Counter(all_tags).most_common(10) if all_tags else []
            
            return {
                "summary": {
                    "total_jobs": total_jobs,
                    "period_days": period_days,
                    "filters_applied": {
                        "location_filter": location,
                        "tags": tags,
                        "limit": limit
                    },
                    "top_companies": companies[:10],
<<<<<<< HEAD
                    "work_modalities": work_modalities,
=======
                    "work_modalities": work_modalities[:10],
>>>>>>> d19e04434f073371540ca667b51000824c042575
                    "top_skills": [{"skill": tag, "count": count} for tag, count in top_tags]
                },
                "jobs": [
                    {
                        "id": job.id,
                        "title": job.title,
                        "company": job.company,
                        "work_modality": job.work_modality,
                        "url": job.url,
<<<<<<< HEAD
                        "tags": self._parse_job_tags(job.tags),
=======
                        "tags": job.tags or [],
>>>>>>> d19e04434f073371540ca667b51000824c042575
                        "created_at": job.created_at.isoformat() if job.created_at else None
                    }
                    for job in jobs
                ]
            }
            
        except Exception as e:
            import traceback
<<<<<<< HEAD
            logging.error(f"Summary error: {str(e)}")
            logging.error(traceback.format_exc())
=======
            print(f"Summary error: {str(e)}")
            print(traceback.format_exc())
>>>>>>> d19e04434f073371540ca667b51000824c042575
            return {
                "error": f"Summary generation failed: {str(e)}",
                "summary": {
                    "total_jobs": 0,
                    "period_days": period_days,
                    "filters_applied": {
                        "location_filter": location,
                        "tags": tags,
                        "limit": limit
                    },
                    "top_companies": [],
                    "work_modalities": [],
                    "top_skills": []
                },
                "jobs": []
<<<<<<< HEAD
            }
    
    def _parse_job_tags(self, tags) -> List[str]:
        """Helper method to parse job tags consistently"""
        if not tags:
            return []
        
        if isinstance(tags, list):
            return [str(tag).strip() for tag in tags if tag and str(tag).strip() and len(str(tag).strip()) > 1]
        
        if isinstance(tags, str):
            try:
                parsed = json.loads(tags)
                if isinstance(parsed, list):
                    return [str(tag).strip() for tag in parsed if tag and str(tag).strip() and len(str(tag).strip()) > 1]
            except:
                return [tag.strip() for tag in tags.split(',') if tag.strip() and len(tag.strip()) > 1]
        
        return []
=======
            }
>>>>>>> d19e04434f073371540ca667b51000824c042575
