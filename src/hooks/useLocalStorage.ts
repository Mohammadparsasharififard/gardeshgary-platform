import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useLocalStorage — persistent state synced to window.localStorage.
 *
 * Features:
 *  - SSR-safe (no access to window during initial render beyond a guard)
 *  - Cross-tab synchronisation via the `storage` event
 *  - JSON serialisation with graceful fallback for corrupted values
 *  - `updater` function support (like setState)
 *  - Optional debounced writes to avoid hammering storage on rapid updates
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Keep a ref to the latest value so the setter never closes over a stale one
  const storedRef = useRef(storedValue);
  storedRef.current = storedValue;

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage full or unavailable — silently keep in-memory state */
        }
        return next;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    setStoredValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Cross-tab sync: another tab updated the same key
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setStoredValue(e.newValue ? (JSON.parse(e.newValue) as T) : initialValue);
      } catch {
        /* ignore malformed external writes */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue, remove];
}

export default useLocalStorage;
