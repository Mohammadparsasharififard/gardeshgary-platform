import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, ChevronLeft } from 'lucide-react';
import { navLinks } from '@/data';
import { useScrollSpy, type ScrollSpySection } from '@/hooks/useScrollSpy';

/**
 * MiniTOC — floating "table of contents" that docks to the right edge of the
 * viewport (RTL: right is the "start" side, but we dock left to avoid clashing
 * with the back-to-top button on the bottom-left).
 *
 * Features:
 *  - Collapsible (remembers state in localStorage)
 *  - Active section highlighted via useScrollSpy (IntersectionObserver)
 *  - Smooth scroll on click (respects the sticky-header offset)
 *  - Hidden on small screens (<= lg) to avoid clutter
 *  - Progress ring on the active item showing scroll position within section
 */
const STORAGE_KEY = 'gardeshgary.miniToc.open.v1';

export default function MiniTOC() {
  // Remember whether the user has collapsed the panel across sessions
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isOpen));
    } catch {
      /* storage unavailable — keep in-memory state */
    }
  }, [isOpen]);

  // Build the section list from the shared nav data so labels stay in sync.
  const sections = useMemo<ScrollSpySection[]>(
    () =>
      navLinks
        .filter((l) => l.href.startsWith('#'))
        .map((l) => ({ id: l.href.slice(1), label: l.label })),
    [],
  );

  const activeId = useScrollSpy(sections);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset for the sticky header (~72px) so the heading isn't covered.
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Active index for the progress dots
  const activeIndex = sections.findIndex((s) => s.id === activeId);
  const progress = sections.length > 0 ? (activeIndex + 1) / sections.length : 0;

  return (
    <div
      className="hidden xl:flex fixed top-1/2 -translate-y-1/2 left-4 z-30 flex-col items-start gap-2"
      aria-label="فهرست مطالب صفحه"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="glass-nav rounded-2xl border border-navy-100 shadow-premium p-3 max-w-[220px]"
          >
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <List size={14} className="text-emerald-600" />
                <span className="text-[11px] font-bold text-navy-800">فهرست مطالب</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="بستن فهرست مطالب"
                className="p-1 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-1 mb-2.5">
              <div className="h-1 bg-navy-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-emerald-500 via-teal-400 to-amber-400 rounded-full"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-navy-400 tabular-nums">
                <span>{(activeIndex + 1).toLocaleString('fa-IR')} / {sections.length.toLocaleString('fa-IR')}</span>
                <span>{Math.round(progress * 100).toLocaleString('fa-IR')}٪</span>
              </div>
            </div>

            <ul className="space-y-0.5">
              {sections.map((s, i) => {
                const isActive = s.id === activeId;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => handleClick(s.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group w-full text-right flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
                          : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-emerald-500 scale-125 shadow-glow'
                            : 'bg-navy-300 group-hover:bg-navy-400'
                        }`}
                      />
                      <span className="truncate flex-1 leading-snug">{s.label}</span>
                      {isActive && (
                        <ChevronLeft size={11} className="text-emerald-600 flex-shrink-0" />
                      )}
                      {!isActive && (
                        <span className="text-[9px] text-navy-300 tabular-nums">
                          {(i + 1).toLocaleString('fa-IR')}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            aria-label="باز کردن فهرست مطالب"
            className="relative w-11 h-11 rounded-full glass-nav border border-navy-100 shadow-premium flex items-center justify-center text-emerald-600 hover:text-emerald-700"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-400/15 animate-ping-slow" />
            <List size={18} className="relative" />
            {/* active section indicator dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-glow" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
