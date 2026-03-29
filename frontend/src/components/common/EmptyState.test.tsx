import { fireEvent, render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No jobs" description="Try again later" />);

    expect(screen.getByText('No jobs')).toBeInTheDocument();
    expect(screen.getByText('Try again later')).toBeInTheDocument();
  });

  it('calls action handler when button is clicked', () => {
    const onAction = vi.fn();

    render(
      <EmptyState
        title="No data"
        description="Reload required"
        actionLabel="Reload"
        onAction={onAction}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
