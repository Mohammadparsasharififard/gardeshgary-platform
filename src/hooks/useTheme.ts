import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'gardeshgary.theme.v1';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

/**
 * useTheme — manages light/dark/system theme with:
 *  - persistence in localStorage
 *  - automatic sync with OS `prefers-color-scheme` when mode is "system"
 *  - a single source of truth: `isDark` is the resolved boolean to drive UI
 *
 * The hook toggles the `dark` class on <html> so Tailwind's `dark:` variant
 * works out of the box.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);
  const [systemDark, setSystemDark] = useState<boolean>(getSystemPrefersDark);

  // Keep track of OS-level color scheme changes (only matters when mode='system')
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    } else {
      // Safari < 14 fallback: addListener/removeListener are deprecated but
      // still defined in lib.dom.d.ts, so no @ts-expect-error needed.
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  const isDark = mode === 'system' ? systemDark : mode === 'dark';

  // Apply the `dark` class to <html> whenever the resolved theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDark]);

  // Persist the user's explicit choice
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);

  const setTheme = useCallback((next: ThemeMode) => setMode(next), []);
  const toggle = useCallback(() => {
    setMode((prev) => {
      const resolved = prev === 'system' ? systemDark : prev === 'dark';
      return resolved ? 'light' : 'dark';
    });
  }, [systemDark]);

  return { mode, isDark, setTheme, toggle };
}

export default useTheme;
