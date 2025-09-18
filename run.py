import sys
import os
from app.services.remoteok_service import fetch_remote_jobs, normalize_remote_jobs
from app.database import SessionLocal
from app.services.remoteok_service import save_jobs_to_db

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_remoteok_integration():
    
    print("Testing integration with RemoteOK API")
    raw_jobs = fetch_remote_jobs()
    print(f"Raw jobs found: {len(raw_jobs)}")
    
    normalized_jobs = normalize_remote_jobs(raw_jobs)
    print(f"Normalized jobs: {len(normalized_jobs)}")
    
    db = SessionLocal()
    try:
        save_jobs_to_db(normalized_jobs, db)
        print("Jobs saved to database successfully!")
    finally:
        db.close()
        
    for job in normalized_jobs[:5]:
        print(f"ID: {job['id']}, Title: {job['title']}, Company: {job['company']}, Work Modality: {job['work_modality']}")
        
if __name__ == "__main__":
    #Check if the script is running in test mode
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_remoteok_integration()
    else:
        import uvicorn
        uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
