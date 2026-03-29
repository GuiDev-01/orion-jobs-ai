import React, { useState } from 'react';
import { jobsApi } from '@/services/api';
import type { AIAnalysisResponse } from '@/types/job';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Collapse,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

interface AIAssistantProps {
  jobId: number;
}

function getApiErrorMessage(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { data?: { detail?: string } } }).response?.data?.detail === 'string'
  ) {
    return (err as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? 'Error analyzing job with AI.';
  }

  return 'Error analyzing job with AI.';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ jobId }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAnalyze = async () => {
    if (analysis) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await jobsApi.analyzeJob(jobId);
      setAnalysis(data);
      setIsExpanded(true);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="contained"
        fullWidth
        onClick={handleAnalyze}
        disabled={isLoading}
        aria-label="Analyze this job with AI"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
        endIcon={analysis ? (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
        sx={{
          py: 1.8,
          background: isDark
            ? 'linear-gradient(135deg, #3d5afe 0%, #4e72df 100%)'
            : 'linear-gradient(135deg, #3d5afe 0%, #5d7bff 100%)',
          color: 'white',
          boxShadow: isDark
            ? '0 10px 24px rgba(61, 90, 254, 0.35)'
            : '0 8px 20px rgba(61, 90, 254, 0.25)',
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 2.5,
          '&:hover': {
            boxShadow: isDark
              ? '0 14px 28px rgba(61, 90, 254, 0.45)'
              : '0 12px 24px rgba(61, 90, 254, 0.32)',
          },
        }}
      >
        {isLoading ? 'Analyzing Job...' : 'AI Career Consultant'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Collapse in={isExpanded}>
        {analysis && (
          <Card
            sx={{
              mt: 2,
              borderRadius: 2.5,
              border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.2)}`,
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <Box>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LightbulbIcon sx={{ mr: 1 }} /> Overview
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: 0.2, lineHeight: 1.6 }}>
                  {analysis.summary}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2,
                    bgcolor: alpha(theme.palette.success.main, isDark ? 0.12 : 0.09),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, isDark ? 0.28 : 0.2)}`,
                  }}
                >
                  <Typography variant="subtitle1" color="success.main" sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
                    <CheckCircleIcon sx={{ mr: 1 }} /> Pros & Benefits
                  </Typography>
                  <List disablePadding>
                    {analysis.pros.map((pro: string, index: number) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography color="success.main">•</Typography>
                        </ListItemIcon>
                        <ListItemText primary={pro} primaryTypographyProps={{ variant: 'body2', color: 'success.dark' }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2,
                    bgcolor: alpha(theme.palette.error.main, isDark ? 0.12 : 0.08),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.error.main, isDark ? 0.28 : 0.2)}`,
                  }}
                >
                  <Typography variant="subtitle1" color="error.main" sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'bold' }}>
                    <WarningIcon sx={{ mr: 1 }} /> Potential Red Flags
                  </Typography>
                  <List disablePadding>
                    {analysis.cons.map((con: string, index: number) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography color="error.main">•</Typography>
                        </ListItemIcon>
                        <ListItemText primary={con} primaryTypographyProps={{ variant: 'body2', color: 'error.dark' }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <QuestionAnswerIcon sx={{ mr: 1 }} /> Prepare for the Interview: Questions
                </Typography>
                <List disablePadding>
                  {analysis.interview_questions.map((q: string, index: number) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, isDark ? 0.12 : 0.08),
                        mb: 1,
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.warning.main, isDark ? 0.22 : 0.16)}`,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                        <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
                          Q{index + 1}:
                        </Typography>
                      </ListItemIcon>
                      <ListItemText primary={q} primaryTypographyProps={{ variant: 'body2', color: 'warning.dark' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>

            </CardContent>
          </Card>
        )}
      </Collapse>
    </Box>
  );
};