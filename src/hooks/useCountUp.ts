import { useEffect, useRef, useState } from 'react';

interface CountUpOptions {
  /** Target numeric value */
  end: number;
  /** Animation duration in ms (default 1800) */
  duration?: number;
  /** Start only after the element scrolls into view (default true) */
  startOnView?: boolean;
  /** Delay before counting starts after triggered (ms, default 0) */
  delay?: number;
  /** Number of decimal places (default 0) */
  decimals?: number;
}

/**
 * useCountUp — animates a number from 0 → `end` using requestAnimationFrame
 * with an ease-out cubic curve. Optionally waits for an element to enter the
 * viewport before starting (IntersectionObserver, one-shot).
 *
 * Returns `[ref, displayValue]` where ref should be attached to the element
 * whose visibility triggers the count (ignored when startOnView is false).
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>({
  end,
  duration = 1800,
  startOnView = true,
  delay = 0,
  decimals = 0,
}: CountUpOptions): [React.RefObject<T>, number, boolean] {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Respect reduced-motion: jump straight to the final number.
    if (prefersReduced) {
      setValue(end);
      setDone(true);
      return;
    }

    let rafId = 0;
    let startTime = 0;
    let started = false;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      setValue(decimals > 0 ? Number(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(end);
        setDone(true);
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      if (delay > 0) {
        window.setTimeout(() => {
          rafId = requestAnimationFrame(tick);
        }, delay);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (!startOnView) {
      start();
      return () => cancelAnimationFrame(rafId);
    }

    const el = ref.current;
    if (!el) {
      // No element to observe — start immediately as a fallback.
      start();
      return () => cancelAnimationFrame(rafId);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [end, duration, startOnView, delay, decimals]);

  return [ref, value, done];
}

export default useCountUp;
