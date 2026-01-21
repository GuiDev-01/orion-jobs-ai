import { useEffect, useState } from 'react';
import { 
  Grid,
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Alert,
  Chip,
  Box
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { jobsApi } from '../services/api';
import type { DailySummaryResponse } from '../types/job';
import TrendChart from '../components/charts/TrendChart';
import TopCompaniesChart from '../components/charts/TopCompaniesChart';

export default function Dashboard() {
  const [data, setData] = useState<DailySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await jobsApi.getDailySummary({ days: 7 });
        setData(response);
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
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <Alert severity="info">No data available</Alert>;
  }

  const { summary, jobs } = data;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Overview of the developer job market
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Jobs</Typography>
              </div>
              <Typography variant="h3">{summary.total_jobs}</Typography>
              <Typography variant="body2" color="text.secondary">
                Collected positions (last {summary.period_days} day{summary.period_days > 1 ? 's' : ''})
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Latest Jobs</Typography>
              </div>
              <Typography variant="h3">{jobs.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Showing recent positions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <BusinessIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Work Modalities</Typography>
              </div>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {summary.work_modalities.map((modality) => (
                  <Chip key={modality} label={modality} color="primary" size="small" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Trend Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <TrendChart jobs={jobs} />
        </Grid>

        {/* Top Companies Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <TopCompaniesChart companies={summary.top_companies} />
        </Grid>
      </Grid>

      {/* Top Companies List (keeping the original) */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Companies Hiring
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {summary.top_companies.map((company) => (
                  <Chip key={company} label={company} variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}