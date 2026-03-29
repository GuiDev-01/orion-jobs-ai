import { Box, Typography, useTheme } from '@mui/material';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import type { Job } from '@/types/job';

interface LocationChartProps {
	jobs: Job[];
}

interface ChartRow {
	name: string;
	jobs: number;
}

const COLORS = ['#3d5afe', '#4e72df', '#ff9100', '#22c55e', '#06b6d4', '#a855f7', '#f97316', '#ef4444'];

function normalizeLocation(location?: string): string {
	if (!location) return 'Not specified';
	const firstChunk = location.split(',')[0].trim();
	return firstChunk || 'Not specified';
}

export default function LocationChart({ jobs }: LocationChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const counts = jobs.reduce<Record<string, number>>((acc, job) => {
		const label = normalizeLocation(job.location);
		acc[label] = (acc[label] || 0) + 1;
		return acc;
	}, {});

	const data: ChartRow[] = Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([name, count]) => ({ name, jobs: count }));

	if (data.length === 0) {
		return (
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<Typography variant="body2" color="text.secondary">
					No location data available
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ width: '100%', height: 320 }}>
			<ResponsiveContainer>
				<BarChart
					data={data}
					margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.12)'} />
					<XAxis
						dataKey="name"
						tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 12 }}
						interval={0}
						angle={-20}
						textAnchor="end"
						height={70}
					/>
					<YAxis tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 12 }} allowDecimals={false} />
					<Tooltip
						cursor={{ fill: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.06)' }}
						contentStyle={{
							background: isDark ? '#1e293b' : '#ffffff',
							border: 'none',
							borderRadius: 10,
							boxShadow: '0 10px 24px rgba(15, 23, 42, 0.22)',
							color: isDark ? '#e2e8f0' : '#0f172a',
						}}
						formatter={(value) => [`${value ?? 0} jobs`, 'Openings']}
					/>
					<Bar dataKey="jobs" radius={[8, 8, 0, 0]}>
						{data.map((entry, index) => (
							<Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
}
