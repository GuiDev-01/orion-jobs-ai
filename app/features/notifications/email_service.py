import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, smtp_server: str, smtp_port: int, username: str, password: str):
        self.smtp_server= smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password

        # Setup Jinja2 template environment
        template_dir = Path(__file__).parent / "templates"
        self.jinja_env = Environment(loader=FileSystemLoader(str(template_dir)))

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def send_email(self, recipients: List[str], subject: str, html_content: str, text_content: str):
        """Send an email to a list of recipients  with retry logic."""
        try:
            # Create the email
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.username
            msg["To"] = ", ".join(recipients)

            #Attach both plain text and HTML versions
            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            # Connect to SMTP server and send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.sendmail(self.username, recipients, msg.as_string())

            logger.info(f"Email sent successfully to {len(recipients)} recipients")
            return True
        
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            raise

    def render_template(self, template_name: str, context: dict) -> str:
        """Render a Jinja2 template with given context."""
        try:
            template = self.jinja_env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            logger.error(f"Failed to render template {template_name}: {e}")
            raise
    
    def send_daily_summary(self, recipients: List[str], summary_data: dict):
        """Send daily job summary using templates."""
        try:
            # Prepare context for templates 
            context = {
                "jobs": summary_data.get("jobs",[]),
                "summary": summary_data.get("summary", {}),
                "total_jobs": summary_data.get("summary", {}).get("total_jobs",0),
                "top_companies": summary_data.get("summary", {}).get("top_companies", []),
                "top_skills": summary_data.get("summary", {}).get("top_skills", []),
                "work_modalities": summary_data.get("summary", {}).get("work_modalities", [])
            }

            logger.info(f"Template context prepared. Total jobs: {context['total_jobs']}")

            # Render templates
            logger.info("Rendering HTML template")
            html_content = self.render_template("daily_summary.html", context)
            logger.info(f"HTML template rendered successfully")

            logger.info("Rendering text template")
            text_content = self.render_template("daily_summary.txt", context)
            logger.info("Text template rendered successfully")

            # Create subject
            total_jobs = context["total_jobs"]
            subject = f"OrionJobs AI - Daily Summary: {total_jobs} New Opportunities"
            logger.info(f"Subject created: {subject}")

            #Send email
            logger.info("Sending email")
            result = self.send_email(recipients, subject, html_content, text_content)
            logger.info(f"Email send result: {result}")
            return result
        
        except Exception as e:
            logger.error(f"Failed to send daily summary: {e}")
            return False 
        
    async def send_daily_summary_async(self, recipients: List[str], summary_data: dict):
        """Async version of send_daily_summary."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.send_daily_summary, recipients, summary_data)
    
    def test_connection(self) -> bool:
        """Test SMTP connection."""
        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.username, self.password)
            logger.info("SMTP connection test successful")
            return True
        except Exception as e:
            logger.error(f"SMTP connection test failed: {e}")
            return False