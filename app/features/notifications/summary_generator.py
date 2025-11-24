from jinja2 import Environment, FileSystemLoader
from typing import List, Dict

class SummaryGenerator:
    def __init__(self, template_dir: str):
        self.env = Environment(loader=FileSystemLoader(template_dir))

    def generate_summary(self, jobs: List[Dict], user_preferences: Dict) -> Dict[str, str]:
        """Generate daily summary content based on jobs and user preferences."""
        try:
            # Load templates
            html_template = self.env.get_template("daily_summary.html")
            text_template = self.env.get_template("daily_summary.txt")

            # Render templates
            html_content = html_template.render(jobs=jobs, preferences=user_preferences)
            text_content = text_template.render(jobs=jobs, preferences=user_preferences)

            return {"html": html_content, "text": text_content}
        except Exception as e:
            print(f"Failed to generate summary: {e}")
            return {"html": "", "text": ""}
        