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
  Pagination,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
  Skeleton,
  useTheme,
  Tooltip,
  Divider,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import TuneIcon from '@mui/icons-material/Tune';
import { jobsApi } from '../services/api';
import type { Job, JobsResponse } from '../types/job';
import { formatDistanceToNow } from 'date-fns';

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

  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 300000]);
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);

  // Available options (would come from API in production)
  const availableSkills = ['React', 'TypeScript', 'Python', 'Node.js', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB'];
  const seniorityLevels = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];

  // Toast notification states
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({ open: false, message: '', severity: 'info' });

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

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
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <WorkOffIcon 
          sx={{ 
            fontSize: 120, 
            color: 'error.main',
            opacity: 0.5,
            filter: 'drop-shadow(0 8px 16px rgba(239, 68, 68, 0.3))',
          }} 
        />
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Connection Error
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 4,
            py: 1.5,
          }}
        >
          Retry Connection
        </Button>
      </Box>
    );
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
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
          Job Listings
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <WorkIcon sx={{ fontSize: { xs: 16, md: 20 }, color: 'secondary.main' }} />
          {data ? `Browse ${data.total.toLocaleString()} available positions` : 'Loading jobs...'}
        </Typography>
      </Box>

      {/* Filters Section */}
      <Card sx={{ 
        mb: { xs: 2, md: 3 },
        background: isDark 
          ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.8) 0%, rgba(19, 47, 76, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(48, 79, 254, 0.15)',
      }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 3 } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search by job title, company, or keywords..."
                size={isDark ? 'medium' : 'medium'}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  },
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
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  },
                }}
              />
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              sx={{
                borderRadius: 2,
                whiteSpace: 'nowrap',
                height: 'fit-content',
                alignSelf: 'center',
              }}
            >
              Filters
            </Button>
          </Box>

          {/* Advanced Filters */}
          <Collapse in={showAdvancedFilters}>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Skills Multi-Select */}
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(e.target.value as string[])}
                  input={<OutlinedInput label="Skills" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableSkills.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Salary Range Slider */}
              <Box>
                <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon fontSize="small" />
                  Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={salaryRange}
                  onChange={(_e, newValue) => setSalaryRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={300000}
                  step={10000}
                  valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Seniority Level */}
              <FormControl fullWidth>
                <InputLabel>Seniority Level</InputLabel>
                <Select
                  multiple
                  value={selectedSeniority}
                  onChange={(e) => setSelectedSeniority(e.target.value as string[])}
                  input={<OutlinedInput label="Seniority Level" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" color="secondary" />
                      ))}
                    </Box>
                  )}
                >
                  {seniorityLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Clear All Filters */}
              {(selectedSkills.length > 0 || salaryRange[0] > 0 || salaryRange[1] < 300000 || selectedSeniority.length > 0) && (
                <Button
                  variant="text"
                  onClick={() => {
                    setSelectedSkills([]);
                    setSalaryRange([0, 300000]);
                    setSelectedSeniority([]);
                  }}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Clear Advanced Filters
                </Button>
              )}
            </Box>
          </Collapse>

          {(searchTerm || remoteOnly) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
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
          gap: { xs: 2, md: 3 },
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
            <JobCard key={job.id} job={job} showToast={showToast} />
          ))
        ) : (
          // Empty State
          <Box 
            sx={{ 
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              gap: 3,
              py: 8,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {searchTerm || remoteOnly ? (
                <SearchOffIcon 
                  sx={{ 
                    fontSize: 120, 
                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    filter: isDark 
                      ? 'drop-shadow(0 8px 24px rgba(102, 126, 234, 0.3))'
                      : 'drop-shadow(0 8px 24px rgba(102, 126, 234, 0.2))',
                  }} 
                />
              ) : (
                <WorkOffIcon 
                  sx={{ 
                    fontSize: 120, 
                    color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    filter: isDark 
                      ? 'drop-shadow(0 8px 24px rgba(102, 126, 234, 0.3))'
                      : 'drop-shadow(0 8px 24px rgba(102, 126, 234, 0.2))',
                  }} 
                />
              )}
            </Box>

            <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1.5,
                  background: isDark 
                    ? 'linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)'
                    : 'linear-gradient(135deg, #1a237e 0%, #304ffe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {searchTerm || remoteOnly ? 'No Results Found' : 'No Jobs Available'}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {searchTerm || remoteOnly 
                  ? `We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.`
                  : 'There are currently no job listings available. Please check back later.'}
              </Typography>

              {(searchTerm || remoteOnly) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setRemoteOnly(false);
                    setCurrentPage(1);
                  }}
                  sx={{
                    borderColor: isDark ? 'rgba(102, 126, 234, 0.5)' : 'rgba(102, 126, 234, 0.7)',
                    color: isDark ? '#a5b4fc' : '#667eea',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, md: 4 } }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPagination-ul': {
                flexWrap: 'wrap',
                justifyContent: 'center',
              },
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '0.875rem', md: '1rem' },
                minWidth: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
              },
            }}
          />
        </Box>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={handleCloseToast} 
          severity={toast.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

// Skeleton Loader Component - Enhanced with shimmer animation
function JobCardSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.6) 0%, rgba(19, 47, 76, 0.3) 100%)' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: isDark
          ? '1px solid rgba(102, 126, 234, 0.2)'
          : '1px solid rgba(102, 126, 234, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
          animation: 'shimmer 2s infinite',
        },
        '@keyframes shimmer': {
          '0%': {
            left: '-100%',
          },
          '100%': {
            left: '100%',
          },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Skeleton 
          variant="text" 
          width="85%" 
          height={32} 
          sx={{ mb: 1.5, borderRadius: 1 }}
        />
        
        {/* Company */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Skeleton variant="circular" width={18} height={18} sx={{ mr: 0.75 }} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
        
        {/* Location & Time */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Skeleton variant="text" width="40%" height={18} />
          <Skeleton variant="text" width="35%" height={18} />
        </Box>
        
        {/* Badges */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 2 }} />
        </Box>
        
        {/* Divider */}
        <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 2 }} />
        
        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.75, mb: 2, flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" width={65} height={22} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={75} height={22} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={55} height={22} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 2 }} />
        </Box>
        
        {/* Button */}
        <Skeleton 
          variant="rounded" 
          width="100%" 
          height={42} 
          sx={{ mt: 'auto', borderRadius: '12px' }} 
        />
      </CardContent>
    </Card>
  );
}

// Helper function to extract seniority from title
function extractSeniority(title: string): string | null {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('senior') || lowerTitle.includes('sr.')) return 'Senior';
  if (lowerTitle.includes('junior') || lowerTitle.includes('jr.')) return 'Junior';
  if (lowerTitle.includes('mid') || lowerTitle.includes('pleno')) return 'Mid-Level';
  if (lowerTitle.includes('lead') || lowerTitle.includes('tech lead')) return 'Lead';
  if (lowerTitle.includes('principal') || lowerTitle.includes('staff')) return 'Principal';
  if (lowerTitle.includes('intern') || lowerTitle.includes('trainee')) return 'Intern';
  return null;
}

// Helper function to get seniority color
function getSeniorityColor(seniority: string): string {
  const colors: Record<string, string> = {
    'Senior': '#f59e0b',
    'Lead': '#ef4444',
    'Principal': '#8b5cf6',
    'Mid-Level': '#3b82f6',
    'Junior': '#10b981',
    'Intern': '#06b6d4',
  };
  return colors[seniority] || '#6b7280';
}

// Job Card Component with animation
interface JobCardProps {
  job: Job;
  showToast: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => void;
}

function JobCard({ job, showToast }: JobCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isSaved, setIsSaved] = useState(false);
  
  const seniority = extractSeniority(job.title);
  const timeAgo = job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : null;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    showToast(
      newSavedState ? '✓ Job saved to favorites!' : 'Removed from favorites',
      newSavedState ? 'success' : 'info'
    );
    // TODO: Persist to backend/localStorage
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    navigator.clipboard.writeText(jobUrl);
    showToast('🔗 Link copied to clipboard!', 'success');
  };

  return (
    <Card
      sx={{
        // Glassmorphism effect with better depth
        background: isDark 
          ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.6) 0%, rgba(19, 47, 76, 0.3) 100%)' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: isDark
          ? '1px solid rgba(102, 126, 234, 0.2)'
          : '1px solid rgba(102, 126, 234, 0.15)',
        
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        
        // Smooth transitions
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Subtle gradient overlay on hover
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        },
        
        // Enhanced hover effects
        '&:hover': {
          transform: 'translateY(-12px) scale(1.01)',
          boxShadow: isDark
            ? '0 24px 80px rgba(102, 126, 234, 0.5), 0 0 60px rgba(124, 77, 255, 0.25), 0 0 0 2px rgba(102, 126, 234, 0.6)'
            : '0 24px 80px rgba(102, 126, 234, 0.35), 0 0 60px rgba(255, 167, 38, 0.15), 0 0 0 2px rgba(102, 126, 234, 0.5)',
          border: `1px solid ${isDark ? 'rgba(124, 77, 255, 0.7)' : 'rgba(102, 126, 234, 0.6)'}`,
          
          '&::before': {
            opacity: 1,
          },
          
          '& .save-button': {
            opacity: 1,
            transform: 'translateX(0)',
          },
          
          '& .view-details-btn': {
            background: 'linear-gradient(135deg, #651fff 0%, #5e35b1 100%)',
            boxShadow: isDark
              ? '0 8px 24px rgba(124, 77, 255, 0.5)'
              : '0 8px 24px rgba(102, 126, 234, 0.4)',
          },
        },
      }}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 } }}>
        {/* Header: Title + Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, md: 1.5 } }}>
          <Tooltip title={job.title} placement="top" arrow>
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.3,
                background: isDark
                  ? 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #667eea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1,
                mr: 1,
              }}
            >
              {job.title}
            </Typography>
          </Tooltip>
          
          {/* Quick Actions: Save & Share */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={isSaved ? "Saved" : "Save job"} placement="top">
              <IconButton
                className="save-button"
                size="small"
                onClick={handleSaveClick}
                sx={{
                  opacity: 0,
                  transform: 'translateX(8px)',
                  transition: 'all 0.3s ease',
                  color: isSaved ? '#fbbf24' : (isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'),
                  '&:hover': {
                    color: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    transform: 'scale(1.15)',
                  },
                }}
              >
                {isSaved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Share job" placement="top">
              <IconButton
                className="save-button"
                size="small"
                onClick={handleShareClick}
                sx={{
                  opacity: 0,
                  transform: 'translateX(8px)',
                  transition: 'all 0.3s ease',
                  transitionDelay: '0.05s',
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    color: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    transform: 'scale(1.15)',
                  },
                }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Company */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <BusinessIcon sx={{ fontSize: 18, mr: 0.75, color: 'text.secondary' }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
            noWrap
          >
            {job.company}
          </Typography>
        </Box>

        {/* Location & Time */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {job.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', flexShrink: 0 }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                }}
                noWrap
              >
                {job.location}
              </Typography>
            </Box>
          )}
          
          {timeAgo && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {timeAgo}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Badges: Seniority, Work Modality, Contract Type */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {seniority && (
            <Chip 
              label={seniority}
              size="small"
              sx={{
                backgroundColor: `${getSeniorityColor(seniority)}15`,
                color: getSeniorityColor(seniority),
                border: `1px solid ${getSeniorityColor(seniority)}40`,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '24px',
              }}
            />
          )}
          
          <Chip 
            label={job.work_modality} 
            size="small"
            icon={<WorkIcon sx={{ fontSize: 14, color: 'inherit !important' }} />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: '24px',
              border: 'none',
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
          
          {job.contract_type && (
            <Chip 
              label={job.contract_type}
              size="small"
              variant="outlined"
              sx={{
                borderColor: isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.5)',
                color: isDark ? '#c084fc' : '#a855f7',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '24px',
              }}
            />
          )}
        </Stack>

        {/* Salary */}
        {(job.salary_min || job.salary_max) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachMoneyIcon sx={{ fontSize: 18, mr: 0.5, color: '#10b981' }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#10b981',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              ${job.salary_min?.toLocaleString() || '?'} - ${job.salary_max?.toLocaleString() || '?'}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2, opacity: 0.1 }} />

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
            {job.tags.slice(0, 4).map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                sx={{
                  backgroundColor: isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)',
                  color: isDark ? '#a5b4fc' : '#667eea',
                  border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(102, 126, 234, 0.25)' : 'rgba(102, 126, 234, 0.15)',
                    borderColor: '#667eea',
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: `0 4px 8px ${isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              />
            ))}
            {job.tags.length > 4 && (
              <Chip 
                label={`+${job.tags.length - 4}`} 
                size="small" 
                sx={{
                  backgroundColor: isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.1)',
                  color: 'text.secondary',
                  border: `1px solid ${isDark ? 'rgba(156, 163, 175, 0.3)' : 'rgba(156, 163, 175, 0.2)'}`,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '22px',
                }}
              />
            )}
          </Box>
        )}

        {/* Spacer to push button to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* View Job button */}
        <Button
          className="view-details-btn"
          variant="contained"
          fullWidth
          endIcon={<OpenInNewIcon sx={{ transition: 'transform 0.3s ease' }} />}
          onClick={(e) => {
            e.stopPropagation();
            window.open(job.url, '_blank');
          }}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            py: 1.25,
            borderRadius: '12px',
            fontSize: '0.9rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #651fff 0%, #5e35b1 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(124, 77, 255, 0.5)',
              '& .MuiSvgIcon-root': {
                transform: 'translateX(4px)',
              },
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}