import unittest
from unittest.mock import patch, MagicMock
from app.services.remoteok_service import fetch_remote_jobs, normalize_remote_jobs, save_jobs_to_db
from app.models.job import Job

class TestRemoteokService(unittest.TestCase):
    
    @patch('app.services.remoteok_service.requests.get')
    def test_fetch_remote_jobs_success(self, mock_get):
        # Setup mock response
        mock_response = MagicMock()
        # Adicionar um item "cabeçalho" no início para simular o formato real da API
        mock_response.json.return_value = [
            {"api_docs": "This is the API documentation"},  # Este primeiro item será ignorado
            {"id": "1", "position": "Developer", "company": "Test Inc"},
            {"id": "2", "position": "Designer", "company": "Creative Co"}
        ]
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        # Call the function
        result = fetch_remote_jobs()
        
        # Assert results
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["position"], "Developer")
        self.assertEqual(result[1]["company"], "Creative Co")
        
    @patch('app.services.remoteok_service.requests.get')
    def test_fetch_remote_jobs_error(self, mock_get):
        # Setup mock to raise exception
        mock_get.side_effect = Exception("API error")
        try:
            result = fetch_remote_jobs()
            self.assertEqual(result, [])
        except Exception as e:
            self.fail(f"fetch_remote_jobs não tratou a exceção: {e}")
        
    def test_normalize_remote_jobs(self):
        # Sample raw jobs
        raw_jobs = [
            {
                "id": "123",
                "position": "Python Developer",
                "company": "Test Company",
                "tags": ["python", "django"],
                "url": "https://example.com/job/123",
                "date": "2025-09-18T10:00:00Z"
            }
        ]
        
        # Call the function
        normalized = normalize_remote_jobs(raw_jobs)
        
        # Assert normalization
        self.assertEqual(len(normalized), 1)
        self.assertEqual(normalized[0]["id"], 123)
        self.assertEqual(normalized[0]["title"], "Python Developer")
        self.assertEqual(normalized[0]["company"], "Test Company")
        assert normalized[0]["tags"] == ["python", "django"]
        self.assertEqual(normalized[0]["url"], "https://example.com/job/123")
        self.assertEqual(normalized[0]["created_at"], "2025-09-18T10:00:00Z")
    
    def test_normalize_remote_jobs_default_work_modality(self):
        # Test job without work_modality field
        raw_jobs = [
            {
                "id": "123",
                "position": "Python Developer",
                "company": "Test Company",
                "tags": ["python", "django"],
                "url": "https://example.com/job/123",
                "date": "2025-09-18T10:00:00Z"
            }
        ]
        
        normalized = normalize_remote_jobs(raw_jobs)
        self.assertEqual(normalized[0]["work_modality"], "Remote")
        
    @patch('app.models.job.Job')
    @patch('sqlalchemy.orm.Session')
    def test_save_jobs_to_db(self, MockSession, MockJob):
        # Mock session
        mock_session = MagicMock()
        mock_query = MagicMock()
        mock_session.query.return_value = mock_query
        mock_query.filter.return_value.first.return_value = None  # Job doesn't exist
        
        # Test data
        jobs = [{
            "id": 123,
            "title": "Developer",
            "company": "Test Inc",
            "work_modality": "Remote",
            "tags": "python,fastapi", 
            "url": "https://example.com/job",
            "created_at": "2025-09-18T10:00:00Z"
        }]
        
        # Call the function
        save_jobs_to_db(jobs, mock_session)
        
        # Assert session methods were called
        mock_session.add.assert_called()
        mock_session.commit.assert_called()

if __name__ == '__main__':
    unittest.main()