from app.database import SessionLocal
from app.models import Job

# Multiple insertions 
jobs = [
    Job(title="Backend Developer", company="TechCorp", work_modality="remote"),
    Job(title="Data Scientist", company="DataInc", work_modality="on-site"),
    Job(title="DevOps Engineer", company="CloudCorp", work_modality="hybrid"),
    Job(title="Software Engineer JR", company="Uber", work_modality="remote")
]

# Automatically handles session cleanup
with SessionLocal() as session:
    session.add_all(jobs)
    session.commit()
    print(f"Created {len(jobs)} jobs!")
    
# READ operations
print("\n=== READ OPERATIONS ===")

with SessionLocal() as session:
    # Get all jobs
    all_jobs = session.query(Job).all()
    print(f"Total jobs in database: {len(all_jobs)}")
    
    # Filter work by modality
    remote_jobs = session.query(Job).filter(Job.work_modality == "remote").all()
    print(f"Remote jobs: {len(remote_jobs)}")
    
    # Get especifig job by ID
    job_1 = session.query(Job).filter(Job.id == 1).first()
    if job_1:
        print(f"Job 1: {job_1.title} at {job_1.company}")
        
print("\n=== UPDATE OPERATIONS ===")

with SessionLocal() as session:
    # Find job to update
    job_to_update = session.query(Job).filter(Job.id == 1).first()
    
    if job_to_update:
        print(f"Before update: {job_to_update.title} at {job_to_update.company}")
        
        # Update fields
        job_to_update.title = "Senior Data Analyst"
        job_to_update.work_modality = "hybrid" 
        
        # Save changes
        session.commit()
        print(f"After update: {job_to_update.title} at {job_to_update.company} ({job_to_update.work_modality})")
    else:
        print("Job not found for update")
        
print("\n=== DELETE OPERATIONS ===")

with SessionLocal() as session:
    # Count before delete
    count_before = session.query(Job).count()
    print(f"Jobs before delete: {count_before}")
    
    # Find and delete job
    job_to_delete = session.query(Job).filter(Job.id == 2).first()
    
    if job_to_delete: 
        print(f"Deleting: {job_to_delete.title} at {job_to_delete.company}")
        session.delete(job_to_delete)
        session.commit()
        
        # Count after delete
        count_after = session.query(Job).count()
        print(f"Jobs after delete: {count_after}")
    
    else:
        print("Job not found for deletion")