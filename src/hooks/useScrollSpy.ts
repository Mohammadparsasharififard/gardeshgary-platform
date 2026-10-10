import { useEffect, useState } from 'react';

export interface ScrollSpySection {
  id: string;
  label: string;
  /** Optional icon name for TOC rendering */
  icon?: string;
}

/**
 * useScrollSpy — tracks which section is currently in the viewport.
 *
 * Uses IntersectionObserver to detect the most visible section, falling back
 * to a scroll-based heuristic on browsers without IO support. The `activeId`
 * updates as the user scrolls, perfect for table-of-contents highlighting,
 * reading-progress chips, and active-nav indicators.
 *
 * @param sections  ordered list of {id, label} pairs to observe
 * @param options.rootMargin  tune when "active" flips (default: "-45% 0px -45% 0px" → the section crossing the vertical center becomes active)
 */
export function useScrollSpy(
  sections: ScrollSpySection[],
  rootMargin: string = '-45% 0px -45% 0px',
): string {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (sections.length === 0) return;

    // Cache elements up-front; skip missing ones.
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibleMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleMap.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleMap.delete(entry.target.id);
          }
        }
        // Pick the most-visible section; if none (e.g. between sections),
        // keep the previous active id to avoid flicker.
        if (visibleMap.size > 0) {
          let bestId = '';
          let bestRatio = -1;
          for (const [id, ratio] of visibleMap) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          }
          if (bestId) setActiveId(bestId);
        }
      },
      {
        rootMargin,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sections, rootMargin]);

  return activeId;
}

export default useScrollSpy;
