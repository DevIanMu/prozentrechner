import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUrlHash } from '@/lib/hooks/use-url-hash';

type Values = Record<string, number | null>;

function makeHook(initial: Values) {
  return renderHook(() =>
    useUrlHash<Values>({
      initialValues: initial,
      serialize: (values) =>
        new URLSearchParams(
          Object.entries(values)
            .filter(([, v]) => v !== null)
            .map(([k, v]) => [k, String(v)])
        ).toString(),
      deserialize: (hash) => {
        const params = new URLSearchParams(hash);
        const result: Partial<Values> = {};
        params.forEach((value, key) => {
          const parsed = Number(value);
          result[key] = Number.isFinite(parsed) ? parsed : null;
        });
        return result;
      },
    })
  );
}

describe('useUrlHash', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('returns initial values when the hash is empty', () => {
    const { result } = makeHook({ a: 1, b: null });
    expect(result.current[0]).toEqual({ a: 1, b: null });
  });

  it('reads values from the hash on mount', () => {
    window.location.hash = '#a=5&b=10';
    const { result } = makeHook({ a: 1, b: null });
    expect(result.current[0]).toEqual({ a: 5, b: 10 });
  });

  it('writes the serialized hash when values change', () => {
    const { result } = makeHook({ a: 1, b: null });

    act(() => {
      result.current[1]({ a: 7, b: 14 });
    });

    expect(window.location.hash).toBe('#a=7&b=14');
  });

  it('responds to hashchange events', () => {
    const { result } = makeHook({ a: 1, b: null });

    act(() => {
      window.location.hash = '#a=99';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current[0]).toEqual({ a: 99, b: null });
  });
});
