import sys
import os
import uvicorn
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
        save_jobs_to_db(normalized_jobs[:10], db)
        print("✅ Jobs saved to database successfully!")
    finally:
        db.close()
    
    # Show sample jobs    
    for job in normalized_jobs[:5]:
        print(f"ID: {job['id']}, Title: {job['title']}, Company: {job['company']}, Work Modality: {job['work_modality']}")
    return True    
        
def test_adzuna_integration():
    """Test integration with Adzuna API"""
    try:
        print("Testing Adzuna integration...")
        from app.services.adzuna_service import fetch_adzuna_jobs, normalize_adzuna_jobs
        
        queries = ["developer", "python", "javascript", "react", "node", "fullstack", "backend", "frontend" ]
        countries = ["gb", "us", "ca", "au"]
        
        all_normalized_jobs = []
        
        for country in countries:
            print(f"\n📍 Collecting jobs from {country.upper()}...")
            
            for query in queries:
                try:
                    print(f"   🔍 Searching for {query} jobs...")
                    raw_jobs = fetch_adzuna_jobs(
                        country=country,
                        query=query,
                        results_per_page=50,
                        salary_min=30000 if country in ["gb", "us", "ca", "au"] else None
                    )
                    
                    if raw_jobs:
                        normalized_jobs = normalize_adzuna_jobs(raw_jobs)
                        all_normalized_jobs.extend(normalized_jobs)
                        print(f"   ✅ Found {len(normalized_jobs)} jobs for {query} in {country.upper()}")
                except Exception as query_error:
                    print(f"   ❌ Error searching '{query}' in {country.upper()}: {query_error}")
                continue
                
        unique_jobs = {}
        for job in all_normalized_jobs:
            unique_jobs[job['id']] = job
            
        final_jobs = list(unique_jobs.values())
        
        print(f"\n🎯 TOTAL RESULTS:")
        print(f"   📊 Total jobs collected: {len(all_normalized_jobs)}")
        print(f"   🔥 Unique jobs (after deduplication): {len(final_jobs)}")
        
        if final_jobs:
            db = SessionLocal()
            try:
                save_jobs_to_db(final_jobs, db)
                print(f"   💾 {(len(final_jobs))} jobs saved to database")
            except Exception as save_error:
                print(f"   ⚠️ Error saving to database: {save_error}")
            finally:
                db.close()
        
        print(f" \n📋 Sample of collected jobs:")
        for i, job in enumerate(final_jobs[:5], 1):
            print(f"   {i}. ID: {job['id']}, Title: {job['title']}, Company: {job['company']}")
                 
        print(f"\n Adzuna: Successfully collected {len(final_jobs)} unique jobs!")
        return True
    
    except Exception as e:
        print(f"❌ Adzuna integration failed: {e}")
        
def run_tests():
    """Run all integration tests"""
    print("🧪 Running integration tests...")
    print('-' * 60)
    
    remote_ok = test_remoteok_integration()
    print('-' *60)
    adzuna_ok = test_adzuna_integration()
    print('-' *60)
    
    
    if remote_ok and adzuna_ok:
        print("✅ All integration tests passed!")
        return True
    else:
        print("❌ Some integration tests failed!")
        return False

if __name__ == "__main__":
    # Check if running in test mode
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        # Just run tests
        run_tests()
    else:
        # Run tests firsts, then start server
        print("🔧 OrionJobs AI - Starting Integration Tests")
        tests_passed = run_tests()
        
        if tests_passed:
            print("\n All tests passed! Starting OrionJobs AI server...")
        else:
            print("\n⚠️ Some tests failed, but starting server anyway...")
        
        # Start server
        uvicorn.run("app:main.app", host="0.0.0.0", port=8000, reload=True)
            
