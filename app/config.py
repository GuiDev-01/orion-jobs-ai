import os
import logging
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

logging.getLogger("urllib3.connectionpool").setLevel(logging.WARNING)
# Environment (development, testing, production)
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///default.db")

if "neon.tech" in DATABASE_URL:
    if "?" in DATABASE_URL:
        # Remove command_timeout if it exists
        if "command_timeout" in DATABASE_URL:
            DATABASE_URL += "&connect_timeout=10"
        if "application_name" not in DATABASE_URL:
            DATABASE_URL += "&application_name=orionjobs" 
    else:
        DATABASE_URL += "?sslmode=require&connect_timeout=10&application_name=orionjobs"

# API keys for job services
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY")

# Collection settings
COLLECT_MAX_PAGES = int(os.getenv("COLLECT_MAX_PAGES", "3"))
COLLECT_SLEEP_SECONDS = float(os.getenv("COLLECT_SLEEP_SECONDS", "1.5"))
COLLECT_ADZUNA_MAX_REQUESTS = int(os.getenv("COLLECT_ADZUNA_MAX_REQUESTS", "30"))

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "OrionJobs AI")
DEFAULT_EMAIL_RECIPIENTS = os.getenv("DEFAULT_EMAIL_RECIPIENTS", "")

def get_email_recipients_list() -> list:
    """Convert comma separated email strings to list."""
    if not DEFAULT_EMAIL_RECIPIENTS:
        return []
    return [email.strip() for email in DEFAULT_EMAIL_RECIPIENTS.split(",")]

# Logging configuration
LOG_LEVEL = "DEBUG" if ENVIRONMENT != "production" else "INFO"
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Cache settings
CACHE_TTL = int(os.getenv("CACHE_TTL", "86400"))  # 24 hours default

# Azure specific configurations
AZURE_INSIGHTS_CONNECTION_STRING = os.getenv("AZURE_INSIGHTS_CONNECTION_STRING")