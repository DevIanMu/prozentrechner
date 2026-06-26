import * as React from 'react';

export interface UseUrlHashOptions<T> {
  initialValues: T;
  serialize: (values: T) => string;
  deserialize: (hash: string) => Partial<T>;
}

/**
 * Syncs a values object with the URL hash.
 *
 * Reading the hash on mount and on `hashchange` events merges parsed values
 * into the current state. Setting values writes the serialized form back to
 * the URL via `history.replaceState` without triggering a navigation.
 */
export function useUrlHash<T>({
  initialValues,
  serialize,
  deserialize,
}: UseUrlHashOptions<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [values, setValues] = React.useState<T>(initialValues);
  const serializeRef = React.useRef(serialize);
  const deserializeRef = React.useRef(deserialize);

  React.useEffect(() => {
    serializeRef.current = serialize;
    deserializeRef.current = deserialize;
  }, [serialize, deserialize]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        return;
      }
      setValues((prev) => ({ ...prev, ...deserializeRef.current(hash) } as T));
    };

    applyHash();

    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const setValuesAndHash = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      if (typeof window === 'undefined') {
        return;
      }

      setValues((prev) => {
        const resolved =
          typeof next === 'function'
            ? (next as (prev: T) => T)(prev)
            : next;

        const hash = serializeRef.current(resolved);
        const url = new URL(window.location.href);
        url.hash = hash;
        window.history.replaceState(null, '', url.toString());

        return resolved;
      });
    },
    []
  );

  return [values, setValuesAndHash];
}
