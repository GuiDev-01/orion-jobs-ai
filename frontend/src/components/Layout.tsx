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
        position="static" 
        sx={{ 
          width: '100%',
          margin: 0,
          padding: 0
        }}
      >
        <Toolbar>
          {/* Logo/Brand */}
          <WorkIcon sx={{ mr: 2 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
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
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : '#f5f5f5',
          width: '100%',
          margin: 0
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          OrionJobs AI © 2025 - Powered by Python + React
        </Typography>
      </Box>
    </Box>
  );
}