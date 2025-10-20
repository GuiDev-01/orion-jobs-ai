from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, text, or_
from app.models.job import Job
from datetime import datetime, timedelta
from collections import Counter

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
            # Date filter
            since_date = datetime.now() - timedelta(days=period_days)
            query = self.db.query(Job).filter(Job.created_at >= since_date)
            
            # Apply location filter using work_modality
            if location and location.strip():
                query = query.filter(
                    func.lower(Job.work_modality).like(f"%{location.lower()}%")
                )
            
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
            
            # Generate analytics
            total_jobs = len(jobs)
            companies = list(set([job.company for job in jobs if job.company]))
            work_modalities = list(set([job.work_modality for job in jobs if job.work_modality]))
            
            # Most common tags
            all_tags = []
            for job in jobs:
                if job.tags and isinstance(job.tags, list):
                    all_tags.extend([tag for tag in job.tags if tag])
            
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
                    "work_modalities": work_modalities[:10],
                    "top_skills": [{"skill": tag, "count": count} for tag, count in top_tags]
                },
                "jobs": [
                    {
                        "id": job.id,
                        "title": job.title,
                        "company": job.company,
                        "work_modality": job.work_modality,
                        "url": job.url,
                        "tags": job.tags or [],
                        "created_at": job.created_at.isoformat() if job.created_at else None
                    }
                    for job in jobs
                ]
            }
            
        except Exception as e:
            import traceback
            print(f"Summary error: {str(e)}")
            print(traceback.format_exc())
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
            }