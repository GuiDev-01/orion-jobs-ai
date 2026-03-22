from app.database import SessionLocal
from app.models.job import Job
from app.models.cache import APICache

def reset_db():
    db = SessionLocal()
    count_jobs = db.query(Job).delete()
    count_cache = db.query(APICache).delete()
    db.commit()
    print(f"Limpeza concluída: {count_jobs} vagas deletadas, {count_cache} caches deletados.")
    db.close()

if __name__ == "__main__":
    reset_db()
