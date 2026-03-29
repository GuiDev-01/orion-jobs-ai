import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import LoadingState from '@/components/common/LoadingState';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const JobsList = lazy(() => import('./pages/JobsList'));
const JobDetails = lazy(() => import('./pages/JobDetails'));

// Page transition variants
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  }
};

function AnimatedRoutes() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<LoadingState title="Loading dashboard" description="Preparing market intelligence view." />}>
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Dashboard />
            </motion.div>
          </Suspense>
        } />
        <Route path="/jobs" element={
          <Suspense fallback={<LoadingState title="Loading jobs" description="Fetching latest opportunities." />}>
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <JobsList />
            </motion.div>
          </Suspense>
        } />
        <Route path="/jobs/:id" element={
          <Suspense fallback={<LoadingState title="Loading job details" description="Assembling role insights and AI analysis." />}>
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <JobDetails />
            </motion.div>
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;