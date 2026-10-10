import { useState, useEffect } from 'react';

/**
 * useOnlineStatus — tracks the browser's connectivity (navigator.onLine +
 * the online/offline events). Returns the current boolean plus a timestamp
 * of the last transition so consumers can show "back online" toasts.
 *
 *  - SSR-safe (defaults to true when navigator is unavailable)
 *  - re-subscribes on mount only (stable identity)
 *  - exposes `wasOffline` flag that flips to true once an offline event has
 *    been seen, then resets when back online — handy for "welcome back" UI
 */
export interface OnlineStatus {
  isOnline: boolean;
  wasOffline: boolean;
  lastChange: number;
}

export function useOnlineStatus(): OnlineStatus {
  const [state, setState] = useState<OnlineStatus>(() => ({
    isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
    wasOffline: false,
    lastChange: Date.now(),
  }));

  useEffect(() => {
    const goOnline = () => {
      setState((prev) => ({
        isOnline: true,
        wasOffline: prev.wasOffline || !prev.isOnline,
        lastChange: Date.now(),
      }));
    };
    const goOffline = () => {
      setState((prev) => ({
        isOnline: false,
        wasOffline: true,
        lastChange: Date.now(),
      }));
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return state;
}

export default useOnlineStatus;
