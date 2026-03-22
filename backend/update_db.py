import sys
sys.path.append('.')
from app.database import SessionLocal
from app.models.job import Job
from sqlalchemy import update
db = SessionLocal()
res = db.execute(update(Job).values(
    description='Welcome to your future career! Here is a detailed description of the exciting role you are applying for. The company offers a wide range of benefits, remote work capability, and an inclusive culture. The ideal candidate will have strong technical foundations, an appetite for solving complex problems, and the ability to work independently in a fast-paced environment. Key responsibilities include designing distributed systems, ensuring high performance, and mentoring junior developers.',
    location='Remote'
))
db.commit()
print(f'Rows updated: {res.rowcount}')
