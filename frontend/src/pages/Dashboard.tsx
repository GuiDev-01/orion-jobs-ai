import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Chip, Box, CircularProgress, useTheme, alpha } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { jobsApi } from '../services/api';
import type { DailySummaryResponse } from '../types/job';
import TrendChart from '../components/charts/TrendChart';
import TopCompaniesChart from '../components/charts/TopCompaniesChart';

// Smooth animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Icon wrapper with gradient background
const iconWrapperSx = (gradient: string) => ({
  width: 56,
  height: 56,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: gradient,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  mr: 2,
});

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [data, setData] = useState<DailySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Theme-aware glassmorphism card style
  const glassCardSx = {
    background: isDark 
      ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.8) 0%, rgba(19, 47, 76, 0.4) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'blur(20px)',
    border: isDark 
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid rgba(48, 79, 254, 0.15)',
    borderRadius: 3,
    boxShadow: isDark
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(48, 79, 254, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: isDark
        ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(48, 79, 254, 0.15)'
        : '0 20px 40px rgba(48, 79, 254, 0.2), 0 0 40px rgba(255, 167, 38, 0.1)',
      border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
    },
  };
  
  // Theme-aware text colors
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

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
      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h3" 
            sx={{
              fontWeight: 800,
              background: isDark 
                ? 'linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)'
                : 'linear-gradient(135deg, #1a237e 0%, #304ffe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: textSecondary,
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AutoGraphIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
            Real-time overview of the developer job market
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Total Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #ffa726 0%, #ff7043 100%)')}>
                    <WorkIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      Total Jobs
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: textPrimary, lineHeight: 1.1 }}>
                      {totalJobs.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  pt: 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50', animation: 'pulse 2s infinite' }} />
                  <Typography variant="caption" sx={{ color: textSecondary }}>
                    Last 24 hours
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Latest Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #42a5f5 0%, #7c4dff 100%)')}>
                    <TrendingUpIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      Displayed
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: textPrimary, lineHeight: 1.1 }}>
                      {latestJobs.length}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  pt: 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Typography variant="caption" sx={{ color: textSecondary }}>
                    Most recent positions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Work Modalities Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #26a69a 0%, #00897b 100%)')}>
                    <BusinessCenterIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      Work Types
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(modalityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([modality, count]) => (
                      <Chip
                        key={modality}
                        label={`${modality} (${count})`}
                        size="small"
                        sx={{
                          background: alpha(theme.palette.secondary.main, 0.15),
                          color: 'secondary.main',
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                          fontWeight: 600,
                          '&:hover': {
                            background: alpha(theme.palette.secondary.main, 0.25),
                          },
                        }}
                      />
                    ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Trend Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{
              ...glassCardSx,
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: textPrimary,
                    mb: 0.5,
                  }}
                >
                  Job Posting Trends
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: textSecondary, mb: 3 }}
                >
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
            <Card sx={{
              ...glassCardSx,
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: textPrimary,
                    mb: 0.5,
                  }}
                >
                  Top Companies Hiring
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: textSecondary, mb: 3 }}
                >
                  Companies with most job openings
                </Typography>
                <TopCompaniesChart jobs={data.jobs} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Companies Tags Section */}
      <motion.div variants={itemVariants}>
        <Card sx={glassCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: textPrimary,
                mb: 2,
              }}
            >
              Companies Hiring
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                    sx={{
                      background: alpha(theme.palette.text.primary, 0.05),
                      color: alpha(theme.palette.text.primary, 0.8),
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.2),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  />
                ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
}