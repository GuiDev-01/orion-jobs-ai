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
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../contexts/ThemeContext';
import {Link} from 'react-router-dom';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100%'
      }}
    >
      <AppBar 
        position="sticky" 
        sx={{
          // Orion theme gradient
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #304ffe 0%, #7c4dff 100%)'
            : 'linear-gradient(135deg, #304ffe 0%, #7c4dff 100%)',

          // Glassmorphism
          backdropFilter: 'blur(10px)',
          backgroundColor: mode === 'dark'
            ? 'rgba(48, 79, 254, 0.9)'
            : 'rgba(48, 79, 254, 0.95)',

          // Shadow
          boxShadow: '0 8px 32px 0 rgba(10, 25, 41, 0.5)',
          borderBottom: mode === 'dark' 
            ? '1px solid rgba(124, 77, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Brand with enhanced design */}
          <Box 
            sx={{ 
              mr: 2, 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              position: 'relative',
            }}
          >
            {/* Icon with glow effect */}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WorkIcon 
                sx={{ 
                  fontSize: { xs: 24, md: 28 },
                  color: '#ffa726',
                  filter: 'drop-shadow(0 0 12px rgba(255, 167, 38, 0.8))',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-4px)' },
                  },
                }} 
              />
              {/* Pulsing circle behind icon */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 167, 38, 0.3) 0%, transparent 70%)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                  zIndex: -1,
                  '@keyframes pulse-glow': {
                    '0%, 100%': { 
                      transform: 'scale(1)',
                      opacity: 0.5,
                    },
                    '50%': { 
                      transform: 'scale(1.2)',
                      opacity: 0.8,
                    },
                  },
                }}
              />
            </Box>
          </Box>
          <Typography 
            variant="h6" 
            component={Link}
            to="/" 
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              letterSpacing: '0.5px',
              position: 'relative',
              background: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 30%, #ffffff 60%, #e3f2fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 8px rgba(255, 167, 38, 0.4))',
              transformOrigin: 'left center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                filter: 'drop-shadow(0 4px 12px rgba(255, 167, 38, 0.6))',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '0%',
                height: 2,
                background: 'linear-gradient(90deg, #ffa726, #ffb74d)',
                transition: 'width 0.3s ease',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            OrionJobs AI
          </Typography>

          {/* Desktop Navigation Buttons */}
          {!isMobile && (
            <>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/')}
                sx={{
                  mr: 2,
                  backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                Dashboard
              </Button>
              
              <Button
                color="inherit"
                startIcon={<ListAltIcon />}
                onClick={() => navigate('/jobs')}
                sx={{
                  mr: 2,
                  backgroundColor: location.pathname === '/jobs' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                Jobs
              </Button>
            </>
          )}

          {/* Theme Toggle Button */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{
                ml: { xs: 0, md: 1 },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: mode === 'dark'
              ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.95) 0%, rgba(19, 47, 76, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon sx={{ color: '#ffa726', fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            OrionJobs AI
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigate('/')}
              selected={location.pathname === '/'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : 'rgba(102, 126, 234, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: location.pathname === '/' ? '#667eea' : 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{
                  fontWeight: location.pathname === '/' ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigate('/jobs')}
              selected={location.pathname === '/jobs'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: mode === 'dark' 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : 'rgba(102, 126, 234, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <ListAltIcon sx={{ color: location.pathname === '/jobs' ? '#667eea' : 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Jobs" 
                primaryTypographyProps={{
                  fontWeight: location.pathname === '/jobs' ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Container
        component="main" 
        maxWidth={false} 
        sx={{ 
          mt: { xs: 2, md: 4 }, 
          mb: { xs: 2, md: 4 }, 
          flexGrow: 1, 
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%'
        }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: { xs: 3, md: 4 }, 
          px: { xs: 2, md: 4 }, 
          mt: 'auto', 
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(180deg, rgba(10, 25, 41, 0) 0%, rgba(10, 25, 41, 1) 100%)'
              : 'linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 100%)',
          width: '100%',
          margin: 0,
          borderTop: (theme) => 
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.05)'
              : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: 1400,
          mx: 'auto',
          gap: { xs: 2, md: 2 },
          textAlign: { xs: 'center', md: 'left' },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
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
            © 2025 OrionJobs AI — Navigate your career with precision
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
                transition: 'all 0.2s ease',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                '&:hover': { 
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
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
                transition: 'all 0.2s ease',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                '&:hover': { 
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
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
                transition: 'all 0.2s ease',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                '&:hover': { 
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
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