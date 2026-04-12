import unittest

from app.services.text_cleaner import clean_job_description


class TestTextCleaner(unittest.TestCase):
    def test_cleans_html_and_preserves_paragraphs(self):
        raw = "<p>Build APIs</p><p>Work with Python &amp; FastAPI</p>"
        result = clean_job_description(raw)
        self.assertEqual(result, "Build APIs\nWork with Python & FastAPI")

    def test_preserves_list_like_structure(self):
        raw = "<ul><li>Python</li><li>Docker</li><li>AWS</li></ul>"
        result = clean_job_description(raw)
        self.assertEqual(result, "Python\nDocker\nAWS")

    def test_fallback_for_empty_values(self):
        self.assertEqual(clean_job_description(""), "No description available")
        self.assertEqual(clean_job_description(None), "No description available")


if __name__ == '__main__':
    unittest.main()
