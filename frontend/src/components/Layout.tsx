import { type ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
          <WorkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OrionJobs AI
          </Typography>
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