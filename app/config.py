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
        DATABASE_URL += "&connect_timeout=10&command_timeout=60"
    else:
        DATABASE_URL += "?sslmode=require&connect_timeout=10&command_timeout=60"

# API keys for job services
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY")

# Collection settings
COLLECT_MAX_PAGES = int(os.getenv("COLLECT_MAX_PAGES", "3"))
COLLECT_SLEEP_SECONDS = float(os.getenv("COLLECT_SLEEP_SECONDS", "1.5"))
COLLECT_ADZUNA_MAX_REQUESTS = int(os.getenv("COLLECT_ADZUNA_MAX_REQUESTS", "30"))

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