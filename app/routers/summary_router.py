from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.features.summaries.summary_service import SummaryService

router = APIRouter(prefix="/api/v1/summary", tags=["summaries"])

@router.get("/daily")
async def get_daily_summary(
    location: Optional[str] = Query(None, description="Filter by work modality (remote, hybrid, onsite)"),
    tags: Optional[List[str]] = Query(None, description="Filter by skills/tags"),
    period_days: int = Query(1, ge=1, le=30, description="Days to look back"),
    limit: int = Query(50, ge=1, le=200, description="Max jobs to return"),
    format: str = Query("json", description="Response format: json, telegram, discord"),
    db: Session = Depends(get_db)
):
    """Get daily job summary with smart filtering.
    
    Note: 'location' parameter actually filters by work_modality field 
    (remote, hybrid, onsite) since the Job model doesn't have a location field.
    """

    summary_service = SummaryService(db)
    data = summary_service.get_daily_summary(
        location=location,
        tags=tags,
        period_days=period_days,
        limit=limit
    )

    if format == "json":
        return data
    elif format == "telegram":
        return {"message": "Telegram format coming soon", "data": data}
    elif format == "discord":
        return {"message": "Discord format coming soon", "data": data}
    else:
        return {"error": "Invalid format. Use: json, telegram, or discord"}

@router.get("/recent")
async def get_recent_jobs(
    limit: int = Query(50, ge=1, le=200, description="Max jobs to return"),
    db: Session = Depends(get_db)
):
    """Get recent jobs without filters"""
    summary_service = SummaryService(db)
    data = summary_service.get_daily_summary(period_days=30, limit=limit)
    return data