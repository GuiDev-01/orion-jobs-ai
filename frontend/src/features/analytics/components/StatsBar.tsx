import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import { Box, Card, CardContent, Grid, Typography, alpha, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import type { Job } from '@/types/job';

interface StatsBarProps {
	jobs: Job[];
}

interface StatCard {
	label: string;
	value: string;
	hint: string;
	icon: ReactNode;
	color: string;
}

export default function StatsBar({ jobs }: StatsBarProps) {
	const theme = useTheme();

	if (jobs.length === 0) {
		return (
			<Card>
				<CardContent>
					<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
						No statistics available for the selected period.
					</Typography>
				</CardContent>
			</Card>
		);
	}

	const total = jobs.length;
	const remoteCount = jobs.filter((job) => (job.work_modality || '').toLowerCase().includes('remote')).length;
	const withSalary = jobs.filter((job) => job.salary_min || job.salary_max).length;
	const withLocation = jobs.filter((job) => Boolean(job.location)).length;

	const stats: StatCard[] = [
		{
			label: 'Total jobs',
			value: total.toLocaleString(),
			hint: 'Last fetched sample',
			icon: <WorkOutlineIcon fontSize="small" />,
			color: theme.palette.primary.main,
		},
		{
			label: 'Remote roles',
			value: `${Math.round((remoteCount / total) * 100)}%`,
			hint: `${remoteCount.toLocaleString()} listings`,
			icon: <TravelExploreOutlinedIcon fontSize="small" />,
			color: theme.palette.info.main,
		},
		{
			label: 'Salary disclosed',
			value: `${Math.round((withSalary / total) * 100)}%`,
			hint: `${withSalary.toLocaleString()} listings`,
			icon: <SavingsOutlinedIcon fontSize="small" />,
			color: theme.palette.success.main,
		},
		{
			label: 'With location',
			value: `${Math.round((withLocation / total) * 100)}%`,
			hint: `${withLocation.toLocaleString()} listings`,
			icon: <PlaceOutlinedIcon fontSize="small" />,
			color: theme.palette.warning.main,
		},
	];

	return (
		<Grid container spacing={{ xs: 1.5, md: 2 }}>
			{stats.map((stat) => (
				<Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
					<Card sx={{ height: '100%' }}>
						<CardContent>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
								<Box
									sx={{
										width: 28,
										height: 28,
										borderRadius: 1.5,
										display: 'grid',
										placeItems: 'center',
										color: stat.color,
										backgroundColor: alpha(stat.color, 0.14),
									}}
								>
									{stat.icon}
								</Box>
								<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
									{stat.label}
								</Typography>
							</Box>
							<Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
								{stat.value}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{stat.hint}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
