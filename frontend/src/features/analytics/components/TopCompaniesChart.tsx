import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '@mui/material';
import type { Job } from '@/types/job';

interface TopCompaniesChartProps {
  jobs: Job[];
}

export default function TopCompaniesChart({ jobs }: TopCompaniesChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Count jobs per company
  const companyCounts = jobs.reduce((acc, job) => {
    acc[job.company] = (acc[job.company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top 10 companies
  const data = (Object.entries(companyCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([company, count]) => ({
      name: company,
      jobs: count,
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#d084d0', '#a4de6c'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.12)'} />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 12 }}
          stroke={isDark ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.18)'}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 12 }}
          stroke={isDark ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.18)'}
        />
        <Tooltip
          cursor={{ fill: isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.05)' }}
          contentStyle={{
            background: isDark ? '#1e293b' : '#ffffff',
            border: 'none',
            borderRadius: 10,
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.22)',
            color: isDark ? '#e2e8f0' : '#0f172a',
          }}
          labelStyle={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 600 }}
          formatter={(value) => [`${value ?? 0} jobs`, 'Openings']}
        />
        <Bar dataKey="jobs" radius={[8, 8, 0, 0]} activeBar={false}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}