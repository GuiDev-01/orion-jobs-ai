import { type ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* Fixed header - full width, no margins */}
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
              backgroundColor: location.pathname === '/jobs' ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            Jobs
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content with controlled padding */}
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

      {/* Footer - full width */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: '#f5f5f5',
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