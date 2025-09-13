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