import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

interface TopCompaniesChartProps {
  companies: string[];
}

// Vibrant colors for bars
const COLORS = [
  '#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9',
  '#bbdefb', '#e3f2fd', '#0d47a1', '#1565c0', '#1e88e5'
];

export default function TopCompaniesChart({ companies }: TopCompaniesChartProps) {
  const chartData = processCompanies(companies);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Companies Hiring
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Companies with most job openings
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              width={150}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Helper function: count companies and get top 10
function processCompanies(companies: string[]) {
  // Count occurrences
  const companyCounts: Record<string, number> = {};
  
  companies.forEach(company => {
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });

  // Convert to array and sort
  return Object.entries(companyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 only
}