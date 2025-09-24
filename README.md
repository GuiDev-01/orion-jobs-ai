# 🚀 OrionJobs AI

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![Azure](https://img.shields.io/badge/Azure-Cloud-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)

> Navigate your career journey with AI-powered precision.

Transform your job search from hours of manual browsing to intelligent, automated career guidance through legal API integrations and smart filtering, deployed on Microsoft Azure cloud infrastructure.

## 📊 Current Status (September 2024)

🎯 **Phase 3 COMPLETED** - Data Collection System Fully Operational
- **1,396+ Jobs** collected from multiple sources
- **3 API Integrations** working in production (RemoteOK, Adzuna, JSearch)
- **17 Tests** passing with comprehensive coverage
- **REST API** running on 127.0.0.1:8000
- **PostgreSQL Database** with robust schema and migrations
- **Smart Deduplication** preventing duplicate entries
- **Rate Limiting** protecting API quotas

## ✨ Features

### ✅ Current Features
- **Multi-Source Job Aggregation**: Integrates RemoteOK, Adzuna, and JSearch APIs
- **Production Database**: 1,396+ jobs collected and stored in PostgreSQL
- **Smart Caching System**: Optimizes API calls with intelligent response caching
- **Real-time Data Processing**: Normalizes job data from different sources
- **Automated Scheduling**: Daily job collection with APScheduler
- **Database Management**: PostgreSQL with SQLAlchemy 2.0 and Alembic migrations
- **REST API**: Complete CRUD operations with FastAPI (127.0.0.1:8000)
- **Data Validation**: Pydantic schemas for request/response validation
- **API Documentation**: Automatic Swagger/OpenAPI documentation
- **Comprehensive Testing**: Pytest suite with mocking and integration tests (17 tests passing)
- **Error Handling**: Robust exception management and logging
- **Rate Limiting**: Built-in protection against API abuse with quota management
- **Deduplication System**: Intelligent job filtering using deterministic IDs
- **Per-job Commits**: Resilient database operations with rollback protection

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
- Alembic (Database migrations)
- Pydantic v2 (Data validation)
- Docker (Containerization)
- APScheduler (Task automation)
- Pytest (Testing framework)

**Cloud Infrastructure (Azure)**
- Azure Virtual Machines (Compute)
- Azure Database for PostgreSQL (Managed database)
- Azure Monitor (Logging and monitoring)
- GitHub Actions (CI/CD)

**Planned Frontend**
- React/Next.js
- TypeScript
- Tailwind CSS

**Data Sources**
- ✅ RemoteOK API (98 jobs per collection cycle)
- ✅ Adzuna API (Global job search with 30-request quota protection)
- ✅ JSearch API (RapidAPI - Multi-source aggregator)
- 🔜 Indeed API (Publisher Program)
- 🔜 TheJobsAPI (Open source)
- 🔜 RSS Feeds (Company career pages)

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL
- Docker
- Git
- Azure account (optional for local development)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/GuiDev-01/orion-jobs-ai.git
cd orion-jobs-ai
```

2. **Create virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
copy .env.example .env
# Edit .env with your database credentials and API keys
```

5. **Run database migrations**
```bash
alembic upgrade head
```

6. **Run tests**
```bash
pytest
```

7. **Run integration tests**
```bash
python run.py test
```

8. **Start the application**
```bash
python run.py
```

### Cloud Deployment (Azure)

1. **Build Docker image**
```bash
docker build -t orionjobs-ai .
```

2. **Deploy to Azure VM**
```bash
# Automated via GitHub Actions
git push origin main
```

## ☁️ Azure Architecture

```
┌── GitHub Actions (CI/CD) ──┐
│   ├─ Automated testing     │
│   ├─ Docker build          │
│   └─ Azure deployment      │
└─────────────────────────────┘
            │
            ▼
┌── Azure VM (B1s) ──────────┐
│   ├─ Ubuntu 22.04         │
│   ├─ Docker runtime       │
│   ├─ FastAPI application  │
│   └─ Public endpoint      │
└─────────────────────────────┘
            │
            ▼
┌── Azure Database PostgreSQL ┐
│   ├─ Managed service       │
│   ├─ Automated backups     │
│   ├─ 99.9% SLA            │
│   └─ Private connection    │
└─────────────────────────────┘
```

## 📁 Project Structure

```
orion-jobs-ai/
├── app/
│   ├── models/          # SQLAlchemy models & Pydantic schemas
│   ├── services/        # API integrations & business logic
│   ├── routers/         # FastAPI routes
│   ├── tests/           # Comprehensive test suite
│   ├── config.py        # Configuration
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI application
├── alembic/             # Database migrations
│   └── versions/        # Migration scripts
├── examples/            # API usage examples
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── job_schedule.py      # Automated job collection
├── run.py              # Application entry point
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Local development
├── .env.example         # Environment variables template
├── requirements.txt     # Python dependencies
└── README.md
```

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Database setup and models ✅
- [x] FastAPI integration ✅
- [x] Basic CRUD operations ✅

### Phase 2: Core API ✅
- [x] Complete REST endpoints (GET, POST, PUT, DELETE) ✅
- [x] Data validation schemas (Pydantic) ✅
- [x] Request/Response models ✅
- [x] Advanced error handling ✅
- [x] API rate limiting ✅

### Phase 3: Data Collection ✅ **COMPLETED**
- [x] RemoteOK API integration (priority 1) ✅
- [x] Adzuna API integration with quota management ✅
- [x] JSearch API (RapidAPI) integration ✅
- [x] Smart caching system for API responses ✅
- [x] Automated job scheduler ✅
- [x] Database migrations with Alembic ✅
- [x] Comprehensive testing suite (17 tests passing) ✅
- [x] Data cleaning and normalization ✅
- [x] Automated job discovery ✅
- [x] **Production milestone: 1,396+ jobs collected** ✅
- [ ] RSS feed processors

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

### Phase 7: Cloud Deployment (MVP on Azure) ☁️
- [ ] Azure Database for PostgreSQL: Managed database setup
- [ ] Docker Containerization: Application packaging for cloud deployment
- [ ] Azure VM Deployment: Linux virtual machine configuration
- [ ] CI/CD Pipeline: GitHub Actions integration with Azure
- [ ] Azure Monitor: Basic logging and monitoring setup
- [ ] Cost Optimization: Resource management for student budget

## 💰 Cost Management

**Azure for Students Benefits:**
- $100 in free Azure credits
- Access to 25+ free services
- No credit card required

**Estimated Monthly Costs:**
- Azure VM B1s: ~$7-10/month
- PostgreSQL Basic: ~$5-8/month
- Storage and networking: ~$2-3/month
- **Total: ~$15-20/month** (well within credit limits)

**Cost Optimization Tips:**
- Deallocate VM when not in use
- Use Basic tier for development
- Monitor usage with Azure Cost Management
- Leverage free tier services when possible

## 🤖 Legal Job Data Collection

OrionJobs AI prioritizes legal and sustainable data collection through:

### ✅ Active APIs (2025) - Production Ready
- **RemoteOK API**: ✅ Fully integrated - 98 jobs per collection cycle
- **Adzuna API**: ✅ Operational with quota protection (30 requests/month)
- **JSearch API**: ✅ Multi-source aggregator via RapidAPI
- **Indeed Publisher API**: 🔜 Official access (application required)
- **TheJobsAPI**: 🔜 Open source job board API

### ✅ RSS Feeds
- Company career page feeds
- Job board RSS endpoints
- Industry-specific feeds

### ✅ Ethical Guidelines
- Respect robots.txt files
- Implement proper rate limiting
- Follow terms of service
- No aggressive scraping practices
- Focus on publicly available postings
- Smart caching to minimize API calls

## 🧪 Testing

**Run the complete test suite:**
```bash
pytest
```

**Run integration tests:**
```bash
python run.py test
```

**Test coverage includes:**
- Unit tests for all services
- API integration tests with mocking
- Database model validation
- Error handling scenarios
- Cache system functionality

## 🤝 Contributing

OrionJobs AI aims to democratize job hunting with AI. Whether you're a developer, designer, or passionate about career technology - your contribution matters!

### Ways to Contribute
- 🐛 **Report bugs** and suggest features
- 💻 **Submit pull requests** for new features or fixes
- 📖 **Improve documentation** and examples
- 🎨 **Design UI/UX** improvements
- 🧪 **Add tests** and improve code coverage
- 🌍 **Translate** the application

### Development Guidelines
- Follow PEP 8 for Python code style
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Respect the existing code architecture
- Follow legal boundaries in data collection

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/GuiDev-01/orion-jobs-ai/issues) for bug reports and feature requests
- **Discussions**: [GitHub Discussions](https://github.com/GuiDev-01/orion-jobs-ai/discussions) for general questions
- **Email**: guilhermesantosdev01@gmail.com
- **Documentation**: Check `/examples` for detailed API guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Join the Movement

OrionJobs AI aims to democratize career opportunities through technology. Whether you're a job seeker, developer, or career enthusiast, your contribution can help thousands of professionals find their dream jobs.

**Star ⭐ this repository if you believe in the mission!**

## 🌟 Acknowledgments

- FastAPI community for excellent documentation
- SQLAlchemy team for robust ORM capabilities
- Microsoft Azure for educational credits
- Job board APIs for legal data access
- Open source community for inspiration and tools

---

**Made with ❤️ for the developer community**

*Navigate your career journey with AI-powered precision*