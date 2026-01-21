import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import type { Job } from '../../types/job';

interface TrendChartProps {
  jobs: Job[];
}

export default function TrendChart({ jobs }: TrendChartProps) {
  // Group jobs by creation date
  const chartData = processJobsByDate(jobs);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Job Posting Trends
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Number of jobs posted over time
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#1976d2" 
              strokeWidth={3}
              dot={{ fill: '#1976d2', r: 4 }}
              activeDot={{ r: 6 }}
              name="Jobs Posted"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Helper function: group jobs by date
function processJobsByDate(jobs: Job[]) {
  // Group by date (format: Jan 21)
  const groupedByDate: Record<string, number> = {};

  jobs.forEach(job => {
    const date = new Date(job.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    groupedByDate[formattedDate] = (groupedByDate[formattedDate] || 0) + 1;
  });

  // Convert object to array for Recharts
  return Object.entries(groupedByDate).map(([date, count]) => ({
    date,
    count
  }));
}