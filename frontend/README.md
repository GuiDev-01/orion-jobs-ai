# 🎨 OrionJobs AI - Frontend

> Modern, responsive React frontend for OrionJobs AI with glassmorphism design and dark/light theme support.

## 🚀 Tech Stack

- **React 19** - Latest React with modern hooks
- **TypeScript 5** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Material UI v7** - Modern component library with theming
- **Framer Motion** - Professional animations
- **React Router v7** - Client-side routing
- **Recharts** - Beautiful data visualization
- **Axios** - HTTP client for API integration
- **React Query** - Server state management

## ✨ Features

### 🎨 Design System
- **Glassmorphism UI**: Modern blur effects with dynamic borders adapting to theme
- **Dark/Light Theme**: Context-based system with localStorage persistence
- **Responsive Design**: Mobile-first with hamburger menu and drawer navigation
- **Professional Animations**: Page transitions, shimmer effects, smooth scrolling
- **Typography**: Dynamic gradients (white→gray dark mode, blue→purple light mode)
- **Custom Scrollbar**: Orion-themed webkit scrollbar with smooth behavior

### 📊 Pages
- **Dashboard**: 4 stat cards (Total, Latest, Remote %, Salary %), Top Skills/Locations insights, Trend + Companies charts, Work modalities breakdown
- **Job Listings**: Premium glassmorphism cards with seniority badges, save/share actions, paginated (12/page), advanced filters (skills, salary range, seniority), toast notifications, empty states
- **Job Details**: Full job info, save/share actions with toast feedback, similar jobs recommendations, breadcrumb navigation

### 🎯 Interactive Components
- **Job Cards**: Enhanced with hover effects, quick save/share buttons, seniority badges, time-ago display
- **Toast Notifications**: Success/info/warning/error feedback with Material UI Alert
- **Empty States**: Illustrated no-results and error states with helpful messaging
- **Advanced Filters**: Collapsible filter panel with skills multi-select, salary slider, seniority selection
- **Skeleton Loaders**: Shimmer animation effect for loading states
- **Mobile Menu**: Drawer navigation with glassmorphism styling

### 🎯 Components
- **Layout**: Header with navigation and theme toggle
- **Charts**: Trend and Top Companies visualizations
- **Cards**: Glassmorphism effect with hover animations
- **Footer**: Professional 3-column layout with branding

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://orionjobs-api.azurewebsites.net
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── FeaturedJob.tsx
│   │   └── charts/      # Chart components
│   ├── contexts/        # React contexts
│   │   └── ThemeContext.tsx
│   ├── pages/           # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── JobsList.tsx
│   │   └── JobDetails.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript definitions
│   │   └── job.ts
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json
```

## 🎨 Theme Customization

The app uses a custom Material UI theme with:
- **Primary**: Orion Blue (#304ffe)
- **Secondary**: Orion Purple (#7c4dff)
- **Accent**: Golden Orange (#ffa726)
- **Dark Mode**: Custom dark palette with glassmorphism
- **Light Mode**: Clean white palette with subtle shadows

## 🔗 API Integration

The frontend connects to the OrionJobs API:
- Base URL: `https://orionjobs-api.azurewebsites.net`
- Endpoints: `/api/v1/jobs`, `/api/v1/summary/daily`
- Features: Pagination, filtering, search

## 🚀 Deployment

The frontend is configured for Azure Static Web Apps deployment with:
- Build command: `npm run build`
- Output directory: `dist`
- Automatic deployment via GitHub Actions

## 📝 License

MIT License - See LICENSE file for details
