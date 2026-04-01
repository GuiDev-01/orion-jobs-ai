# 🚀 OrionJobs AI

[![Live App](https://img.shields.io/badge/🔗_Live_App-OrionJobs_AI-667eea?style=for-the-badge&labelColor=1a1a2e)](https://gray-water-0be9a250f.2.azurestaticapps.net)
[![API](https://img.shields.io/badge/API-Healthy-brightgreen?style=for-the-badge&logo=fastapi&logoColor=white)](https://orionjobs-api.azurewebsites.net/health)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square&logo=githubactions)](https://github.com/GuiDev-01/orion-jobs-ai/actions)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?style=flat-square&logo=microsoftazure)](https://azure.microsoft.com)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

> **Full-stack AI-powered job search platform for developers.** Aggregates positions from multiple APIs, delivers real-time market analytics, and provides intelligent insights through a modern React UI deployed on Azure cloud.

<p align="center">
  <a href="https://gray-water-0be9a250f.2.azurestaticapps.net" target="_blank"><strong>🔥 Live Application →</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://orionjobs-api.azurewebsites.net/docs"><strong>📖 API Docs →</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://orionjobs-api.azurewebsites.net/health"><strong>💚 Health Check →</strong></a>
</p>

---

## 🌐 Live URLs

| Service | URL | Status |
|---|---|---|
| **Frontend** | [gray-water-0be9a250f.2.azurestaticapps.net](https://gray-water-0be9a250f.2.azurestaticapps.net) | ✅ Live |
| **Backend API** | [orionjobs-api.azurewebsites.net](https://orionjobs-api.azurewebsites.net/docs) | ✅ Healthy |
| **Swagger Docs** | [/docs](https://orionjobs-api.azurewebsites.net/docs) | ✅ Interactive |
| **Health Check** | [/health](https://orionjobs-api.azurewebsites.net/health) | ✅ Operational |

---

## 🎯 Why This Project?

Most job boards are cluttered, slow, and have poor developer experience. **OrionJobs AI** solves this:

| Problem | Solution |
|---|---|
| Scattered listings across multiple sites | **Multi-source aggregation** (RemoteOK, Adzuna, JSearch) |
| No real-time market visibility | **Analytics dashboard** with skills demand, salary transparency, trends |
| Slow, outdated interfaces | **Modern React 19 UI** with glassmorphism, animations, dark/light theme |
| Manual daily searching | **Automated collection** + email summaries at 9 AM UTC |
| No insights on what's trending | **Real-time analytics** — top skills, remote %, top companies |

This is a **production application** — not a tutorial project — with CI/CD pipelines, cloud infrastructure, automated scheduling, and real data from multiple APIs.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AZURE CLOUD                              │
│                                                                 │
│  ┌──────────────────────┐    ┌─────────────────────────────┐   │
│  │  Azure Static Web    │    │   Azure App Service          │   │
│  │  Apps (Frontend)     │───▶│   (Backend API)              │   │
│  │                      │    │                               │   │
│  │  React 19 + TS 5.9   │    │   FastAPI + Python 3.12      │   │
│  │  Vite 7 + MUI 7     │    │   SQLAlchemy 2.0 + Alembic   │   │
│  │  Framer Motion       │    │   APScheduler + Pydantic v2  │   │
│  │  Recharts            │    │                               │   │
│  └──────────────────────┘    └──────────┬──────────────────┘   │
│                                          │                      │
│                              ┌───────────▼───────────────┐     │
│                              │   Neon PostgreSQL          │     │
│                              │   (Serverless, auto-scale) │     │
│                              └───────────────────────────┘     │
│                                                                 │
│  ┌──────────────────────┐    ┌─────────────────────────────┐   │
│  │  GitHub Actions       │    │   External APIs              │   │
│  │  (CI/CD Pipeline)    │    │   RemoteOK · Adzuna · JSearch│   │
│  └──────────────────────┘    └─────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────┐    ┌─────────────────────────────┐   │
│  │  Docker + GHCR        │    │   SendGrid SMTP              │   │
│  │  (Containerization)  │    │   (Email Notifications)      │   │
│  └──────────────────────┘    └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | Component UI with modern hooks |
| TypeScript | 5.9 | End-to-end type safety |
| Vite | 7.2 | Sub-second HMR, optimized builds |
| Material UI | 7.3 | Enterprise-grade theming |
| Framer Motion | 12.x | Page transitions, micro-interactions |
| React Router | 7.x | Client-side routing |
| Recharts | 3.6 | SVG data visualizations |
| TanStack Query | 5.x | Server state, caching |
| Vitest + Testing Library | 4.x / 16.x | Frontend unit/component tests |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12 | Core runtime |
| FastAPI | Latest | Async REST API framework |
| SQLAlchemy | 2.0 | ORM with async support |
| Alembic | Latest | Database migrations |
| Pydantic | v2 | Data validation & serialization |
| APScheduler | Latest | Task scheduling (daily collection + emails) |
| Google GenAI | 0.3 | AI insights using Gemini API |
| Pytest | Latest | Test suite |

### Infrastructure
| Technology | Purpose |
|---|---|
| Azure App Service | Backend API hosting |
| Azure Static Web Apps | Frontend hosting (global CDN, auto SSL) |
| Neon PostgreSQL | Serverless database (auto-scaling, $0 cost) |
| Docker + GHCR | Containerization & registry |
| GitHub Actions | CI/CD automation (3 workflows) |
| SendGrid | SMTP email delivery |

---

## ✨ Features

### 📊 Analytics Dashboard
Real-time job market intelligence with interactive visualizations:
- **4 Stat Cards** — Total Jobs, Latest Additions, Remote %, Salary Disclosure %
- **Top Skills** — 5 most in-demand technologies with progress bars
- **Top Locations** — Leading hiring cities with job distribution
- **Interactive Charts** — Posting trends + top companies (Recharts)
- **Work Modalities** — Remote vs Hybrid vs On-site breakdown

### 💼 Job Listings
Premium browsing experience with advanced filtering:
- **Glassmorphism Cards** — Gradient overlays, hover effects, seniority badges
- **Quick Actions** — Save & Share with animated reveal
- **Advanced Filters** — Skills multi-select, salary range ($0–300k), seniority levels
- **Server-Side Pagination** — 12/page with debounced search
- **Empty States** — Illustrated feedback with retry actions

### 📄 Job Details & AI Assistant
Complete job information with smart recommendations:
- **AI Career Consultant** — Gemini-powered insights (Overview, Pros, Red Flags, Interview Questions)
- **Full Details** — Description, salary, location, company, contract type
- **Similar Jobs** — Tag-based recommendation engine
- **Apply CTA** — Direct link to original posting

### ✅ Quality & Reliability
- **Frontend Tests** — Vitest + Testing Library (core components, hooks and page smoke tests)
- **Backend Tests** — Pytest suite for service normalization and models
- **CI Workflows** — Automated backend CI, security scan, and Azure deployments

### 🎨 Design System
- **Dark / Light Theme** — One-click toggle with localStorage persistence
- **Responsive** — Mobile-first with hamburger menu and adaptive grids
- **Animations** — Page transitions, shimmer loaders, micro-interactions
- **Custom Scrollbar** — Themed webkit scrollbar

### 📧 Email Notifications
- **Automated Daily Digest** — Job summaries sent at 9 AM UTC
- **Professional Templates** — Jinja2 HTML + text templates
- **Multi-Recipient** — Send to multiple addresses simultaneously
- **Retry Logic** — Exponential backoff with error handling

### 🔌 Multi-Source Aggregation
- **RemoteOK** — Remote-first developer positions
- **Adzuna** — Global job market with quota management
- **JSearch (RapidAPI)** — Comprehensive tech job listings
- **Smart Deduplication** — Deterministic IDs prevent duplicates
- **Intelligent Caching** — Optimized API calls

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **Python** 3.12+
- **Docker** (optional, for containerized setup)

### Frontend
```bash
cd frontend
npm install
npm run dev          # → http://localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py        # → http://localhost:8000
```

### Docker (Full Stack)
```bash
docker-compose up -d # API + Database
cd frontend && npm run dev
```

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host/db  # Neon PostgreSQL
GEMINI_API_KEY=your-gemini-api-key           # Google GenAI
ADZUNA_APP_ID=your-id                        # Adzuna API
ADZUNA_APP_KEY=your-key
JSEARCH_API_KEY=your-rapidapi-key            # JSearch API
SMTP_HOST=smtp.sendgrid.net                  # Email (SendGrid)
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-key
EMAIL_FROM_NAME=OrionJobs AI
EMAIL_FROM_ADDRESS=notifications@orionjobs.me
DEFAULT_EMAIL_RECIPIENTS=you@example.com

# Frontend (.env)
VITE_API_URL=https://orionjobs-api.azurewebsites.net
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/jobs` | Paginated job listings with search & filters |
| `GET` | `/api/v1/jobs/{id}` | Single job details |
| `POST` | `/api/v1/jobs/collect` | Trigger manual job collection |
| `GET` | `/api/v1/ai/analyze-job/{id}` | AI-powered job insights using Gemini |
| `GET` | `/api/v1/summary/daily` | Dashboard analytics & insights |
| `GET` | `/api/v1/notifications/email-config` | Email service status |
| `POST` | `/api/v1/notifications/send-daily-summary` | Send job digest email |
| `POST` | `/api/v1/notifications/test-email` | Test SMTP connectivity |
| `GET` | `/health` | API health check |
| `GET` | `/docs` | Interactive Swagger UI |

```bash
# Example: Get remote Python jobs from last 7 days
curl "https://orionjobs-api.azurewebsites.net/api/v1/summary/daily?location=remote&tags=python&period_days=7"
```

---

## 📁 Project Structure

```
orionjobs-ai/
├── frontend/                    # React 19 + TypeScript SPA
│   ├── src/
│   │   ├── pages/              # Dashboard, JobsList, JobDetails
│   │   ├── components/         # Layout, Charts, Cards
│   │   ├── contexts/           # ThemeContext (dark/light)
│   │   ├── services/           # Axios API client
│   │   └── types/              # TypeScript interfaces
│   ├── staticwebapp.config.json
│   └── vite.config.ts
│
├── backend/                     # FastAPI + Python
│   ├── app/
│   │   ├── models/             # SQLAlchemy models (Job, User, Cache)
│   │   ├── routers/            # API endpoints
│   │   ├── services/           # RemoteOK, Adzuna, JSearch integrations
│   │   ├── features/
│   │   │   ├── summaries/      # Analytics & filtering engine
│   │   │   └── notifications/  # Email service + templates
│   │   ├── analytics/          # Trend analysis (planned)
│   │   ├── webhooks/           # Discord/Telegram (planned)
│   │   └── tests/              # Pytest test suite
│   ├── alembic/                # Database migrations
│   └── Dockerfile
│
├── .github/workflows/           # CI/CD pipelines
│   ├── ci.yml                  # Tests + lint
│   ├── azure-deploy.yml        # Backend deploy
│   └── azure-frontend-deploy.yml # Frontend deploy
│
├── docs/                        # Documentation
└── docker-compose.yml           # Local development
```

---

## ☁️ Deployment

### CI/CD Pipeline (GitHub Actions)

| Workflow | Trigger | Action |
|---|---|---|
| `ci.yml` | Push / PR (backend changes) | Backend tests + lint checks + security scan |
| `azure-deploy.yml` | Push to `main` | Build Docker → Deploy backend |
| `azure-frontend-deploy.yml` | Push/PR (`frontend/**`) | Build frontend → Deploy to Azure SWA |

### Infrastructure Costs

| Service | Cost | Tier |
|---|---|---|
| Azure App Service | ~$15/mo | B1 |
| Azure Static Web Apps | $0 | Free (100GB CDN) |
| Neon PostgreSQL | $0 | Free (auto-scaling) |
| GitHub Actions | $0 | Free (2000 min/mo) |
| **Total** | **~$15/mo** | |

> 💡 **66% cost reduction** from initial ~$35/mo by migrating to Neon PostgreSQL (from $20/mo to $0).

---

## 🗺️ Roadmap

- [x] Multi-source job aggregation (RemoteOK, Adzuna, JSearch)
- [x] REST API with FastAPI + PostgreSQL
- [x] Docker containerization + Azure deployment
- [x] Analytics engine with advanced filtering
- [x] Email notifications with automated scheduling
- [x] React 19 frontend with TypeScript
- [x] Glassmorphism UI with dark/light theme
- [x] Interactive dashboard with charts
- [x] CI/CD pipelines (3 workflows)
- [x] AI Career Consultant (Gemini API)
- [x] Test foundation with Vitest + Pytest
- [ ] Expand test coverage to 70%+
- [ ] Data quality sprint: better salary/location coverage + more job sources
- [ ] E2E tests with Playwright
- [ ] PWA support (offline mode, install prompt)
- [ ] Internationalization (PT-BR / EN)
- [ ] Authentication with JWT & OAuth 2.0
- [ ] Discord / Telegram webhook alerts

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with ☕ and 💙 by <a href="https://github.com/GuiDev-01">@GuiDev-01</a></strong>
  <br />
  <sub>Full-stack developer • Python • React • TypeScript • Azure</sub>
</p>
