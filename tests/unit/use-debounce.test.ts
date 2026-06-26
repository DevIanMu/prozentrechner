import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDebounce } from '@/lib/hooks/use-debounce';

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');
  });

  it('updates debounced value after the delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 'initial' },
      }
    );

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => expect(result.current).toBe('updated'));

    vi.useRealTimers();
  });

  it('resets the timer when the value changes before the delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 'initial' },
      }
    );

    rerender({ value: 'a' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    await waitFor(() => expect(result.current).toBe('b'));

    vi.useRealTimers();
  });
});
