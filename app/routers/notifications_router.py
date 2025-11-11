from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import logging
from ..features.notifications.email_service import EmailService
from ..features.summaries.summary_service import SummaryService
from .. import config
from ..database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel

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

class EmailRequest(BaseModel):
    recipients: Optional[List[str]] = None
    period_days: Optional[int] = 1
    limit: Optional[int] = 50

@router.post("/send-daily-summary")
async def send_daily_summary_email(
    request: Optional[EmailRequest] = None,
    recipients: Optional[List[str]] = Query(None),
    period_days: int = Query(default=1),
    limit: int = Query(default=50),
    db: Session = Depends(get_db)
):
    """Send daily summary email."""
    try:
        logger.info("=== STARTING DAILY SUMMARY EMAIL PROCESS ===")

        # Step 1: Create email service
        try:
            email_service = get_email_service()
            logger.info("✅ Email service created successfully")
        except Exception as e:
            logger.error(f"❌ Failed to create email service: {e}")
            raise HTTPException(status_code=500, detail=f"Email service creation failed: {str(e)}")

        # Step 2: Create summary service
        try:
            summary_service = SummaryService(db)
            logger.info("✅ Summary service created successfully")
        except Exception as e:
            logger.error(f"❌ Failed to create summary service: {e}")
            raise HTTPException(status_code=500, detail=f"Summary service creation failed: {str(e)}")

        # Step 3: Test SMTP connection
        try:
            if not email_service.test_connection():
                logger.error("❌ SMTP connection test failed")
                raise HTTPException(status_code=500, detail="SMTP connection failed")
            logger.info("✅ SMTP connection test passed")
        except Exception as e:
            logger.error(f"❌ SMTP connection test error: {e}")
            raise HTTPException(status_code=500, detail=f"SMTP connection error: {str(e)}")

        # Step 4: Determine recipients
        if request and request.recipients:
            email_recipients = request.recipients
            final_period_days = request.period_days or period_days
            final_limit = request.limit or limit
        else:
            if recipients and len(recipients) > 0 and recipients[0]:
                email_recipients = [email.strip() for email in recipients if email and email.strip() and '@' in email]
                logger.info(f"📧 Parsed recipients from query: {email_recipients}")
            else:
                email_recipients = config.get_email_recipients_list()
                logger.info(f"📧 Using default recipients: {email_recipients}")
                
            final_period_days = period_days
            final_limit = limit
        
        if not email_recipients:
            raise HTTPException(
                status_code=400, 
                detail="No recipients provided. Add recipients in request body or set DEFAULT_EMAIL_RECIPIENTS in .env"
            )
        
        # Email validation
        import re
        email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        valid_recipients = [email for email in email_recipients if email_pattern.match(email)]
        
        if not valid_recipients:
            raise HTTPException(
                status_code=400, 
                detail=f"No valid email addresses found. Provided: {email_recipients}"
            )
        
        logger.info(f"✅ Valid recipients: {valid_recipients}")

        # Step 5: Get summary data
        try:
            logger.info(f"📊 Getting summary data for {final_period_days} days, limit {final_limit}")
            summary_data = summary_service.get_daily_summary(
                period_days=final_period_days, 
                limit=final_limit
            )
            jobs_count = len(summary_data.get('jobs', []))
            logger.info(f"✅ Summary data retrieved: {jobs_count} jobs")
            
            if jobs_count == 0:
                logger.warning("⚠️ No jobs found in summary data")
                
        except Exception as e:
            logger.error(f"❌ Failed to get summary data: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to get summary data: {str(e)}")

        # Step 6: Send email
        try:
            logger.info(f"📧 Sending email to {len(valid_recipients)} recipients: {valid_recipients}")
            success = email_service.send_daily_summary(valid_recipients, summary_data)
            
            if success:
                logger.info("✅ Email sent successfully")
                return {
                    "message": f"Daily summary sent successfully to {len(valid_recipients)} recipients",
                    "recipients": valid_recipients,
                    "jobs_count": summary_data.get("summary", {}).get("total_jobs", 0),
                    "period_days": final_period_days
                }
            else:
                logger.error("❌ Email sending returned False")
                raise HTTPException(status_code=500, detail="Email sending failed - check logs")
                
        except Exception as e:
            logger.error(f"❌ Failed to send email: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
            
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"❌ Unexpected error in daily summary: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

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

@router.get("/smtp-debug")
async def smtp_debug():
    """Debug SMTP configuration for deployment."""
    return {
        "smtp_host": config.SMTP_HOST,
        "smtp_port": config.SMTP_PORT,
        "username_configured": bool(config.SMTP_USERNAME),
        "password_configured": bool(config.SMTP_PASSWORD),
        "username_preview": config.SMTP_USERNAME[:3] + "***" if config.SMTP_USERNAME else None,
        "recipients_configured": bool(config.get_email_recipients_list()),
        "recipients_count": len(config.get_email_recipients_list())
    }