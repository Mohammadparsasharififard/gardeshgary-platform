import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, X } from 'lucide-react';
import { useScrollSpy, type ScrollSpySection } from '@/hooks/useScrollSpy';
import { navLinks } from '@/data';

/**
 * ReadingProgressCard — a compact pill fixed to the top-left corner (just
 * below the header) that shows:
 *   1. The active section's label
 *   2. Estimated reading time remaining (heuristic: ~280 wpm for Persian)
 *   3. Overall page-reading percentage
 *
 * Together with MiniTOC and ScrollProgress, this gives the reader a complete
 * sense of "where am I, how far have I come, how much is left".
 *
 * Visible only on lg+ screens (avoids mobile clutter where MiniTOC is also
 * hidden).
 */
const READING_SPEED_WPM = 280; // Persian reading speed (words per minute)

export default function ReadingProgressCard() {
  const [scrollPct, setScrollPct] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [totalWords, setTotalWords] = useState(0);

  // Active section via scroll spy
  const sections = useMemo<ScrollSpySection[]>(
    () =>
      navLinks
        .filter((l) => l.href.startsWith('#'))
        .map((l) => ({ id: l.href.slice(1), label: l.label })),
    [],
  );
  const activeId = useScrollSpy(sections, '-50% 0px -50% 0px');
  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );

  // Compute total word count once (cheap DOM walk on mount)
  useEffect(() => {
    const text = document.body.innerText || '';
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    setTotalWords(words);
  }, []);

  // Track overall scroll percentage with a passive listener
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setScrollPct(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Words remaining ≈ totalWords × (1 − scrollPct/100); convert to minutes.
  const remainingWords = Math.round(totalWords * (1 - scrollPct / 100));
  const remainingMin = Math.max(1, Math.ceil(remainingWords / READING_SPEED_WPM));
  const remainingLabel = remainingMin.toLocaleString('fa-IR');

  return (
    <div className="hidden lg:block fixed top-20 left-4 z-30">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="glass-nav rounded-2xl border border-navy-100 shadow-premium p-3 w-[220px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <BookOpen size={14} className="text-emerald-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <span className="text-[11px] font-bold text-navy-800">در حال مطالعه</span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                aria-label="جمع کردن کارت پیشرفت مطالعه"
                className="p-1 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Active section label */}
            <div className="mb-2.5">
              <div className="text-[10px] text-navy-400 mb-0.5">بخش فعال</div>
              <div className="text-xs font-bold text-navy-900 leading-snug truncate">
                {sections[activeIndex]?.label ?? '—'}
              </div>
            </div>

            {/* Reading time remaining */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-navy-500">
                <Clock size={12} className="text-amber-500" />
                <span>زمان باقی‌مانده</span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 tabular-nums">
                ~{remainingLabel} دقیقه
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-l from-emerald-500 via-teal-400 to-amber-400 rounded-full"
                animate={{ width: `${scrollPct}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-navy-400 tabular-nums">
              <span>پیشرفت کلی</span>
              <span>{Math.round(scrollPct).toLocaleString('fa-IR')}٪</span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setExpanded(true)}
            aria-label="باز کردن کارت پیشرفت مطالعه"
            className="relative w-10 h-10 rounded-full glass-nav border border-navy-100 shadow-premium flex items-center justify-center text-emerald-600"
          >
            {/* mini ring around the button = overall progress */}
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-navy-200" />
              <motion.circle
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 17}
                animate={{ strokeDashoffset: 2 * Math.PI * 17 * (1 - scrollPct / 100) }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                className="text-emerald-500"
              />
            </svg>
            <Clock size={15} className="relative text-emerald-600" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
