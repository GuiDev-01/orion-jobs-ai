import { fireEvent, render, screen } from '@testing-library/react';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('renders provided title and message', () => {
    render(<ErrorState title="API Error" message="Request failed" />);

    expect(screen.getByText('API Error')).toBeInTheDocument();
    expect(screen.getByText('Request failed')).toBeInTheDocument();
  });

  it('renders default title when not provided', () => {
    render(<ErrorState message="Any error" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('triggers retry callback', () => {
    const onRetry = vi.fn();

    render(<ErrorState message="Recoverable error" onRetry={onRetry} retryLabel="Retry now" />);

    fireEvent.click(screen.getByRole('button', { name: 'Retry request' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
