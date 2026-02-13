import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Chip, Box, CircularProgress, useTheme, alpha, Tooltip, LinearProgress } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InsightsIcon from '@mui/icons-material/Insights';
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

  // Calculate metrics with insights
  const modalityCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  let remoteCount = 0;
  let withSalaryCount = 0;
  
  data.jobs.forEach(job => {
    // Work modality
    const modality = job.work_modality || 'Unknown';
    modalityCounts[modality] = (modalityCounts[modality] || 0) + 1;
    if (modality.toLowerCase().includes('remote')) remoteCount++;
    
    // Location
    if (job.location) {
      const location = job.location.split(',')[0].trim();
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    }
    
    // Skills/Tags
    if (job.tags && job.tags.length > 0) {
      job.tags.slice(0, 3).forEach(tag => {
        skillCounts[tag] = (skillCounts[tag] || 0) + 1;
      });
    }
    
    // Salary
    if (job.salary_min || job.salary_max) withSalaryCount++;
  });

  const remotePercentage = Math.round((remoteCount / totalJobs) * 100);
  const salaryPercentage = Math.round((withSalaryCount / totalJobs) * 100);
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: { xs: 3, md: 5 } }}>
          <Typography 
            variant="h3" 
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
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
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AutoGraphIcon sx={{ fontSize: { xs: 16, md: 20 }, color: 'secondary.main' }} />
            Real-time overview of the developer job market
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 5 } }}>
        {/* Total Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  justifyContent: 'space-between',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50', animation: 'pulse 2s infinite' }} />
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      Live tracking
                    </Typography>
                  </Box>
                  <Tooltip title="Total positions available" arrow>
                    <Chip 
                      icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                      label="Active" 
                      size="small"
                      sx={{ 
                        height: 20,
                        fontSize: '0.7rem',
                        backgroundColor: alpha('#4caf50', 0.15),
                        color: '#4caf50',
                        border: `1px solid ${alpha('#4caf50', 0.3)}`,
                      }}
                    />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Latest Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

        {/* Remote Jobs Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #26a69a 0%, #00897b 100%)')}>
                    <LocationOnIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      Remote Jobs
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: textPrimary, lineHeight: 1.1 }}>
                      {remotePercentage}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  pt: 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      {remoteCount.toLocaleString()} of {totalJobs.toLocaleString()} positions
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={remotePercentage} 
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha('#26a69a', 0.15),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #26a69a 0%, #00897b 100%)',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Salary Info Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)')}>
                    <InsightsIcon sx={{ color: '#fff', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                      With Salary
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: textPrimary, lineHeight: 1.1 }}>
                      {salaryPercentage}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  pt: 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      {withSalaryCount.toLocaleString()} positions disclosed
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={salaryPercentage} 
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha('#ab47bc', 0.15),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #ab47bc 0%, #8e24aa 100%)',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Insights Section - New */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 5 } }}>
        {/* Top Skills Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #ff7043 0%, #ff5722 100%)')}>
                    <CodeIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: textPrimary }}>
                      Most In-Demand Skills
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      Top technologies hiring right now
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topSkills.length > 0 ? topSkills.map(([skill, count], index) => {
                    const percentage = Math.round((count / totalJobs) * 100);
                    const colors = ['#ff5722', '#ff7043', '#ff8a65', '#ffab91', '#ffccbc'];
                    return (
                      <Box key={skill}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: textPrimary }}>
                            {skill}
                          </Typography>
                          <Typography variant="body2" sx={{ color: textSecondary }}>
                            {count} jobs ({percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(colors[index] || '#ff5722', 0.15),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: colors[index] || '#ff5722',
                            },
                          }}
                        />
                      </Box>
                    );
                  }) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <CodeIcon sx={{ fontSize: 48, color: alpha(textSecondary, 0.3), mb: 1 }} />
                      <Typography variant="body2" sx={{ color: textSecondary }}>
                        No skill data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Top Locations Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)')}>
                    <LocationOnIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: textPrimary }}>
                      Top Hiring Locations
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      Cities with most opportunities
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topLocations.length > 0 ? topLocations.map(([location, count], index) => {
                    const percentage = Math.round((count / totalJobs) * 100);
                    const colors = ['#3f51b5', '#5c6bc0', '#7986cb'];
                    return (
                      <Box key={location}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: textPrimary }}>
                            {location}
                          </Typography>
                          <Typography variant="body2" sx={{ color: textSecondary }}>
                            {count} jobs ({percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(colors[index] || '#3f51b5', 0.15),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: colors[index] || '#3f51b5',
                            },
                          }}
                        />
                      </Box>
                    );
                  }) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <LocationOnIcon sx={{ fontSize: 48, color: alpha(textSecondary, 0.3), mb: 1 }} />
                      <Typography variant="body2" sx={{ color: textSecondary }}>
                        No location data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {/* Trend Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{
              ...glassCardSx,
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <ShowChartIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: textPrimary,
                        }}
                      >
                        Job Posting Trends
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ color: textSecondary }}
                    >
                      Daily job posting activity
                    </Typography>
                  </Box>
                  <Tooltip title="Based on last 30 days of data" arrow>
                    <Chip 
                      label="30 Days" 
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                        color: 'secondary.main',
                        fontWeight: 600,
                      }}
                    />
                  </Tooltip>
                </Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <BusinessCenterIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: textPrimary,
                        }}
                      >
                        Top Companies Hiring
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ color: textSecondary }}
                    >
                      Companies with most openings
                    </Typography>
                  </Box>
                  <Tooltip title="Top 10 companies by job count" arrow>
                    <Chip 
                      label="Top 10" 
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                        color: 'secondary.main',
                        fontWeight: 600,
                      }}
                    />
                  </Tooltip>
                </Box>
                <TopCompaniesChart jobs={data.jobs} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Companies & Work Modalities Section */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Companies Hiring */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}>
                    <BusinessCenterIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: textPrimary,
                      }}
                    >
                      Companies Hiring
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      {Object.keys(data.jobs.reduce((acc, job) => ({ ...acc, [job.company]: true }), {})).length} companies actively recruiting
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(
                    data.jobs.reduce((acc, job) => {
                      acc[job.company] = (acc[job.company] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 24)
                    .map(([company, count]) => (
                      <Tooltip key={company} title={`${count} open position${count > 1 ? 's' : ''}`} arrow>
                        <Chip
                          label={`${company} (${count})`}
                          component={motion.div}
                          whileHover={{ 
                            scale: 1.05,
                            y: -2,
                          }}
                          whileTap={{ scale: 0.95 }}
                          sx={{
                            background: isDark 
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette.primary.main, 0.08),
                            color: isDark 
                              ? alpha(theme.palette.primary.light, 0.9)
                              : theme.palette.primary.dark,
                            border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15)}`,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.25),
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            },
                            '&:active': {
                              transform: 'scale(0.95)',
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Work Modalities Breakdown */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div variants={itemVariants}>
            <Card sx={glassCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={iconWrapperSx('linear-gradient(135deg, #ec407a 0%, #d81b60 100%)')}>
                    <WorkIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: textPrimary,
                      }}
                    >
                      Work Modalities
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      Distribution by type
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {Object.entries(modalityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([modality, count]) => {
                      const percentage = Math.round((count / totalJobs) * 100);
                      return (
                        <Box key={modality}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: textPrimary }}>
                              {modality}
                            </Typography>
                            <Typography variant="body2" sx={{ color: textSecondary }}>
                              {percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: alpha('#ec407a', 0.15),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #ec407a 0%, #d81b60 100%)',
                              },
                            }}
                          />
                        </Box>
                      );
                    })}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

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