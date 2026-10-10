import { useEffect, useRef, useState } from 'react';

/**
 * useDebounce — returns a debounced copy of `value` that only updates after
 * `delay` ms have elapsed without further changes. Perfect for search inputs
 * where you don't want to re-filter on every keystroke.
 *
 *  - leading-edge disabled (we always wait), trailing-edge fire
 *  - cancels the pending timeout on unmount or value change
 *  - returns a stable `cancel` function to force-flush or abort
 */
export function useDebounce<T>(value: T, delay: number = 350): [T, () => void] {
  const [debounced, setDebounced] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    cancel();
    timerRef.current = setTimeout(() => {
      setDebounced(value);
      timerRef.current = null;
    }, delay);
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return [debounced, cancel];
}

export default useDebounce;
