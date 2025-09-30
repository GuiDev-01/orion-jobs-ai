# 🚀 OrionJobs AI

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![Azure](https://img.shields.io/badge/Azure-Cloud-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)

> Navigate your career journey with AI-powered precision.

Transform your job search from hours of manual browsing to intelligent, automated career guidance through legal API integrations and smart filtering, deployed on Microsoft Azure cloud infrastructure.

## 📊 Current Status (September 2025)

🎯 **Phase 4 COMPLETED** - Cloud-Ready Production System
- **✅ Security Hardened**: Critical vulnerability patched in API logging
- **✅ Docker Containerized**: Full containerization with PostgreSQL
- **✅ Azure Ready**: Complete deployment infrastructure configured
- **✅ CI/CD Pipeline**: GitHub Actions automation implemented
- **✅ Production Database**: 1,396+ jobs collected and stored
- **✅ Health Monitoring**: Comprehensive health checks implemented
- **✅ Documentation**: Complete deployment guides and examples

## ✨ Features

### ✅ Current Features (Production Ready)
- **🔒 Security Hardened**: API credentials protection and secure logging
- **🐳 Docker Containerization**: Complete containerization with PostgreSQL
- **☁️ Azure Cloud Ready**: Full deployment infrastructure on Microsoft Azure
- **🔄 CI/CD Pipeline**: Automated deployment via GitHub Actions
- **📊 Health Monitoring**: Comprehensive health checks and monitoring
- **🗄️ Production Database**: 1,396+ jobs collected and stored in PostgreSQL
- **🔌 Multi-Source Integration**: RemoteOK, Adzuna, and JSearch APIs
- **🧠 Smart Caching System**: Optimized API calls with intelligent response caching
- **⏰ Automated Scheduling**: Daily job collection with APScheduler
- **🔍 Advanced Filtering**: Location, work modality, and skill-based filters
- **📋 REST API**: Complete CRUD operations with FastAPI
- **✅ Comprehensive Testing**: 17 tests passing with full coverage
- **⚡ Rate Limiting**: Built-in protection against API abuse
- **🔗 Smart Deduplication**: Intelligent job filtering using deterministic IDs

### 🚧 In Development
- **🤖 AI Recommendations**: Machine learning-powered career consulting
- **📱 Web Dashboard**: Modern React interface for job management
- **📧 Daily Summaries**: Automated job digest via Telegram/Discord
- **📈 Analytics**: Advanced reporting and insights dashboard

## 🛠️ Tech Stack

**Backend (Production Ready)**
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy 2.0 (ORM)
- Alembic (Database migrations)
- Pydantic v2 (Data validation)
- APScheduler (Task automation)
- Pytest (Testing framework)

**Cloud Infrastructure (Azure)**
- 🐳 Docker (Containerization)
- Azure Container Registry (Image storage)
- Azure App Service (Container hosting)
- Azure Database for PostgreSQL (Managed database)
- Azure Monitor (Logging and monitoring)
- GitHub Actions (CI/CD automation)

**Planned Frontend**
- React/Next.js
- TypeScript
- Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Docker Desktop
- Git
- Azure account (for cloud deployment)

### 🐳 Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/orionjobs-ai.git
cd orionjobs-ai

# Start with Docker (includes PostgreSQL)
docker compose up -d

# Check if containers are running
docker compose ps

# Test the API
curl http://localhost:8000/health

# View logs
docker compose logs -f api

# Stop containers
docker compose down
```

### 🔧 Local Development Setup

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
copy .env.example .env
# Edit .env with your credentials

# Run database migrations
alembic upgrade head

# Run tests
pytest

# Start the application
python run.py
```

### ☁️ Azure Cloud Deployment

For complete Azure deployment instructions, see **[DEPLOYMENT.md](DEPLOYMENT.md)**

**Quick Azure Setup:**
```bash
# Build and deploy to Azure
docker build -t orionjobs .
az acr login --name your-registry
docker push your-registry.azurecr.io/orionjobs:latest
```

## 🎯 Development Roadmap

### Phase 1: Foundation ✅ **COMPLETED**
- [x] Database setup and models
- [x] FastAPI integration  
- [x] Basic CRUD operations

### Phase 2: Core API ✅ **COMPLETED**
- [x] Complete REST endpoints (GET, POST, PUT, DELETE)
- [x] Data validation schemas (Pydantic)
- [x] Request/Response models
- [x] Advanced error handling
- [x] API rate limiting

### Phase 3: Data Collection ✅ **COMPLETED**
- [x] RemoteOK API integration
- [x] Adzuna API integration with quota management
- [x] JSearch API (RapidAPI) integration
- [x] Smart caching system for API responses
- [x] Automated job scheduler
- [x] Database migrations with Alembic
- [x] Comprehensive testing suite (17 tests passing)
- [x] Data cleaning and normalization
- [x] **Production milestone: 1,396+ jobs collected**

### Phase 4: Cloud Infrastructure ✅ **COMPLETED** 
- [x] **Security Hardening**: API credentials protection
- [x] **Docker Containerization**: Full application containerization
- [x] **Azure Infrastructure**: Complete cloud deployment setup
- [x] **CI/CD Pipeline**: GitHub Actions automation
- [x] **Health Monitoring**: Comprehensive health checks
- [x] **Documentation**: Complete deployment guides
- [x] **Production Ready**: Tested and verified system

### Phase 5: User Experience 🔮 **NEXT**
- [ ] Daily job summaries and notifications
- [ ] Messaging bot integration (Telegram/Discord)
- [ ] User preferences and filtering system
- [ ] Advanced search capabilities

### Phase 6: Web Interface 🌐
- [ ] React dashboard with modern UI
- [ ] Real-time job filtering interface
- [ ] User management and authentication
- [ ] Analytics and reporting dashboard
- [ ] Mobile-responsive design

### Phase 7: AI Features 🧠
- [ ] Machine learning job recommendation engine
- [ ] AI-powered career consulting
- [ ] Skill gap analysis and suggestions
- [ ] Natural language processing for job descriptions
- [ ] Personalized career path recommendations

## 🐳 Docker Development

This project supports Docker for both local development and production deployment.

### Development Commands

```bash
# Build and run containers
docker compose up -d

# Check container status
docker compose ps

# View application logs
docker compose logs -f api

# Run tests inside container
docker compose exec api pytest

# Access container shell
docker compose exec api bash

# Stop containers
docker compose down

# Rebuild containers
docker compose up --build
```

### Production Deployment

```bash
# Build production image
docker build -t orionjobs-production .

# Run with production settings
docker run -e ENVIRONMENT=production orionjobs-production
```

## ☁️ Azure Architecture

```
┌─── GitHub Repository ────────┐
│   ├─ Source code             │
│   ├─ GitHub Actions CI/CD    │
│   └─ Automated deployment    │
└───────────────────────────────┘
            │
            ▼
┌─── Azure Container Registry ──┐
│   ├─ Docker image storage     │
│   ├─ Automated builds         │
│   └─ Version management       │
└───────────────────────────────┘
            │
            ▼
┌─── Azure App Service ────────┐
│   ├─ Container hosting       │
│   ├─ Auto-scaling            │
│   ├─ Health monitoring       │
│   └─ SSL/HTTPS encryption    │
└───────────────────────────────┘
            │
            ▼
┌─── Azure Database PostgreSQL ┐
│   ├─ Managed database        │
│   ├─ Automated backups       │
│   ├─ High availability       │
│   └─ Performance monitoring  │
└───────────────────────────────┘
```

## 📁 Project Structure

```
orionjobs-ai/
├── 🐳 Docker Configuration
│   ├── Dockerfile              # Container configuration
│   ├── docker-compose.yml      # Local development
│   └── docker-entrypoint.sh    # Startup automation
├── ☁️ Azure Infrastructure  
│   ├── .github/workflows/      # CI/CD automation
│   ├── DEPLOYMENT.md           # Cloud setup guide
│   └── .env.example            # Environment template
├── 🚀 Application Core
│   ├── app/
│   │   ├── models/             # Data models
│   │   ├── services/           # API integrations
│   │   ├── routers/            # FastAPI routes
│   │   ├── tests/              # Test suite
│   │   └── main.py             # Application entry
│   ├── alembic/                # Database migrations
│   └── run.py                  # Application launcher
└── 📚 Documentation
    ├── README.md               # Project overview
    ├── examples/               # Usage examples
    └── LICENSE                 # MIT license
```

## 💰 Azure Cost Management

**Estimated Monthly Costs (with $100 student credits):**
- Azure Container Registry: ~$5
- Azure App Service (B1): ~$15  
- Azure Database PostgreSQL: ~$15-20
- **Total: ~$35-40/month** (sustainable with credits)

**Cost Optimization Tips:**
- Deallocate resources when not in use
- Use Basic tier for development
- Monitor usage with Azure Cost Management
- Leverage free tier services when possible

## 🔒 Security Features

- **✅ API Credentials Protection**: Sensitive data never logged
- **✅ Container Security**: Non-root user configuration
- **✅ Environment Isolation**: Proper secrets management
- **✅ Rate Limiting**: API abuse protection
- **✅ Input Validation**: Pydantic schema validation
- **✅ Error Handling**: Secure error responses

## 🧪 Testing & Quality

**Comprehensive Testing Suite:**
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run integration tests
python run.py test

# Test specific modules
pytest app/tests/test_adzuna_service.py
```

**Quality Metrics:**
- ✅ 17 tests passing
- ✅ Security vulnerability patched
- ✅ Docker containers tested
- ✅ Health checks implemented
- ✅ Error handling coverage

## 🤝 Contributing

OrionJobs AI aims to democratize job hunting with AI. Contributions welcome!

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Set up Docker development environment
4. Make your changes with tests
5. Submit a pull request

### Guidelines
- Follow Python PEP 8 style
- Add tests for new features
- Update documentation
- Use conventional commit messages
- Respect legal data collection boundaries

## 📞 Support & Community

- **🐛 Issues**: [GitHub Issues](https://github.com/your-username/orionjobs-ai/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/orionjobs-ai/discussions)
- **📧 Email**: your-email@example.com
- **📖 Documentation**: Check `/examples` directory

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Star the Project

If you find OrionJobs AI useful, please ⭐ star the repository to show your support!

## 🏆 Acknowledgments

- **FastAPI** community for excellent framework
- **Microsoft Azure** for educational credits
- **Docker** for containerization technology
- **PostgreSQL** for robust database solutions
- **Open Source** community for inspiration

---

**Made with ❤️ for the developer community**

*Phase 4 Complete - Now Production Ready with Cloud Infrastructure* 🚀