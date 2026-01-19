import sys
import os

# Ensure project root is on sys.path so `from app...` imports work when
# running this script directly (python app/scripts/db_report.py)
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import SessionLocal
from app.models.job import Job
from sqlalchemy import func


def main():
    with SessionLocal() as db:
        try:
            total = db.query(func.count(Job.id)).scalar()
        except Exception:
            total = None

        try:
            null_created = db.query(func.count(Job.id)).filter(Job.created_at == None).scalar()
        except Exception:
            null_created = None

        try:
            recent = db.query(Job).order_by(Job.created_at.desc()).limit(10).all()
        except Exception:
            recent = []

        print("=== DATABASE JOBS REPORT ===")
        print(f"Total jobs: {total}")
        print(f"Jobs with NULL created_at: {null_created}")
        print("\nSample recent jobs (up to 10):")
        if not recent:
            print("  No sample rows available or query failed.")
        for j in recent:
            print(f"  ID: {getattr(j, 'id', None)}, title: {getattr(j, 'title', None)}, company: {getattr(j, 'company', None)}, created_at: {getattr(j, 'created_at', None)}")


if __name__ == '__main__':
    main()
