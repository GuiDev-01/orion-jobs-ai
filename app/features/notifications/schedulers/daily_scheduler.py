from apscheduler.schedulers.background import BackgroundScheduler
from app.features.notifications.email_service import EmailService
from app.features.notifications.summary_generator import SummaryGenerator
from app.database import SessionLocal
from app.models.job import Job
from datetime import datetime, timedelta
import logging
import os

logger = logging.getLogger(__name__)

def send_daily_summaries():
    """Send daily job summaries via email."""
    logger.info("📧 Starting daily email summary job...")
    db = SessionLocal()
    
    try:
        # Get jobs from last 7 DAYS (for testing) - change to 1 day in production
        days_to_look_back = int(os.getenv("SUMMARY_DAYS_BACK", "7"))
        past_date = datetime.now() - timedelta(days=days_to_look_back)
        
        recent_jobs = db.query(Job).filter(
            Job.created_at >= past_date
        ).limit(50).all()

        logger.info(f"📊 Found {len(recent_jobs)} jobs from last {days_to_look_back} days")

        if not recent_jobs:
            logger.warning(f"⚠️ No jobs found in last {days_to_look_back} days")
            
            logger.info("📧 Sending email anyway with 'no jobs' message...")
            
            email_service = EmailService(
                smtp_host=os.getenv("SMTP_HOST", "smtp.sendgrid.net"),
                smtp_port=int(os.getenv("SMTP_PORT", "587")),
                username=os.getenv("SMTP_USERNAME"),
                password=os.getenv("SMTP_PASSWORD"),
                from_name=os.getenv("EMAIL_FROM_NAME", "OrionJobs AI"),
                from_address=os.getenv("EMAIL_FROM_ADDRESS", "notifications@orionjobs.me")
            )
            
            recipients_email = os.getenv("DEFAULT_EMAIL_RECIPIENTS")
            if recipients_email:
                html_content = """
                <html>
                  <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>🔍 OrionJobs Daily Summary</h1>
                    <p>No new jobs found in the last {} days.</p>
                    <p>The system is working correctly - we just haven't collected new jobs yet!</p>
                    <p style="color: #666; font-size: 12px;">Timestamp: {}</p>
                  </body>
                </html>
                """.format(days_to_look_back, datetime.now().isoformat())
                
                email_service.send_email(
                    recipients=[recipients_email],
                    subject="OrionJobs Daily Summary - No New Jobs",
                    html_content=html_content,
                    text_content=f"No new jobs found in the last {days_to_look_back} days."
                )
                logger.info(f"✅ 'No jobs' notification sent to {recipients_email}")
            
            return

        # Convert SQLAlchemy objects to dict for template
        jobs_data = [
            {
                "title": job.title,
                "company": job.company,
                "location": job.work_modality,
                "url": job.url,
                "tags": job.tags or []
            }
            for job in recent_jobs
        ]

        # Initialize services
        logger.info("🔧 Initializing email service...")
        email_service = EmailService(
            smtp_host=os.getenv("SMTP_HOST", "smtp.sendgrid.net"),
            smtp_port=int(os.getenv("SMTP_PORT", "587")),
            username=os.getenv("SMTP_USERNAME"),
            password=os.getenv("SMTP_PASSWORD"),
            from_name=os.getenv("EMAIL_FROM_NAME", "OrionJobs AI"),
            from_address=os.getenv("EMAIL_FROM_ADDRESS", "notifications@orionjobs.me")
        )
        
        template_dir = "app/features/notifications/templates"

        logger.info(f"Template directory: {template_dir}")

        summary_generator = SummaryGenerator(
            template_dir=template_dir
        )

        # Default preferences for demo/testing
        default_preferences = {
            "location": "remote",
            "tags": ["python", "javascript", "react", "java"]
        }

        logger.info("📝 Generating email summary...")
        summary = summary_generator.generate_summary(jobs_data, default_preferences)
        
        # Send to demo email (from environment variable)
        recipients_email = os.getenv("DEFAULT_EMAIL_RECIPIENTS")
        
        if not recipients_email:
            logger.error("❌ DEFAULT_EMAIL_RECIPIENTS not configured in .env")
            return
        
        logger.info(f"📤 Sending email to {recipients_email}...")
        email_service.send_email(
            recipients=[recipients_email],
            subject=f"OrionJobs Daily Summary - {len(jobs_data)} Jobs Found",
            html_content=summary["html"],
            text_content=summary["text"]
        )
        
        logger.info(f"✅ Daily summary sent successfully to {recipients_email}")

    except Exception as e:
        logger.error(f"❌ Failed to send daily summaries: {e}", exc_info=True)
    finally:
        db.close()

def start_scheduler():
    """Start the daily summary scheduler."""
    scheduler = BackgroundScheduler()
    
    # Run every day at 9 AM UTC
    scheduler.add_job(
        send_daily_summaries,
        "cron",
        hour=9,
        minute=0,
        id="daily_email_summary",
        name="Send Daily Email Summary",
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("📅 Email scheduler started - will run daily at 9:00 AM UTC")
    
    return scheduler