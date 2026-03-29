import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  title?: string;
  description?: string;
  minHeight?: string | number;
}

export default function LoadingState({
  title = 'Loading data...',
  description = 'Please wait while we prepare your dashboard.',
  minHeight = '40vh',
}: LoadingStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={36} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440 }}>
        {description}
      </Typography>
    </Box>
  );
}
