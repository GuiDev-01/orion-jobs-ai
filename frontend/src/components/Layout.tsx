import { type ReactNode } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
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
          {/* Logo/Brand with golden star icon */}
          <Box 
            sx={{ 
              mr: 2, 
              display: 'flex', 
              alignItems: 'center',
              color: '#ffa726',
              filter: 'drop-shadow(0 0 8px rgba(255, 167, 38, 0.6))',
            }}
          >
            <WorkIcon />
          </Box>
          <Typography 
            variant="h6" 
            component={Link}
            to="/" 
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '0.5px',
              background: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              transformOrigin: 'left center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            OrionJobs AI
          </Typography>

          {/* Navigation Buttons */}
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

          {/* Theme Toggle Button */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',

                  transition: 'all 0.3s ease',

                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(180deg)',
                  }
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container
        component="main" 
        maxWidth={false} 
        sx={{ 
          mt: 4, 
          mb: 4, 
          flexGrow: 1, 
          px: 4,
          width: '100%'
        }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          px: 4, 
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
          gap: 2,
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
          
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            © 2025 OrionJobs AI — Navigate your career with precision
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' },
              }}
            >
              About
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' },
              }}
            >
              API
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' },
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