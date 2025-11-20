from apscheduler.schedulers.background import BackgroundScheduler
from app.features.notifications.email_service import EmailService
from app.features.notifications.summary_generator import SummaryGenerator
from app.database import SessionLocal
from app.models.job import Job
from app.services.remoteok_service import fetch_remote_jobs, normalize_remote_jobs
from app.services.cache_service import get_cached_response
import os
from datetime import datetime, timedelta

def send_daily_summaries():
    """Send daily job summaries via email (without user persistence)."""
    db = SessionLocal()
    try:
        # Get jobs from last 24 hours
        yesterday = datetime.now() - timedelta(days=1)
        recent_jobs = db.query(Job).filter(
            Job.created_at >= yesterday
        ).limit(50).all()

        if not recent_jobs:
            print("No recent jobs found for daily summary")
            return

        # Convert SQLAlchemy objects to dict for template
        jobs_data = [
            {
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "url": job.url,
                "tags": job.tags or []
            }
            for job in recent_jobs
        ]

        # Initialize services
        email_service = EmailService(
            smtp_host=os.getenv("SMTP_SERVER", "smtp.gmail.com"),
            smtp_port=int(os.getenv("SMTP_PORT", "587")),
            username=os.getenv("SMTP_USERNAME"),
            password=os.getenv("SMTP_PASSWORD")
        )
        
        summary_generator = SummaryGenerator(
            template_dir="app/features/notifications/templates"
        )

        # Default preferences for demo/testing
        default_preferences = {
            "location": "remote",
            "tags": ["python", "javascript", "react"]
        }

        # Generate summary
        summary = summary_generator.generate_summary(jobs_data, default_preferences)
        
        # Send to demo email (from environment variable)
        demo_email = os.getenv("DEMO_EMAIL")
        if demo_email:
            email_service.send_email(
                recipients=[demo_email],
                subject=f"OrionJobs Daily Summary - {len(jobs_data)} New Jobs",
                html_content=summary["html"],
                text_content=summary["text"]
            )
            print(f"Daily summary sent to {demo_email}")
        else:
            print("No DEMO_EMAIL configured - summary generated but not sent")

    except Exception as e:
        print(f"Failed to send daily summaries: {e}")
    finally:
        db.close()

def start_scheduler():
    """Start the daily summary scheduler."""
    scheduler = BackgroundScheduler()
    # Run every day at 9 AM
    scheduler.add_job(send_daily_summaries, "cron", hour=9, minute=0)
    scheduler.start()
    print("Daily summary scheduler started - will run at 9:00 AM daily")