import { Box, Typography, useTheme, alpha } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const steps = [
  {
    icon: SearchIcon,
    title: 'Data Collection',
    description: 'We scrape multiple job boards and APIs daily to gather fresh developer opportunities.',
    color: '#304ffe',
  },
  {
    icon: AutoAwesomeIcon,
    title: 'AI Analysis',
    description: 'Our AI processes job listings, extracting skills, salaries, and trends automatically.',
    color: '#7c4dff',
  },
  {
    icon: BarChartIcon,
    title: 'Smart Insights',
    description: 'Get real-time market intelligence with charts, trends, and skill demand analysis.',
    color: '#ffa726',
  },
  {
    icon: NotificationsActiveIcon,
    title: 'Stay Updated',
    description: 'Receive daily summaries via Discord, Telegram, or email with the best opportunities.',
    color: '#26a69a',
  },
];

export default function HowItWorks() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
          textAlign: 'center',
        }}
      >
        How It Works
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          mb: 4,
          textAlign: 'center',
        }}
      >
        Your AI-powered career intelligence platform
      </Typography>

      <Grid container spacing={3}>
        {steps.map((step, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.title}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Box
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.8) 0%, rgba(19, 47, 76, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(48, 79, 254, 0.15)',
                  borderRadius: 3,
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px ' + alpha(step.color, 0.3),
                    border: '1px solid ' + alpha(step.color, 0.4),
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, ' + step.color + ', ' + alpha(step.color, 0.5) + ')',
                  },
                }}
              >
                {/* Step number */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: alpha(step.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.color,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {index + 1}
                </Box>

                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, ' + step.color + ' 0%, ' + alpha(step.color, 0.7) + ' 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 24px ' + alpha(step.color, 0.3),
                  }}
                >
                  <step.icon sx={{ fontSize: 32, color: '#ffffff' }} />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}