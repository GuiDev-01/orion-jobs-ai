import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  Alert,
  Paper,
  Grid,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import { jobsApi } from '../services/api';
import type { Job } from '../types/job';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobDetails() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await jobsApi.getJobById(parseInt(id));
        setJob(data);
      } catch (err) {
        setError('Failed to load job details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return <JobDetailsSkeleton />;
  }

  // Error state
  if (error || !job) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/jobs')}
          sx={{ mb: 2 }}
        >
          Back to Jobs
        </Button>
        <Alert severity="error">
          {error || 'Job not found'}
        </Alert>
      </Box>
    );
  }

  // Format date
  const jobDate = new Date(job.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }} aria-label="breadcrumb">
        <Link
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="/jobs"
          onClick={(e) => {
            e.preventDefault();
            navigate('/jobs');
          }}
          sx={{ cursor: 'pointer' }}
        >
          Jobs
        </Link>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/jobs')}
        sx={{ mb: 3 }}
      >
        Back to Jobs
      </Button>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Main Info */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{
            background: isDark 
              ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.8) 0%, rgba(19, 47, 76, 0.4) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(48, 79, 254, 0.15)',
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Job Title */}
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: isDark 
                    ? 'linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)'
                    : 'linear-gradient(135deg, #1a237e 0%, #304ffe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {job.title}
              </Typography>

              {/* Company and Location */}
              <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary">
                    {job.company}
                  </Typography>
                </Box>

                {job.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Chip label={job.work_modality} color="primary" size="small" />
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Job Description */}
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                {job.description || 'No description available.'}
              </Typography>

              {/* Tags/Skills */}
              {job.tags && job.tags.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.tags.map((tag) => (
                      <Chip key={tag} label={tag} variant="outlined" />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Details Card */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              position: 'sticky', 
              top: 20,
              background: isDark 
                ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.9) 0%, rgba(19, 47, 76, 0.6) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(20px)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(48, 79, 254, 0.15)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Job Details
            </Typography>

            <Stack spacing={2.5} sx={{ mt: 3 }}>
              {/* Salary */}
              {(job.salary_min || job.salary_max) && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Salary Range
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="success.main">
                    ${job.salary_min?.toLocaleString() || '?'} - $
                    {job.salary_max?.toLocaleString() || '?'}
                  </Typography>
                </Box>
              )}

              {/* Work Modality */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Work Type
                  </Typography>
                </Box>
                <Typography variant="body1">{job.work_modality}</Typography>
              </Box>

              {/* Contract Type */}
              {job.contract_type && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Contract Type
                  </Typography>
                  <Typography variant="body1">{job.contract_type}</Typography>
                </Box>
              )}

              {/* Posted Date */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted On
                  </Typography>
                </Box>
                <Typography variant="body1">{jobDate}</Typography>
              </Box>

              {/* Source */}
              {job.source && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Source
                  </Typography>
                  <Chip label={job.source} size="small" variant="outlined" />
                </Box>
              )}
            </Stack>

            {/* Apply Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<OpenInNewIcon />}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                mt: 4,
                background: 'linear-gradient(135deg, #ffa726 0%, #ff7043 100%)',
                color: '#fff',
                fontWeight: 700,
                py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff7043 0%, #ffa726 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(255, 167, 38, 0.4)',
                },
              }}
            >
              Apply Now
            </Button>

            {/* Warning for Adzuna */}
            {job.source === 'adzuna' && (
              <Alert severity="warning" sx={{ mt: 2, fontSize: '0.75rem' }}>
                This job is from Adzuna. The link may redirect multiple times.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// Skeleton Loader for Job Details
function JobDetailsSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width={150} height={36} sx={{ mb: 3, borderRadius: 1 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="70%" height={50} />
              <Skeleton variant="text" width="50%" height={30} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 3 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}