# 🚀 CareerCopilot

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

> AI-powered job hunting automation that finds, filters, and recommends perfect career opportunities.

Transform your job search from hours of manual browsing to intelligent, automated career guidance through legal API integrations and smart filtering.

## ✨ Features

### ✅ Current Features
- **Database Management**: PostgreSQL with SQLAlchemy 2.0
- **REST API**: Complete CRUD operations with FastAPI
- **Data Validation**: Pydantic schemas for request/response validation
- **API Documentation**: Automatic Swagger/OpenAPI documentation
- **Professional Architecture**: Scalable backend with dependency injection

### 🚧 In Development
- **Multi-Platform Integration**: Legal API connections to major job boards
- **Smart Filtering**: Location, work modality, and skill-based filters
- **Daily Summaries**: Automated job digest via Telegram/Discord
- **Web Dashboard**: Modern React interface for job management
- **AI Recommendations**: Machine learning-powered career consulting

## 🛠️ Tech Stack

**Backend**
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy 2.0 (ORM)
- Pydantic v2 (Data validation)

**Planned Frontend**
- React/Next.js
- TypeScript
- Tailwind CSS

**Integrations**
- Indeed API
- LinkedIn API (official)
- GitHub Jobs API
- RemoteOK API
- Telegram/Discord APIs

**AI/ML**
- Scikit-learn
- Transformers (Hugging Face)
- OpenAI API (optional)

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/GuiDev-01/career-copilot.git
cd career-copilot
```

2. **Create virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
```

3. **Install dependencies**
```bash
pip install fastapi sqlalchemy psycopg2-binary python-dotenv uvicorn
```

4. **Set up environment variables**
```bash
copy .env.example .env
# Edit .env with your database credentials
```

5. **Run the application**
```bash
python run.py
```

6. **Access the API**
- API: http://localhost:8000
- Documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## 📁 Project Structure

```
career-copilot/
├── app/
│   ├── models/          # SQLAlchemy models & Pydantic schemas
│   ├── routers/         # FastAPI routes
│   ├── config.py        # Configuration
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI application
├── examples/            # API usage examples
├── .env.example         # Environment variables template
├── .env                 # Environment variables (local)
├── run.py              # Application runner
└── README.md
```

## 📚 API Examples

Check out the `examples/` directory for complete API usage examples, including:
- Creating and managing job entries
- Filtering and searching jobs
- Updating job information
- API testing with curl and Postman

### Quick API Test
```bash
# Create a job
curl -X POST "http://localhost:8000/jobs" \
  -H "Content-Type: application/json" \
  -d '{"title": "Python Developer", "company": "TechCorp", "work_modality": "remote"}'

# Get all jobs
curl -X GET "http://localhost:8000/jobs"
```

## 🤖 Legal Job Data Collection

CareerCopilot prioritizes legal and sustainable data collection through:

### ✅ Official APIs
- **Indeed Publisher API**: Structured job data access
- **LinkedIn API**: Professional network integration
- **GitHub Jobs API**: Developer-focused positions
- **RemoteOK API**: Remote work opportunities

### ✅ RSS Feeds
- Company career page feeds
- Job board RSS endpoints
- Industry-specific feeds

### ✅ Ethical Guidelines
- Respect robots.txt files
- Implement proper rate limiting
- Follow terms of service
- No aggressive scraping practices

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Database setup and models
- [x] FastAPI integration
- [x] Basic CRUD operations

### Phase 2: Core API ✅
- [x] Complete REST endpoints (GET, POST, PUT, DELETE)
- [x] Data validation schemas (Pydantic)
- [x] Request/Response models
- [ ] Advanced error handling
- [ ] API rate limiting

### Phase 3: Data Collection 🔄
- [ ] Legal API integrations (Indeed, LinkedIn, etc.)
- [ ] RSS feed processors
- [ ] Data cleaning and normalization
- [ ] Automated job discovery

### Phase 4: User Experience 🔮
- [ ] Daily job summaries
- [ ] Messaging bot integration
- [ ] User preferences system

### Phase 5: Web Interface 🌐
- [ ] React dashboard
- [ ] Job filtering interface
- [ ] User management
- [ ] Real-time job alerts
- [ ] Analytics and reporting

### Phase 6: AI Features 🧠
- [ ] Job recommendation engine
- [ ] Career consulting AI
- [ ] Skill gap analysis
- [ ] Natural language processing for job descriptions

## 🤝 Contributing

CareerCopilot aims to democratize job hunting with AI. Whether you're a developer, designer, or passionate about career technology - your contribution matters!

### Ways to Contribute
- 🐛 **Report bugs** and suggest features
- 💻 **Submit pull requests** for new features or fixes
- 📖 **Improve documentation** and examples
- 🎨 **Design UI/UX** improvements
- 🧪 **Add tests** and improve code coverage
- 🌍 **Translate** the application

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
git commit -m 'feat: add amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 for Python code style
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Respect the existing code architecture
- Follow legal boundaries in data collection

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/GuiDev-01/career-copilot/issues) for bug reports and feature requests
- **Discussions**: [GitHub Discussions](https://github.com/GuiDev-01/career-copilot/discussions) for general questions
- **Email**: guilhermesantosdev01@gmail.com
- **Documentation**: Check `/examples` for detailed API guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Join the Movement

CareerCopilot aims to democratize career opportunities through technology. Whether you're a job seeker, developer, or career enthusiast, your contribution can help thousands of professionals find their dream jobs.

**Star ⭐ this repository if you believe in the mission!**

## 🌟 Acknowledgments

- FastAPI community for excellent documentation
- SQLAlchemy team for robust ORM capabilities
- Job board APIs for legal data access
- Open source community for inspiration and tools

---

**Made with ❤️ for the developer community**

*Transform your career journey with intelligent automation*