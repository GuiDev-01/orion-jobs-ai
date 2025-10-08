# 🚀 OrionJobs AI

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![Azure](https://img.shields.io/badge/Azure-Cloud-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)

> Navigate your career journey with AI-powered precision.

Transform your job search from hours of manual browsing to intelligent, automated career guidance through legal API integrations and smart filtering, deployed on Microsoft Azure cloud infrastructure.

## 📊 Current Status (October 2025)

🎯 **Phase 4 COMPLETED** - Cloud-Ready Production System
- **✅ Security Hardened**: Critical vulnerability patched in API logging
- **✅ Docker Containerized**: Full containerization with PostgreSQL
- **✅ Azure Deployed**: Complete deployment infrastructure on Microsoft Azure
- **✅ CI/CD Pipeline**: GitHub Actions automation implemented
- **✅ Production Database**: Multi-source job collection active
- **✅ Health Monitoring**: Comprehensive health checks implemented
- **✅ Live API**: Fully functional endpoints at `/api/v1/jobs`

## 🌐 Live Application

**Production API:** `https://orionjobs-api.azurewebsites.net`

### Available Endpoints:
- **GET `/api/v1/jobs`** - Retrieve all jobs
- **GET `/docs`** - Interactive API documentation
- **GET `/health`** - Health check endpoint

## ✨ Features

### ✅ Current Features (Production Ready)
- **🔒 Security Hardened**: API credentials protection and secure logging
- **🐳 Docker Containerization**: Complete containerization with PostgreSQL
- **☁️ Azure Cloud Deployed**: Fully operational on Microsoft Azure infrastructure
- **🔄 CI/CD Pipeline**: Automated deployment via GitHub Actions
- **📊 Health Monitoring**: Comprehensive health checks and monitoring
- **🗄️ Production Database**: Azure PostgreSQL with multi-source job data
- **🔌 Multi-Source Integration**: RemoteOK, Adzuna, and JSearch APIs
- **🧠 Smart Caching System**: Optimized API calls with intelligent response caching
- **⏰ Automated Scheduling**: Daily job collection with APScheduler
- **🔍 Advanced Filtering**: Location, work modality, and skill-based filters
- **📋 REST API**: Complete CRUD operations with FastAPI
- **✅ Comprehensive Testing**: Full test suite with CI/CD integration
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
- PostgreSQL (Azure Database)
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

### 🌐 Using the Live API

```bash
# Test the production API
curl https://orionjobs-api.azurewebsites.net/api/v1/jobs

# Check API health
curl https://orionjobs-api.azurewebsites.net/health

# Access interactive documentation
open https://orionjobs-api.azurewebsites.net/docs
```

### 🐳 Local Development with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/orionjobs-ai.git
cd orionjobs-ai

# Configure environment variables
cp .env.example .env
# Edit .env with your Azure database credentials

# Start with Docker (API only, uses Azure database)
docker compose up -d

# Check if containers are running
docker compose ps

# Test the API
curl http://0.0.0.0:8000/health

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
# Edit .env with your Azure database credentials

# Run database migrations
alembic upgrade head

# Run tests
pytest

# Start the application
python run.py
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
│   ├─ Container hosting       │ ✅ DEPLOYED
│   ├─ Auto-scaling            │
│   ├─ Health monitoring       │
│   └─ SSL/HTTPS encryption    │
└───────────────────────────────┘
            │
            ▼
┌─── Azure Database PostgreSQL ┐
│   ├─ Managed database        │ ✅ ACTIVE
│   ├─ Automated backups       │
│   ├─ High availability       │
│   └─ Performance monitoring  │
└───────────────────────────────┘
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
- [x] Comprehensive testing suite
- [x] Data cleaning and normalization

### Phase 4: Cloud Infrastructure ✅ **COMPLETED** 
- [x] **Security Hardening**: API credentials protection
- [x] **Docker Containerization**: Full application containerization
- [x] **Azure Infrastructure**: Complete cloud deployment setup
- [x] **CI/CD Pipeline**: GitHub Actions automation
- [x] **Production Database**: Azure PostgreSQL fully configured
- [x] **Live Deployment**: API accessible at https://orionjobs-api.azurewebsites.net
- [x] **Health Monitoring**: Comprehensive health checks
- [x] **Documentation**: Complete deployment guides

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
# Build and run containers (connects to Azure database)
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

## 💰 Azure Cost Management

**Current Monthly Costs:**
- Azure Container Registry: ~$5
- Azure App Service (B1): ~$15  
- Azure Database PostgreSQL: ~$15-20
- **Total: ~$35-40/month**

**Cost Optimization Tips:**
- Monitor usage with Azure Cost Management
- Use Basic tier for development
- Leverage free tier services when possible
- Scale down during low usage periods

## 🔒 Security Features

- **✅ API Credentials Protection**: Sensitive data never logged
- **✅ Container Security**: Non-root user configuration
- **✅ Environment Isolation**: Proper secrets management
- **✅ Azure Security**: Managed database with SSL encryption
- **✅ Rate Limiting**: API abuse protection
- **✅ Input Validation**: Pydantic schema validation
- **✅ Error Handling**: Secure error responses

## 🧪 Testing & Quality

**Comprehensive Testing Suite:**
```bash
# Run all tests locally
pytest

# Run with coverage
pytest --cov=app

# Run integration tests
python run.py test

# Test specific modules
pytest app/tests/test_adzuna_service.py
```

**Quality Metrics:**
- ✅ Full test suite passing
- ✅ Production deployment tested
- ✅ Azure integration verified
- ✅ CI/CD pipeline active
- ✅ Health monitoring implemented

## 📁 Project Structure

```
orionjobs-ai/
├── 🐳 Docker Configuration
│   ├── Dockerfile              # Container configuration
│   ├── docker-compose.yml      # Local development
│   └── .dockerignore           # Docker ignore rules
├── ☁️ Azure Infrastructure  
│   ├── .github/workflows/      # CI/CD automation
│   │   ├── azure-deploy.yml    # Azure deployment
│   │   └── ci.yml              # Continuous integration
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
    └── LICENSE                 # MIT license
```

## 🤝 Contributing

OrionJobs AI aims to democratize job hunting with AI. Contributions welcome!

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Set up local development environment
4. Make your changes with tests
5. Submit a pull request

### Guidelines
- Follow Python PEP 8 style
- Add tests for new features
- Update documentation
- Use conventional commit messages
- Test with the live Azure database

## 📞 Support & Community

- **📧 Email**: guilhermesantosdev01@gmail.com
- **📖 Documentation**: Check `/examples` directory
- **🌐 Live API**: https://orionjobs-api.azurewebsites.net

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Star the Project

If you find OrionJobs AI useful, please ⭐ star the repository to show your support!

## 🏆 Acknowledgments

- **FastAPI** community for excellent framework
- **Microsoft Azure** for robust cloud infrastructure
- **Docker** for containerization technology
- **PostgreSQL** for reliable database solutions
- **GitHub Actions** for seamless CI/CD
- **Open Source** community for inspiration

---

**Made with ❤️ for the developer community**

*Phase 4 Complete - Production Ready with Live Azure Deployment* 🚀

**🌐 Try it now: [https://orionjobs-api.azurewebsites.net/api/v1/jobs](https://orionjobs-api.azurewebsites.net/api/v1/jobs)**