import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Alert,
  Pagination,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
  Skeleton,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { jobsApi } from '../services/api';
import type { Job, JobsResponse } from '../types/job';

export default function JobsList() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await jobsApi.getJobs({
          page: currentPage,
          page_size: pageSize,
          search: searchTerm || undefined,
          remote: remoteOnly || undefined,
        });
        
        setData(response);
      } catch (err) {
        setError('Failed to load jobs. Please check if the API is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, remoteOnly, currentPage]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
          Job Listings
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <WorkIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
          {data ? `Browse ${data.total.toLocaleString()} available positions` : 'Loading jobs...'}
        </Typography>
      </Box>

      {/* Filters Section */}
      <Card sx={{ 
        mb: 3,
        background: isDark 
          ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.8) 0%, rgba(19, 47, 76, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(48, 79, 254, 0.15)',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search by job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Remote only"
              />
            </Box>
          </Box>

          {(searchTerm || remoteOnly) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    onDelete={() => setSearchTerm('')}
                    size="small"
                  />
                )}
                {remoteOnly && (
                  <Chip
                    label="Remote only"
                    onDelete={() => setRemoteOnly(false)}
                    size="small"
                    color="primary"
                  />
                )}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Jobs Grid with stagger animation */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
          '& > *': {
            animation: 'fadeInUp 0.6s ease-out',
            animationFillMode: 'both',
          },
          '& > *:nth-of-type(1)': { animationDelay: '0.05s' },
          '& > *:nth-of-type(2)': { animationDelay: '0.1s' },
          '& > *:nth-of-type(3)': { animationDelay: '0.15s' },
          '& > *:nth-of-type(4)': { animationDelay: '0.2s' },
          '& > *:nth-of-type(5)': { animationDelay: '0.25s' },
          '& > *:nth-of-type(6)': { animationDelay: '0.3s' },
          '@keyframes fadeInUp': {
            from: {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {loading ? (
          // Loading skeletons
          Array.from(new Array(pageSize)).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))
        ) : data && data.jobs.length > 0 ? (
          // Actual job cards
          data.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Alert severity="info">
              No jobs found. Try adjusting your filters.
            </Alert>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}

// Skeleton Loader Component
function JobCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" width="30%" height={24} sx={{ mt: 2, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', gap: 0.5, mt: 2 }}>
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 2 }} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2, borderRadius: 1 }} />
      </CardContent>
    </Card>
  );
}

// Job Card Component with animation
interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      sx={(theme) => ({
        // Glassmorphism effect that works in both modes
        background: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : '#ffffff',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        
        // Smooth transitions
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Hover effects
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(102, 126, 234, 0.4)'
            : '0 12px 40px rgba(102, 126, 234, 0.25)',
          border: '1px solid rgba(102, 126, 234, 0.6)',
        },
      })}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Job title with gradient */}
          <Typography 
            variant="h6" 
            gutterBottom 
            noWrap 
            title={job.title}
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {job.title}
          </Typography>

          {/* Company */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {job.company}
            </Typography>
          </Box>

          {/* Location */}
          {job.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {job.location}
              </Typography>
            </Box>
          )}

          {/* Work modality with gradient */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
            <Chip 
              label={job.work_modality} 
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 500,
                border: 'none',
              }}
            />
          </Box>

          {/* Salary */}
          {(job.salary_min || job.salary_max) && (
            <Typography variant="body2" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
              ${job.salary_min?.toLocaleString() || '?'} - ${job.salary_max?.toLocaleString() || '?'}
            </Typography>
          )}

          {/* Tags with better styling */}
          {job.tags && job.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {job.tags.slice(0, 3).map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={(theme) => ({
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(102, 126, 234, 0.5)'
                      : 'rgba(102, 126, 234, 0.6)',
                    color: theme.palette.mode === 'dark'
                      ? 'rgba(102, 126, 234, 1)'
                      : '#667eea',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  })}
                />
              ))}
              {job.tags.length > 3 && (
                <Chip 
                  label={`+${job.tags.length - 3}`} 
                  size="small" 
                  variant="outlined"
                  sx={(theme) => ({
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(102, 126, 234, 0.5)'
                      : 'rgba(102, 126, 234, 0.6)',
                    color: theme.palette.mode === 'dark'
                      ? 'rgba(102, 126, 234, 1)'
                      : '#667eea',
                    fontWeight: 500,
                  })}
                />
              )}
            </Box>
          )}

          {/* View Job button with gradient */}
          <Button
            variant="contained"
            fullWidth
            endIcon={<OpenInNewIcon />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(job.url, '_blank');
            }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              py: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            View Job
          </Button>
        </CardContent>
      </Card>
  );
}