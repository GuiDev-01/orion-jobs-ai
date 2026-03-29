import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JobsList from './JobsList';
import { jobsApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  jobsApi: {
    getJobs: vi.fn(),
  },
}));

const mockedJobsApi = vi.mocked(jobsApi);

describe('JobsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error state when API request fails', async () => {
    mockedJobsApi.getJobs.mockRejectedValueOnce(new Error('network error'));

    render(
      <MemoryRouter>
        <JobsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Connection error')).toBeInTheDocument();
    });
  });

  it('renders fetched jobs list', async () => {
    mockedJobsApi.getJobs.mockResolvedValueOnce({
      jobs: [
        {
          id: 1,
          title: 'Senior Frontend Engineer',
          company: 'Acme',
          location: 'Remote',
          work_modality: 'Remote',
          url: 'https://example.com/job/1',
          tags: ['React', 'TypeScript'],
          created_at: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      page_size: 12,
    });

    render(
      <MemoryRouter>
        <JobsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Browse 1 available positions')).toBeInTheDocument();
    });

    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
  });
});
