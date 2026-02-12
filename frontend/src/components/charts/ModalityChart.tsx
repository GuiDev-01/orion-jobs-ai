import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Job } from '../../types/job';

interface ModalityChartProps {
  jobs: Job[];
}

export default function ModalityChart({ jobs }: ModalityChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Count modalities
  const modalityCounts: Record<string, number> = {};
  
  jobs.forEach(job => {
    const modality = job.work_modality || 'Not specified';
    modalityCounts[modality] = (modalityCounts[modality] || 0) + 1;
  });

  const data = Object.entries(modalityCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#304ffe', '#7c4dff', '#ffa726', '#26a69a', '#ec407a'];

  const textColor = isDark ? '#ffffff' : '#1a237e';

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No modality data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke={isDark ? '#0a1929' : '#ffffff'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: isDark ? '#132f4c' : '#ffffff',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              color: textColor,
            }}
            formatter={(value) => [`${value} jobs`, 'Count']}
          />
          <Legend
            wrapperStyle={{
              color: textColor,
            }}
            formatter={(value: string) => (
              <span style={{ color: textColor, fontWeight: 500 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}