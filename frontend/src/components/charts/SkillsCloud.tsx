import { Box, Chip, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import type { Job } from '../../types/job';

interface SkillsCloudProps {
  jobs: Job[];
  maxSkills?: number;
}

export default function SkillsCloud({ jobs, maxSkills = 20 }: SkillsCloudProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Extract and count all skills/tags from jobs
  const skillCounts: Record<string, number> = {};
  
  jobs.forEach(job => {
    if (job.tags && Array.isArray(job.tags)) {
      job.tags.forEach(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        if (normalizedTag && normalizedTag.length > 1) {
          skillCounts[normalizedTag] = (skillCounts[normalizedTag] || 0) + 1;
        }
      });
    }
  });

  // Sort by count and take top skills
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxSkills);

  if (topSkills.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No skills data available
        </Typography>
      </Box>
    );
  }

  // Calculate font sizes based on frequency
  const maxCount = topSkills[0][1];
  const minCount = topSkills[topSkills.length - 1][1];

  const getSkillSize = (count: number): 'small' | 'medium' => {
    const ratio = (count - minCount) / (maxCount - minCount || 1);
    return ratio > 0.5 ? 'medium' : 'small';
  };

  const getSkillColor = (index: number): string => {
    const colors = [
      '#304ffe', // Primary blue
      '#7c4dff', // Purple
      '#ffa726', // Orange
      '#26a69a', // Teal
      '#ec407a', // Pink
      '#42a5f5', // Light blue
      '#66bb6a', // Green
      '#ab47bc', // Deep purple
    ];
    return colors[index % colors.length];
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        justifyContent: 'center',
        py: 2,
      }}
    >
      {topSkills.map(([skill, count], index) => (
        <motion.div
          key={skill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
        >
          <Chip
            label={`${skill} (${count})`}
            size={getSkillSize(count)}
            sx={{
              background: alpha(getSkillColor(index), isDark ? 0.2 : 0.1),
              color: isDark ? getSkillColor(index) : alpha(getSkillColor(index), 0.9),
              border: '1px solid ' + alpha(getSkillColor(index), 0.3),
              fontWeight: 600,
              fontSize: getSkillSize(count) === 'medium' ? '0.9rem' : '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: alpha(getSkillColor(index), isDark ? 0.3 : 0.2),
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px ' + alpha(getSkillColor(index), 0.3),
              },
            }}
          />
        </motion.div>
      ))}
    </Box>
  );
}