import { type ReactNode, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { getAppBarStyle } from '@/theme/styles';

interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Jobs', path: '/jobs', icon: <ListAltIcon /> },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100%',
      }}
    >
      <AppBar position="sticky" sx={getAppBarStyle(mode)}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <WorkIcon
              sx={{
                fontSize: { xs: 22, md: 26 },
                color: 'secondary.main',
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: mode === 'dark' ? 'text.primary' : 'primary.dark',
              letterSpacing: '0.01em',
            }}
          >
            OrionJobs AI
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => {
                const selected = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    aria-label={`Go to ${item.label}`}
                    sx={{
                      borderRadius: 2,
                      color: selected ? 'primary.main' : 'text.secondary',
                      backgroundColor: selected
                        ? alpha(theme.palette.primary.main, mode === 'dark' ? 0.2 : 0.12)
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: selected
                          ? alpha(theme.palette.primary.main, mode === 'dark' ? 0.26 : 0.16)
                          : alpha(theme.palette.primary.main, mode === 'dark' ? 0.12 : 0.08),
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label="Toggle color theme"
              sx={{
                ml: { xs: 0, md: 1 },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, mode === 'dark' ? 0.2 : 0.12),
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(15, 23, 36, 0.98) 0%, rgba(27, 36, 51, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(244, 247, 251, 0.97) 100%)',
            backdropFilter: 'blur(14px)',
            borderRight: `1px solid ${mode === 'dark' ? alpha('#cbd5e1', 0.08) : alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon sx={{ color: 'secondary.main', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            OrionJobs AI
          </Typography>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={selected}
                  aria-label={`Navigate to ${item.label}`}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, mode === 'dark' ? 0.2 : 0.1),
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: selected ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: selected ? 600 : 500,
                      color: selected ? 'text.primary' : 'text.secondary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Container

        component="main"
        maxWidth={false}
        sx={{
          mt: { xs: 2, md: 4 },
          mb: { xs: 2, md: 4 },
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 4 },
          mt: 'auto',
          background: (currentTheme) =>
            currentTheme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(10, 18, 32, 0) 0%, rgba(10, 18, 32, 1) 100%)'
              : 'linear-gradient(180deg, rgba(245, 247, 250, 0) 0%, rgba(245, 247, 250, 1) 100%)',
          width: '100%',
          margin: 0,
          borderTop: (currentTheme) =>
            `1px solid ${
              currentTheme.palette.mode === 'dark'
                ? alpha('#cbd5e1', 0.08)
                : alpha(currentTheme.palette.primary.main, 0.12)
            }`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1400,
          mx: 'auto',
          gap: { xs: 2, md: 2 },
          textAlign: { xs: 'center', md: 'left' },
        }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              OrionJobs AI
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            © 2026 OrionJobs AI - Navigate your career with precision
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography
              component="a"
              href="https://orionjobs-api.azurewebsites.net/docs"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.secondary"
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              About
            </Typography>
            <Typography
              component="a"
              href="https://orionjobs-api.azurewebsites.net/api/v1/jobs"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.secondary"
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              API
            </Typography>
            <Typography
              component="a"
              href="https://github.com/GuiDev-01/orion-jobs-ai"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.secondary"
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              GitHub
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}