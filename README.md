# 🚀 OrionJobs AI

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![Azure](https://img.shields.io/badge/Azure-Cloud-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)

> Navigate your career journey with AI-powered precision.

Transform your job search from hours of manual browsing to intelligent, automated career guidance through legal API integrations and smart filtering, deployed on Microsoft Azure cloud infrastructure.

## ✨ Features

### ✅ Current Features
- **Database Management**: PostgreSQL with SQLAlchemy 2.0
- **REST API**: Complete CRUD operations with FastAPI
- **Data Validation**: Pydantic schemas for request/response validation
- **API Documentation**: Automatic Swagger/OpenAPI documentation
- **Cloud Deployment**: Azure Virtual Machines with managed PostgreSQL
- **Containerization**: Docker for consistent deployments

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
- Docker (Containerization)
- APScheduler (Task automation)

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
- RemoteOK API (Remote jobs focus)
- Adzuna API (Global job search)
- JSearch API (RapidAPI - Multi-source aggregator)
- Indeed API (Publisher Program)
- TheJobsAPI (Open source)
- RSS Feeds (Company career pages)

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
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
│   ├── routers/         # FastAPI routes
│   ├── config.py        # Configuration
│   ├── database.py      # Database connection
│   └── main.py          # FastAPI application
├── examples/            # API usage examples
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
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

### Phase 3: Data Collection 🔄
- [x] RemoteOK API integration (priority 1) ✅
- [x] Adzuna API integration ✅
- [x] Automated job scheduler API ✅
- [ ] RSS feed processors
- [ ] JSearch API (RapidAPI) integration
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

### ✅ Active APIs (2025)
- **RemoteOK API**: Free remote job listings without authentication
- **Adzuna API**: Global job search with free tier (50 calls/month)
- **JSearch API**: Multi-source aggregator via RapidAPI
- **Indeed Publisher API**: Official access (application required)
- **TheJobsAPI**: Open source job board API

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