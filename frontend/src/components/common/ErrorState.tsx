import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Typography } from '@mui/material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  minHeight?: string | number;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  minHeight = '40vh',
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
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
      <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', opacity: 0.85 }} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry} aria-label="Retry request">
          {retryLabel}
        </Button>
      )}
    </Box>
  );
}
