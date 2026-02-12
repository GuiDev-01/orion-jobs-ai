FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev \
        postgresql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY alembic.ini .
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY run.py .
COPY job_schedule.py .
COPY startup.sh .

# Create non-root user and set ownership
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app && \
    chmod +x /app/startup.sh

# Switch to non-root user
USER appuser

EXPOSE 8000

# Use startup script that handles Azure PORT variable
CMD ["./startup.sh"]
