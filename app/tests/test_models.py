import unittest
from app.models.job import Job

class TestJobModel(unittest.TestCase):
    
    def test_job_creation(self):
        """Test creating a new Job instance"""
        job = Job(
            id=12345,
            title="Software Engineer",
            company="Tech Company",
            work_modality="Remote",
            tags=["python", "fastapi"],
            url="https://example.com/job",
            created_at="2025-09-18T10:00:00Z"
        )
        
        self.assertEqual(job.id, 12345)
        self.assertEqual(job.title, "Software Engineer")
        self.assertEqual(job.company, "Tech Company")
        self.assertEqual(job.work_modality, "Remote")
        self.assertEqual(job.tags, ["python", "fastapi"])
        self.assertEqual(job.url, "https://example.com/job")
        self.assertEqual(job.created_at, "2025-09-18T10:00:00Z")
    
    def test_job_representation(self):
        """Test job attributes instead of string representation"""
        job = Job(
            id=12345,
            title="Software Engineer",
            company="Tech Company"
        )
        
        # Test attributes directly instead of string representation
        self.assertEqual(job.id, 12345)
        self.assertEqual(job.title, "Software Engineer")
        self.assertEqual(job.company, "Tech Company")

if __name__ == '__main__':
    unittest.main()