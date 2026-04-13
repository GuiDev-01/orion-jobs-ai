import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BoltIcon from '@mui/icons-material/Bolt';
import LanguageIcon from '@mui/icons-material/Language';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GitHubIcon from '@mui/icons-material/GitHub';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import GroupIcon from '@mui/icons-material/Group';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { motion, useReducedMotion } from 'framer-motion';
import { jobsApi } from '../services/api';
import HowItWorks from '@/components/common/HowItWorks';

type LandingStats = {
  totalJobs: number;
  companies: number;
  remoteRatio: number;
};

type Persona = 'developers' | 'teams';

const links = [
  {
    title: 'GitHub Repository',
    subtitle: 'Source code and roadmap',
    href: 'https://github.com/GuiDev-01/orion-jobs-ai',
    icon: <GitHubIcon />,
  },
  {
    title: 'API Reference',
    subtitle: 'Interactive endpoint docs',
    href: 'https://orionjobs-api.azurewebsites.net/docs',
    icon: <DataObjectIcon />,
  },
  {
    title: 'Product Docs',
    subtitle: 'Architecture and usage guide',
    href: 'https://orionjobs-api.azurewebsites.net/docs',
    icon: <MenuBookIcon />,
  },
  {
    title: 'Health Status',
    subtitle: 'Live backend operational check',
    href: 'https://orionjobs-api.azurewebsites.net/health',
    icon: <MonitorHeartIcon />,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const reduceMotion = useReducedMotion();

  const [stats, setStats] = useState<LandingStats>({
    totalJobs: 0,
    companies: 0,
    remoteRatio: 0,
  });
  const [persona, setPersona] = useState<Persona>('developers');

  const reveal = (delay = 0) => {
    if (reduceMotion) {
      return {};
    }
    return {
      initial: { opacity: 0, y: 34, scale: 0.985 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      viewport: { once: true, amount: 0.18, margin: '0px 0px -10% 0px' },
      transition: {
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    };
  };

  const itemReveal = (index = 0, baseDelay = 0) => {
    if (reduceMotion) {
      return {};
    }
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: {
        duration: 0.6,
        delay: baseDelay + index * 0.06,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    };
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const [jobs, summary] = await Promise.all([
          jobsApi.getJobs({ page: 1, page_size: 100 }),
          jobsApi.getDailySummary({ days: 30 }),
        ]);

        const companies = new Set((summary.jobs || []).map((job) => (job.company || '').trim()).filter(Boolean));
        const remoteCount = (summary.jobs || []).filter((job) =>
          String(job.work_modality || '').toLowerCase().includes('remote')
        ).length;
        const total = summary.jobs?.length || 0;

        setStats({
          totalJobs: jobs.total,
          companies: companies.size,
          remoteRatio: total > 0 ? Math.round((remoteCount / total) * 100) : 0,
        });
      } catch {
        // Keep landing resilient; fallback values still render product narrative.
      }
    }

    loadStats();
  }, []);

  const cards = useMemo(
    () => [
      {
        title: 'Multi-source intelligence',
        text: 'RemoteOK, Adzuna, and JSearch in one place, de-duplicated and ranked for fast action.',
        icon: <LanguageIcon sx={{ color: '#ffb74d' }} />,
      },
      {
        title: 'Market precision dashboard',
        text: 'See demand trends, top companies, and skill signals before the market moves.',
        icon: <QueryStatsIcon sx={{ color: '#4fc3f7' }} />,
      },
      {
        title: 'Career acceleration flow',
        text: 'From discovery to insight in minutes, with AI support where it actually matters.',
        icon: <BoltIcon sx={{ color: '#81c784' }} />,
      },
    ],
    []
  );

  const personaCopy = {
    developers: {
      title: 'For Developers',
      text: 'Move from random applications to strategic actions with market intelligence, AI highlights, and curated opportunities.',
      cta: 'See Developer Dashboard',
      onClick: () => navigate('/dashboard'),
      icon: <WorkspacesIcon sx={{ color: '#4fc3f7' }} />,
    },
    teams: {
      title: 'For Hiring Teams',
      text: 'Understand talent supply, trending skills, and location demand to benchmark roles and improve hiring plans.',
      cta: 'Explore Hiring Signals',
      onClick: () => navigate('/dashboard'),
      icon: <GroupIcon sx={{ color: '#81c784' }} />,
    },
  };

  const compareRows = [
    {
      title: 'Signal over noise',
      orion: 'Deduplicated feed + trend context',
      generic: 'Large volume, low context',
    },
    {
      title: 'Decision speed',
      orion: 'Dashboard-first and AI-assisted analysis',
      generic: 'Manual filtering and repetitive checks',
    },
    {
      title: 'Career outcomes',
      orion: 'Focus on timing, skills, and demand shifts',
      generic: 'Focus on listing count only',
    },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(900px 400px at 10% -10%, rgba(79, 195, 247, 0.16), transparent 55%), radial-gradient(800px 380px at 95% 0%, rgba(255, 183, 77, 0.14), transparent 50%)'
            : 'radial-gradient(900px 400px at 10% -10%, rgba(30, 136, 229, 0.14), transparent 55%), radial-gradient(800px 380px at 95% 0%, rgba(255, 167, 38, 0.12), transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={{ xs: 5, md: 8 }} sx={{ position: 'relative', zIndex: 1 }}>
        <motion.section {...reveal(0)}>
          <Box
            sx={{
              pt: { xs: 4, md: 10 },
              pb: { xs: 1, md: 4 },
              mx: 'auto',
              maxWidth: 1040,
              textAlign: 'center',
              minHeight: { md: '58vh' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Chip
              icon={<RocketLaunchIcon />}
              label="Built for global developer careers"
              sx={{
                mb: 2,
                color: isDark ? '#f8fafc' : '#0f172a',
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.08)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(148, 163, 184, 0.26)' : 'rgba(15, 23, 42, 0.15)',
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Sora", "Inter", sans-serif',
                fontWeight: 800,
                lineHeight: 1.1,
                maxWidth: 860,
                mx: 'auto',
                fontSize: { xs: '2rem', md: '3.35rem' },
                background: isDark
                  ? 'linear-gradient(135deg, #ffffff 0%, #b0bec5 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              OrionJobs AI turns noisy job feeds into strategic career decisions.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 2,
                maxWidth: 760,
                mx: 'auto',
                color: 'text.secondary',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Discover opportunities, validate market trends, and move faster with an intelligence-first job platform designed for serious developers.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 3.5, justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<TrendingUpIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.25,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff9f43 0%, #ff7043 100%)',
                }}
              >
                Start Free Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/jobs')}
                sx={{ borderRadius: 2, px: 3, py: 1.25, fontWeight: 700 }}
              >
                Browse Jobs Now
              </Button>
            </Stack>

            <Button
              variant="text"
              size="small"
              endIcon={<KeyboardDoubleArrowDownIcon />}
              onClick={() => {
                document.getElementById('landing-trust')?.scrollIntoView({
                  behavior: reduceMotion ? 'auto' : 'smooth',
                  block: 'start',
                });
              }}
              sx={{
                mt: 2.5,
                color: 'text.secondary',
                textTransform: 'none',
                letterSpacing: 0.2,
                '&:hover': { color: 'primary.main' },
              }}
            >
              Scroll to explore
            </Button>
          </Box>
        </motion.section>

        <motion.section id="landing-trust" {...reveal(0.05)}>
          <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
            <Grid container spacing={2}>
              {links.map((item, index) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
                  <motion.div {...itemReveal(index, 0.02)}>
                    <Box
                      component="a"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        borderRadius: 3,
                        p: 2,
                        color: 'inherit',
                        textAlign: 'center',
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.65), rgba(19, 47, 76, 0.35))'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 255, 0.82))',
                        border: isDark ? '1px solid rgba(148, 163, 184, 0.22)' : '1px solid rgba(30, 64, 175, 0.14)',
                        transition: 'all 220ms ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: isDark ? 'rgba(79, 195, 247, 0.48)' : 'rgba(30, 64, 175, 0.3)',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center" sx={{ mb: 0.7 }}>
                        <Box sx={{ color: 'primary.main', display: 'flex' }}>{item.icon}</Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                        <OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.section>

        <motion.section {...reveal(0.08)}>
          <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
            <Grid container spacing={2}>
              {[
                { label: 'Tracked jobs', value: stats.totalJobs ? stats.totalJobs.toLocaleString() : 'Live' },
                { label: 'Hiring companies', value: stats.companies ? stats.companies.toLocaleString() : 'Growing' },
                { label: 'Remote share', value: stats.remoteRatio ? `${stats.remoteRatio}%` : 'Realtime' },
              ].map((item, index) => (
                <Grid key={item.label} size={{ xs: 12, md: 4 }}>
                  <motion.div {...itemReveal(index, 0.04)}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        backdropFilter: 'blur(14px)',
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.85), rgba(19, 47, 76, 0.45))'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 255, 0.8))',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(30, 58, 138, 0.12)',
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.section>

        <motion.section {...reveal(0.09)}>
          <Box
            sx={{
              maxWidth: 1280,
              mx: 'auto',
              px: { xs: 1, md: 0 },
              py: 1,
              borderTop: isDark ? '1px solid rgba(148, 163, 184, 0.14)' : '1px solid rgba(30, 64, 175, 0.12)',
              borderBottom: isDark ? '1px solid rgba(148, 163, 184, 0.14)' : '1px solid rgba(30, 64, 175, 0.12)',
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems="center" justifyContent="center">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Trusted by developers validating fast-changing hiring markets.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="Daily data ingestion" variant="outlined" />
                <Chip size="small" label="AI-assisted insights" variant="outlined" />
                <Chip size="small" label="API-first architecture" variant="outlined" />
              </Stack>
            </Stack>
          </Box>
        </motion.section>

        <motion.section {...reveal(0.1)}>
          <Card
            sx={{
              borderRadius: 3,
              background: isDark
                ? 'linear-gradient(140deg, rgba(14, 34, 56, 0.9), rgba(21, 56, 94, 0.78))'
                : 'linear-gradient(140deg, rgba(241, 245, 255, 0.95), rgba(219, 234, 254, 0.82))',
              border: isDark ? '1px solid rgba(148, 163, 184, 0.22)' : '1px solid rgba(30, 64, 175, 0.16)',
            }}
          >
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Box sx={{ minWidth: { md: 250 } }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.8, fontFamily: '"Sora", "Inter", sans-serif' }}>
                    Choose your starting path
                  </Typography>
                  <ToggleButtonGroup
                    value={persona}
                    exclusive
                    onChange={(_, value: Persona | null) => {
                      if (value) {
                        setPersona(value);
                      }
                    }}
                    size="small"
                    aria-label="Choose user persona"
                    sx={{
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.7)',
                      borderRadius: 2,
                    }}
                  >
                    <ToggleButton value="developers">Developers</ToggleButton>
                    <ToggleButton value="teams">Teams</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.8 }}>
                    {personaCopy[persona].icon}
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {personaCopy[persona].title}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: 'text.secondary', mb: 1.8 }}>{personaCopy[persona].text}</Typography>
                  <Button variant="outlined" endIcon={<TrendingUpIcon />} onClick={personaCopy[persona].onClick}>
                    {personaCopy[persona].cta}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section {...reveal(0.12)}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Sora", "Inter", sans-serif' }}>
            Why OrionJobs feels like a real product
          </Typography>

          <Grid container spacing={2.5}>
            {cards.map((card, index) => (
              <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                <motion.div {...itemReveal(index, 0.06)}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      background: isDark
                        ? 'linear-gradient(160deg, rgba(16, 35, 58, 0.95), rgba(8, 22, 39, 0.9))'
                        : 'linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 255, 0.88))',
                      border: isDark ? '1px solid rgba(79, 195, 247, 0.18)' : '1px solid rgba(30, 64, 175, 0.14)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 1 }}>{card.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {card.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.section>

        <motion.section {...reveal(0.16)}>
          <Card
            sx={{
              borderRadius: 3,
              background: isDark
                ? 'linear-gradient(160deg, rgba(12, 30, 48, 0.9), rgba(10, 22, 39, 0.86))'
                : 'linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.84))',
              border: isDark ? '1px solid rgba(79, 195, 247, 0.2)' : '1px solid rgba(30, 64, 175, 0.16)',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                <CompareArrowsIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  OrionJobs vs generic job boards
                </Typography>
              </Stack>
              <Grid container spacing={1.4}>
                {compareRows.map((row) => (
                  <Grid key={row.title} size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: isDark ? '1px solid rgba(148, 163, 184, 0.18)' : '1px solid rgba(30, 64, 175, 0.12)',
                        background: isDark ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{row.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'success.main', mb: 0.6 }}>
                        OrionJobs: {row.orion}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Generic: {row.generic}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section {...reveal(0.2)}>
          <HowItWorks />
        </motion.section>

        <motion.section {...reveal(0.24)}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: isDark
                ? 'linear-gradient(120deg, rgba(14, 34, 56, 0.95) 0%, rgba(21, 56, 94, 0.88) 60%, rgba(255, 112, 67, 0.2) 100%)'
                : 'linear-gradient(120deg, rgba(220, 235, 255, 0.9) 0%, rgba(234, 244, 255, 0.88) 60%, rgba(255, 167, 38, 0.22) 100%)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Ready to turn job search into career strategy?
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                Start with the dashboard for market context, then jump into curated listings to execute faster.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" onClick={() => navigate('/dashboard')} startIcon={<AutoGraphIcon />}>
                  Go to Dashboard
                </Button>
                <Button variant="outlined" onClick={() => navigate('/jobs')}>
                  Explore Job Listings
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </motion.section>
      </Stack>
    </Box>
  );
}