import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Chip, Box, CircularProgress } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion'; // ← Import como type
import { jobsApi } from '../services/api';
import type { DailySummaryResponse } from '../types/job';
import TrendChart from '../components/charts/TrendChart';
import TopCompaniesChart from '../components/charts/TopCompaniesChart';

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// ... resto do arquivo permanece igual

export default function Dashboard() {
  const [data, setData] = useState<DailySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const summary = await jobsApi.getDailySummary({ days: 30 });
        setData(summary);
      } catch (err) {
        setError('Failed to load data. Please check if the API is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const totalJobs = data.jobs.length;
  const latestJobs = data.jobs.slice(0, 50);

  // Count work modalities
  const modalityCounts: Record<string, number> = {};
  data.jobs.forEach(job => {
    const modality = job.work_modality || 'Unknown';
    modalityCounts[modality] = (modalityCounts[modality] || 0) + 1;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Title with fade-in */}
      <motion.div variants={itemVariants}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Overview of the developer job market
        </Typography>
      </motion.div>

      {/* Stats Cards with stagger animation */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Jobs</Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                  {totalJobs}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Collected positions (last 1 day)
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Latest Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Latest Jobs</Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                  {latestJobs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing recent positions
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Work Modalities Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessCenterIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Work Modalities</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(modalityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([modality, count]) => (
                      <Chip
                        key={modality}
                        label={`${modality} (${count})`}
                        color="primary"
                        size="small"
                      />
                    ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts with stagger animation */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Trend Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Job Posting Trends
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Number of jobs posted over time
                </Typography>
                <TrendChart jobs={data.jobs} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Top Companies Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Companies Hiring
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Companies with most job openings
                </Typography>
                <TopCompaniesChart jobs={data.jobs} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Top Companies List */}
      <motion.div variants={itemVariants}>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Companies Hiring
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {Object.entries(
                data.jobs.reduce((acc, job) => {
                  acc[job.company] = (acc[job.company] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 20)
                .map(([company, count]) => (
                  <Chip
                    key={company}
                    label={`${company} (${count})`}
                    variant="outlined"
                  />
                ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}