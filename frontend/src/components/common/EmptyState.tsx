import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Box, Button, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  minHeight?: string | number;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  minHeight = '40vh',
}: EmptyStateProps) {
  return (
    <Box
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
      <Box sx={{ color: 'text.secondary', opacity: 0.7 }}>
        {icon ?? <InboxOutlinedIcon sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="outlined" onClick={onAction} aria-label={actionLabel}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
