from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import logging
from ..features.notifications.email_service import EmailService
from ..features.summaries.summary_service import SummaryService
from .. import config
from ..database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])
logger = logging.getLogger(__name__)

def get_email_service():
    """Get configured email service."""
    return EmailService(
        smtp_server=config.SMTP_HOST,
        smtp_port=config.SMTP_PORT,
        username=config.SMTP_USERNAME,
        password=config.SMTP_PASSWORD
    )

@router.post("/test-email")
async def test_email_service(recipients: Optional[List[str]] = None):
    """Test email service configuration."""
    try:
        email_service = get_email_service()
        
        # Test SMTP connection
        if not email_service.test_connection():
            raise HTTPException(status_code=500, detail="SMTP connection failed")
        
        # Use provided recipients or default ones
        test_recipients = recipients or config.get_email_recipients_list()
        if not test_recipients:
            raise HTTPException(status_code=400, detail="No recipients provided. Set DEFAULT_EMAIL_RECIPIENTS in .env or provide recipients in request")
        
        # Send test email
        html_content = "<h1>🚀 OrionJobs AI Email Test</h1><p>Email service is working correctly! ✅</p>"
        text_content = "🚀 OrionJobs AI Email Test\n\nEmail service is working correctly! ✅"
        
        success = email_service.send_email(
            recipients=test_recipients,
            subject="OrionJobs AI - Email Service Test",
            html_content=html_content,
            text_content=text_content
        )
        
        if success:
            return {
                "message": f"Test email sent successfully to {len(test_recipients)} recipients",
                "recipients": test_recipients
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send test email")
            
    except Exception as e:
        logger.error(f"Email test failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-daily-summary")
async def send_daily_summary_email(
    recipients: Optional[List[str]] = Query(None), 
    period_days: int = Query(default=1),
    limit: int = Query(default=50),
    db: Session = Depends(get_db)
):
    """Send daily summary email."""
    try:
        email_service = get_email_service()
        summary_service = SummaryService(db)
        
        # Get daily summary data
        summary_data = summary_service.get_daily_summary(
            period_days=period_days, 
            limit=limit
        )
        
        # Use provided recipients or default ones
        email_recipients = recipients or config.get_email_recipients_list()
            
        if not email_recipients:
            raise HTTPException(
                status_code=400, 
                detail="No recipients provided. Use ?recipients=email@example.com or set DEFAULT_EMAIL_RECIPIENTS in .env"
            )
        
        # Send summary email
        success = email_service.send_daily_summary(email_recipients, summary_data)
        
        if success:
            return {
                "message": f"Daily summary sent successfully to {len(email_recipients)} recipients",
                "recipients": email_recipients,
                "jobs_count": summary_data.get("summary", {}).get("total_jobs", 0),
                "period_days": period_days
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send daily summary")
            
    except Exception as e:
        logger.error(f"Failed to send daily summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/email-config")
async def get_email_config():
    """Get current email configuration (without sensitive data)."""
    return {
        "smtp_host": config.SMTP_HOST,
        "smtp_port": config.SMTP_PORT,
        "email_from_name": config.EMAIL_FROM_NAME,
        "default_recipients_count": len(config.get_email_recipients_list()),
        "smtp_configured": bool(config.SMTP_USERNAME and config.SMTP_PASSWORD)
    }