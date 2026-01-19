import unittest
from unittest.mock import patch, MagicMock
import requests
from app.services.adzuna_service import fetch_adzuna_jobs, normalize_adzuna_jobs 

class TestAdzunaService(unittest.TestCase):
    
    @patch('app.services.adzuna_service.get_cached_response')
    @patch('app.services.adzuna_service.requests.get')
    def test_fetch_adzuna_jobs_success(self, mock_get, mock_cache):
        # Setup cache mock to return None (no cache found)
        mock_cache.return_value = None
        
        # Setup mock response
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [{"id": "123", "title": "Test Job"}]}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        # Call the function
        result = fetch_adzuna_jobs(country="gb", query="python")

        # Assert results
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["id"], "123")
        self.assertEqual(result[0]["title"], "Test Job")
        
    @patch('app.services.adzuna_service.get_cached_response')
    @patch('app.services.adzuna_service.requests.get')
    def test_fetch_adzuna_jobs_error(self, mock_get, mock_cache):
        # Setup cache mock to return None (no cache found)
        mock_cache.return_value = None
        
        # Setup mock to raise RequestException (not generic Exception)
        mock_get.side_effect = requests.exceptions.RequestException("API error")

        # Call the function
        result = fetch_adzuna_jobs(country="gb", query="python")
        self.assertEqual(result, [])
        
    def test_normalize_adzuna_jobs(self):
        # Sample raw jobs
        raw_jobs = [
            {
                "id": "12345",
                "title": "Python Developer",
                "company": {"display_name": "Test Company"},
                "location": {"display_name": "London, UK"},
                "description": "Job description here",
                "redirect_url": "https://example.com/job/12345?source=api",
                "created": "2025-09-18T10:00:00Z"                
            }
        ]
        
        # Call the function
        normalized = normalize_adzuna_jobs(raw_jobs)
        
        # Assert normalization
        self.assertEqual(len(normalized), 1)
        self.assertIsInstance(normalized[0]["id"], int)
        self.assertEqual(normalized[0]["title"], "Python Developer")
        self.assertEqual(normalized[0]["company"], "Test Company")
        self.assertEqual(normalized[0]["work_modality"], "Remote")
        self.assertEqual(normalized[0]["url"], "https://example.com/job/12345")
        self.assertEqual(normalized[0]["created_at"], "2025-09-18T10:00:00Z")
        
if __name__ == '__main__':
    unittest.main()