import { useCallback, useEffect, useState } from 'react';

export type FontSizeLevel = 'sm' | 'base' | 'lg' | 'xl';
export const FONT_SIZE_LEVELS: FontSizeLevel[] = ['sm', 'base', 'lg', 'xl'];

const STORAGE_KEY = 'gardeshgary.fontsize.v1';

const LEVEL_TO_RATIO: Record<FontSizeLevel, number> = {
  sm: 0.92,
  base: 1,
  lg: 1.08,
  xl: 1.16,
};

const LEVEL_TO_LABEL: Record<FontSizeLevel, string> = {
  sm: 'کوچک',
  base: 'استاندارد',
  lg: 'بزرگ',
  xl: 'بسیار بزرگ',
};

function readStored(): FontSizeLevel {
  if (typeof window === 'undefined') return 'base';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'sm' || v === 'base' || v === 'lg' || v === 'xl') return v;
  } catch {
    /* ignore */
  }
  return 'base';
}

/**
 * useFontSize — persistent user font-size preference.
 *
 * Implemented by setting `--user-font-scale` on <html> and using it in a
 * single CSS rule that scales `font-size` on the root container. This avoids
 * the a11y anti-pattern of applying fixed pixel sizes to every element.
 */
export function useFontSize() {
  const [level, setLevel] = useState<FontSizeLevel>(readStored);

  // Apply the scale variable to <html> whenever the level changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-font-scale', String(LEVEL_TO_RATIO[level]));
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      /* ignore */
    }
  }, [level]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const v = e.newValue as FontSizeLevel | null;
      if (v === 'sm' || v === 'base' || v === 'lg' || v === 'xl') setLevel(v);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLevelSafe = useCallback((next: FontSizeLevel) => setLevel(next), []);
  const cycle = useCallback(() => {
    setLevel((prev) => {
      const idx = FONT_SIZE_LEVELS.indexOf(prev);
      const nextIdx = (idx + 1) % FONT_SIZE_LEVELS.length;
      return FONT_SIZE_LEVELS[nextIdx];
    });
  }, []);

  return { level, label: LEVEL_TO_LABEL[level], setLevel: setLevelSafe, cycle };
}

export default useFontSize;
