import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { jobsApi } from '../services/api';
import type { Job, JobsResponse } from '../types/job';

export default function JobsList() {
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

  // Error state
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Job Listings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {data ? `Browse ${data.total} available positions` : 'Loading jobs...'}
      </Typography>

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
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
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
            </Grid>
          </Grid>

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

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Skeleton loaders while loading
          Array.from(new Array(pageSize)).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <JobCardSkeleton />
            </Grid>
          ))
        ) : data && data.jobs.length > 0 ? (
          // Actual job cards
          data.jobs.map((job) => (
            <Grid key={job.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <JobCard job={job} />
            </Grid>
          ))
        ) : (
          // No results
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              No jobs found. Try adjusting your filters.
            </Alert>
          </Grid>
        )}
      </Grid>

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

// Job Card Component
interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap title={job.title}>
          {job.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BusinessIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {job.company}
          </Typography>
        </Box>

        {job.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {job.location}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
          <Chip label={job.work_modality} size="small" color="primary" />
        </Box>

        {(job.salary_min || job.salary_max) && (
          <Typography variant="body2" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
            ${job.salary_min?.toLocaleString() || '?'} - ${job.salary_max?.toLocaleString() || '?'}
          </Typography>
        )}

        {job.tags && job.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {job.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
            {job.tags.length > 3 && (
              <Chip label={`+${job.tags.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          endIcon={<OpenInNewIcon />}
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Job
        </Button>
      </CardContent>
    </Card>
  );
}