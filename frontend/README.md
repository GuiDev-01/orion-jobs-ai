# 🚀 OrionJobs AI — Frontend

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-OrionJobs_AI-667eea?style=for-the-badge&labelColor=1a1a2e)](https://gray-water-0be9a250f.2.azurestaticapps.net)
[![API Status](https://img.shields.io/badge/API-Healthy-brightgreen?style=for-the-badge&logo=fastapi&logoColor=white)](https://orionjobs-api.azurewebsites.net/health)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![MUI](https://img.shields.io/badge/Material_UI-7-007FFF?style=flat-square&logo=mui)](https://mui.com)
[![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?style=flat-square&logo=microsoftazure)](https://azure.microsoft.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](../LICENSE)

> **AI-powered job search platform for developers** — Real-time analytics, glassmorphism UI, and intelligent job market insights. Aggregates thousands of developer positions from multiple sources into one beautiful, responsive interface.

<p align="center">
  <a href="https://gray-water-0be9a250f.2.azurestaticapps.net" target="_blank"><strong>🔥 Visit Live Application →</strong></a>
  <br />
  <a href="https://orionjobs-api.azurewebsites.net/docs">API Docs</a> · <a href="https://github.com/GuiDev-01/orion-jobs-ai">Repository</a> · <a href="https://orionjobs-api.azurewebsites.net/health">Health Check</a>
</p>

---

## 🌐 Live URLs

| Environment | URL | Status |
|---|---|---|
| **Frontend (Production)** | [gray-water-0be9a250f.2.azurestaticapps.net](https://gray-water-0be9a250f.2.azurestaticapps.net) | ✅ Live |
| **Custom Domain** | [orionjobs.me](https://orionjobs.me) | ⚠️ DNS propagating |
| **Backend API** | [orionjobs-api.azurewebsites.net](https://orionjobs-api.azurewebsites.net/docs) | ✅ Healthy |
| **API Health** | [/health](https://orionjobs-api.azurewebsites.net/health) | ✅ Operational |

---

## 🎯 Why This Project?

Most job boards are cluttered, slow, and offer poor developer experience. **OrionJobs AI** solves this by:

- **Aggregating** thousands of developer jobs from multiple APIs (RemoteOK, Adzuna, JSearch) into a single interface
- **Analyzing** the job market in real-time — top skills in demand, remote percentages, salary transparency
- **Delivering** a premium, fast UI with glassmorphism design, dark/light themes, and smooth animations
- **Automating** daily job collection and email summaries at 9 AM UTC

Built as a **full-stack production application** — not a tutorial project — with CI/CD, cloud infrastructure, and real data.

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **UI Framework** | React | 19.2 | Component architecture with modern hooks |
| **Language** | TypeScript | 5.9 | End-to-end type safety |
| **Build Tool** | Vite | 7.2 | Sub-second HMR, optimized bundling |
| **Component Library** | Material UI | 7.3 | Enterprise-grade components with theming |
| **Animations** | Framer Motion | 12.x | Page transitions, micro-interactions |
| **Routing** | React Router | 7.x | Client-side routing with location-based rendering |
| **Charts** | Recharts | 3.6 | Responsive SVG data visualizations |
| **HTTP Client** | Axios | 1.13 | API communication with interceptors |
| **Server State** | TanStack Query | 5.x | Caching, background refetching |
| **Date Utils** | date-fns | 4.1 | Lightweight date formatting |
| **Hosting** | Azure Static Web Apps | — | Global CDN, auto SSL, CI/CD |

---

## ✨ Features

### 📊 Analytics Dashboard
- **4 Stat Cards** — Total Jobs, Latest Additions, Remote %, Salary Disclosure %
- **Top Skills** — 5 most in-demand technologies with progress bars
- **Top Locations** — Leading hiring cities with job distribution
- **Interactive Charts** — Job posting trends + Top companies (Recharts)
- **Work Modalities** — Remote vs Hybrid vs On-site breakdown
- **Companies Section** — Animated chip grid of active employers

### 💼 Job Listings
- **Premium Cards** — Glassmorphism design with gradient overlays on hover
- **Smart Badges** — Auto-detected seniority (Junior → Principal), work modality, contract type
- **Quick Actions** — Save & Share buttons with animated reveal on hover
- **Advanced Filters** — Skills multi-select, salary range slider ($0–300k), seniority levels
- **Search** — Real-time search with 500ms debounce
- **Pagination** — Server-side pagination (12/page) with smooth scroll-to-top
- **Empty States** — Illustrated states for no results and connection errors
- **Skeleton Loaders** — Shimmer animation during data fetch

### 📄 Job Details
- **Full Information** — Description, salary, location, company, contract type
- **Save & Share** — Bookmark jobs and copy links with toast feedback
- **Similar Jobs** — Tag-based recommendations section
- **Breadcrumb Navigation** — Dashboard → Jobs → Job Title
- **Apply CTA** — Gradient button linking to original posting

### 🎨 Design System
- **Glassmorphism** — Blur effects with dynamic borders adapting to theme
- **Dark / Light Theme** — Context API + localStorage persistence, one-click toggle
- **Responsive** — Mobile-first: hamburger menu, drawer nav, adaptive grids (1/2/3 cols)
- **Animations** — Page transitions (AnimatePresence), shimmer loaders, hover micro-interactions
- **Custom Scrollbar** — Orion-themed webkit scrollbar
- **Typography** — Dynamic gradients per theme mode

### 🔔 UX Polish
- **Toast Notifications** — 4 severity levels (success/info/warning/error)
- **Error Boundaries** — Illustrated error states with retry actions
- **Smooth Scrolling** — Global smooth scroll with fixed-header offset
- **Selection Styling** — Orion blue text selection highlight

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # App shell — header, drawer, footer
│   │   ├── FeaturedJob.tsx      # Featured job card component
│   │   ├── HowItWorks.tsx       # Onboarding section
│   │   ├── StatsBar.tsx         # Stats bar component
│   │   └── charts/
│   │       └── *.tsx            # TrendChart, TopCompaniesChart
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Dark/light theme provider
│   ├── pages/
│   │   ├── Dashboard.tsx        # Analytics dashboard (4 cards, charts, insights)
│   │   ├── JobsList.tsx         # Job listings with filters and pagination
│   │   └── JobDetails.tsx       # Individual job view with similar jobs
│   ├── services/
│   │   └── api.ts               # Axios client + API endpoints
│   ├── types/
│   │   └── job.ts               # TypeScript interfaces (Job, JobsResponse, etc.)
│   ├── App.tsx                  # Routes + AnimatePresence page transitions
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles, scrollbar, selection
├── staticwebapp.config.json     # Azure SWA config (CSP, routing, headers)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/GuiDev-01/orion-jobs-ai.git
cd orion-jobs-ai/frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=https://orionjobs-api.azurewebsites.net
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |

---

## 🎨 Theme Palette

| Token | Color | Hex | Usage |
|---|---|---|---|
| **Primary** | 🔵 Orion Blue | `#304ffe` | Buttons, links, active states |
| **Secondary** | 🟣 Orion Purple | `#7c4dff` | Gradients, accents, charts |
| **Accent** | 🟠 Golden Orange | `#ffa726` | Logo, CTAs, highlights |
| **Success** | 🟢 Emerald | `#10b981` | Salary info, success states |
| **Dark BG** | ⚫ Deep Navy | `#0a1929` | Dark mode background |
| **Light BG** | ⚪ Clean White | `#ffffff` | Light mode background |

---

## 🔗 API Integration

The frontend communicates with the **OrionJobs API** (FastAPI + Neon PostgreSQL):

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/jobs` | GET | Paginated job listings with search & filters |
| `/api/v1/jobs/{id}` | GET | Single job details |
| `/api/v1/summary/daily` | GET | Dashboard analytics (stats, trends, insights) |
| `/health` | GET | API health check |

**Base URL**: `https://orionjobs-api.azurewebsites.net`
**Interactive Docs**: [Swagger UI](https://orionjobs-api.azurewebsites.net/docs)

---

## ☁️ Deployment

**Hosted on Azure Static Web Apps** with automated CI/CD:

- **Trigger**: Push to `main` branch (frontend path changes)
- **Build**: `tsc -b && vite build` → outputs to `dist/`
- **Deploy**: Azure Static Web Apps Deploy Action v1
- **CDN**: Global edge distribution with automatic SSL
- **SPA Routing**: Configured via `staticwebapp.config.json`
- **Security Headers**: CSP, X-Frame-Options, XSS Protection

---

## 🗺️ Roadmap

- [ ] Unit tests with Vitest (target: 70%+ coverage)
- [ ] E2E tests with Playwright (critical user flows)
- [ ] Lighthouse optimization (target: 95+ all categories)
- [ ] Lazy loading routes for bundle optimization
- [ ] PWA support (offline mode, install prompt)
- [ ] Internationalization (PT-BR / EN)
- [ ] Job matching score with AI

---

## 📄 License

MIT License — see [LICENSE](../LICENSE) for details.

---

<p align="center">
  Built with ☕ and 💙 by <a href="https://github.com/GuiDev-01">@GuiDev-01</a>
</p>
