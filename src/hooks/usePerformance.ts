import { useEffect, useState } from 'react';

export interface WebVitals {
  /** Largest Contentful Paint (ms) — when the largest visible element renders */
  lcp?: number;
  /** First Input Delay (ms) — delay before first user interaction is processed */
  fid?: number;
  /** Cumulative Layout Shift (unitless score 0–1) */
  cls?: number;
  /** Interaction to Next Paint (ms) — newer FID replacement */
  inp?: number;
  /** Time to First Byte (ms) */
  ttfb?: number;
}

export interface PerformanceRating {
  metric: keyof WebVitals;
  value: number;
  /** 'good' | 'needs-improvement' | 'poor' per Core Web Vitals thresholds */
  rating: 'good' | 'needs-improvement' | 'poor';
  label: string;
}

const THRESHOLDS: Record<keyof WebVitals, { good: number; poor: number; unit: string }> = {
  lcp: { good: 2500, poor: 4000, unit: 'ms' },
  fid: { good: 100, poor: 300, unit: 'ms' },
  inp: { good: 200, poor: 500, unit: 'ms' },
  cls: { good: 0.1, poor: 0.25, unit: '' },
  ttfb: { good: 800, poor: 1800, unit: 'ms' },
};

/**
 * usePerformance — captures Core Web Vitals using the browser-native
 * PerformanceObserver APIs (no external dependency).
 *
 *  - LCP via 'largest-contentful-paint'
 *  - CLS via 'layout-shift' (accumulated)
 *  - FID/INP via 'event' (first input only)
 *  - TTFb from navigation entry
 *
 * Returns the collected metrics + a convenience `ratings` array.
 * Values are `undefined` until the browser reports them.
 */
export function usePerformance() {
  const [vitals, setVitals] = useState<WebVitals>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const clsEntries: PerformanceEntry[] = [];

    // LCP
    try {
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          setVitals((prev) => ({ ...prev, lcp: Math.round(last.startTime) }));
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* type unsupported — ignore */
    }

    // CLS
    try {
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Cast: LayoutShift entry has `value` not in the base PerformanceEntry type
          const value = (entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number });
          if (!value.hadRecentInput) {
            clsValue += value.value ?? 0;
            clsEntries.push(entry);
            setVitals((prev) => ({ ...prev, cls: Number(clsValue.toFixed(3)) }));
          }
        }
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
    } catch {
      /* ignore */
    }

    // FID (first input delay) + INP
    try {
      const fidObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const processingStart = (entry as PerformanceEntry & { processingStart?: number }).processingStart;
          if (processingStart !== undefined) {
            const delay = Math.round(processingStart - entry.startTime);
            if (delay >= 0) {
              setVitals((prev) => ({
                ...prev,
                fid: prev.fid ?? delay, // first only
                inp: prev.inp ?? delay, // for SPA, first input is a reasonable INP proxy
              }));
            }
          }
        }
      });
      fidObs.observe({ type: 'first-input', buffered: true });
    } catch {
      /* ignore */
    }

    // TTFB
    try {
      const navEntries = performance.getEntriesByType('navigation') as (PerformanceNavigationTiming & { responseStart?: number; requestStart?: number })[];
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        const ttfb = nav.responseStart && nav.requestStart
          ? Math.round(nav.responseStart - nav.requestStart)
          : undefined;
        if (ttfb !== undefined && ttfb >= 0) {
          setVitals((prev) => ({ ...prev, ttfb }));
        }
      }
    } catch {
      /* ignore */
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build ratings array from collected vitals
  const ratings: PerformanceRating[] = [];
  (Object.keys(THRESHOLDS) as (keyof WebVitals)[]).forEach((metric) => {
    const value = vitals[metric];
    if (value === undefined) return;
    const threshold = THRESHOLDS[metric];
    let rating: PerformanceRating['rating'];
    if (value <= threshold.good) rating = 'good';
    else if (value <= threshold.poor) rating = 'needs-improvement';
    else rating = 'poor';
    const labels: Record<keyof WebVitals, string> = {
      lcp: 'LCP',
      fid: 'FID',
      inp: 'INP',
      cls: 'CLS',
      ttfb: 'TTFB',
    };
    ratings.push({ metric, value, rating, label: labels[metric] });
  });

  return { vitals, ratings };
}

export default usePerformance;
