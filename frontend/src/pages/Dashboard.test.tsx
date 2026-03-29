import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { jobsApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  jobsApi: {
    getDailySummary: vi.fn(),
  },
}));

const mockedJobsApi = vi.mocked(jobsApi);

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when summary has no jobs', async () => {
    mockedJobsApi.getDailySummary.mockResolvedValueOnce({
      summary: {
        total_jobs: 0,
        period_days: 30,
        filters_applied: {
          location_filter: null,
          tags: null,
          limit: 100,
        },
        top_companies: [],
        work_modalities: [],
        top_skills: [],
      },
      jobs: [],
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });
  });

  it('renders error state when API request fails', async () => {
    mockedJobsApi.getDailySummary.mockRejectedValueOnce(new Error('network error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard unavailable')).toBeInTheDocument();
    });
  });
});
