import { Box, Typography, Chip, Button, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import type { Job } from '../types/job';

interface FeaturedJobProps {
  job: Job;
}

export default function FeaturedJob({ job }: FeaturedJobProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(48, 79, 254, 0.15) 0%, rgba(124, 77, 255, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(48, 79, 254, 0.08) 0%, rgba(124, 77, 255, 0.05) 100%)',
          border: '1px solid ' + alpha(theme.palette.primary.main, 0.3),
          borderRadius: 3,
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px ' + alpha(theme.palette.primary.main, 0.2),
          },
        }}
      >
        {/* Featured badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <StarIcon sx={{ fontSize: 16, color: '#000' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#000' }}>
            Featured
          </Typography>
        </Box>

        {/* Job title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
            pr: 10,
          }}
        >
          {job.title}
        </Typography>

        {/* Company and location */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BusinessIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
              {job.company}
            </Typography>
          </Box>

          {job.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {job.location}
              </Typography>
            </Box>
          )}

          {job.work_modality && (
            <Chip
              icon={<WorkIcon sx={{ fontSize: 14 }} />}
              label={job.work_modality}
              size="small"
              sx={{
                background: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                border: '1px solid ' + alpha(theme.palette.success.main, 0.3),
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Skills */}
        {job.tags && job.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {job.tags.slice(0, 5).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                }}
              />
            ))}
            {job.tags.length > 5 && (
              <Chip
                label={`+${job.tags.length - 5} more`}
                size="small"
                sx={{
                  background: alpha(theme.palette.text.primary, 0.05),
                  color: theme.palette.text.secondary,
                }}
              />
            )}
          </Box>
        )}

        {/* Apply button */}
        <Button
          variant="contained"
          endIcon={<OpenInNewIcon />}
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            background: 'linear-gradient(135deg, #304ffe 0%, #7c4dff 100%)',
            color: '#ffffff',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #1a237e 0%, #5e35b1 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px ' + alpha(theme.palette.primary.main, 0.4),
            },
          }}
        >
          View Job
        </Button>
      </Box>
    </motion.div>
  );
}