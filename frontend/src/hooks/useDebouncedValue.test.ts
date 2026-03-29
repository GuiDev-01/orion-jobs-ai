import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  it('updates value only after delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'react' } }
    );

    expect(result.current).toBe('react');

    rerender({ value: 'vite' });
    expect(result.current).toBe('react');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('react');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('vite');

    vi.useRealTimers();
  });
});
