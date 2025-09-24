import unittest
from unittest.mock import patch, Mock
import sys
import os

# Add the parent directory to the path to import the service
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.jsearch_service import fetch_jsearch_jobs, normalize_jsearch_jobs


class TestJSearchService(unittest.TestCase):
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.sample_raw_job = {
            "job_id": "test123",
            "job_title": "Senior Python Developer",
            "employer_name": "Tech Company",
            "job_location": "New York, NY",
            "job_apply_link": "https://example.com/apply",
            "job_posted_at": "2 days ago"
        }
        
        self.sample_api_response = {
            "data": [self.sample_raw_job]
        }

    @patch('services.jsearch_service.requests.get')
    def test_fetch_jsearch_jobs_success(self, mock_get):
        """Test successful API call to JSearch."""
        # Mock successful API response
        mock_response = Mock()
        mock_response.json.return_value = self.sample_api_response
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        # Call the function
        result = fetch_jsearch_jobs("Python Developer")
        
        # Assertions
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["job_id"], "test123")

    @patch('services.jsearch_service.requests.get')
    def test_fetch_jsearch_jobs_api_error(self, mock_get):
        """Test API error handling."""
        # Mock API error
        mock_get.side_effect = Exception("API Error")
        
        # Call the function
        result = fetch_jsearch_jobs("Python Developer")
        
        # Should return empty list on error
        self.assertEqual(result, [])

    def test_normalize_jsearch_jobs_success(self):
        """Test successful normalization of JSearch jobs."""
        raw_jobs = [self.sample_raw_job]
        
        # Call the function
        result = normalize_jsearch_jobs(raw_jobs)
        
        # Assertions
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)
        
        normalized_job = result[0]
        self.assertIn("id", normalized_job)
        self.assertIn("title", normalized_job)
        self.assertIn("company", normalized_job)
        self.assertIn("location", normalized_job)
        self.assertIn("url", normalized_job)
        self.assertIn("posted_at", normalized_job)
        
        # Check specific values
        self.assertEqual(normalized_job["id"], "test123")
        self.assertEqual(normalized_job["title"], "Senior Python Developer")
        self.assertEqual(normalized_job["company"], "Tech Company")

    def test_normalize_jsearch_jobs_empty_list(self):
        """Test normalization with empty list."""
        result = normalize_jsearch_jobs([])
        self.assertEqual(result, [])

    def test_normalize_jsearch_jobs_missing_fields(self):
        """Test normalization with missing fields."""
        incomplete_job = {"job_id": "test456"}
        
        result = normalize_jsearch_jobs([incomplete_job])
        
        self.assertEqual(len(result), 1)
        normalized_job = result[0]
        
        # Check that missing fields are handled with defaults
        self.assertEqual(normalized_job["id"], "test456")
        self.assertEqual(normalized_job["title"], "N/A")
        self.assertEqual(normalized_job["company"], "N/A")

    @patch('services.jsearch_service.requests.get')
    def test_integration_fetch_and_normalize(self, mock_get):
        """Test the complete flow: fetch + normalize."""
        # Mock successful API response
        mock_response = Mock()
        mock_response.json.return_value = self.sample_api_response
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        # Fetch jobs
        raw_jobs = fetch_jsearch_jobs("Python Developer")
        
        # Normalize jobs
        normalized_jobs = normalize_jsearch_jobs(raw_jobs)
        
        # Assertions
        self.assertEqual(len(normalized_jobs), 1)
        self.assertEqual(normalized_jobs[0]["title"], "Senior Python Developer")


if __name__ == "__main__":
    unittest.main()