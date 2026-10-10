import { AnimatePresence, motion } from 'framer-motion';
import { Type, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useFontSize, FONT_SIZE_LEVELS, type FontSizeLevel } from '@/hooks/useFontSize';

const LEVEL_LABEL: Record<FontSizeLevel, string> = {
  sm: 'کوچک',
  base: 'استاندارد',
  lg: 'بزرگ',
  xl: 'بسیار بزرگ',
};

const LEVEL_SAMPLE: Record<FontSizeLevel, string> = {
  sm: '۰۹',
  base: '۱۲',
  lg: '۱۵',
  xl: '۱۸',
};

/**
 * FontSizeControl — a compact dropdown that lets the reader pick a persistent
 * base font-size for the whole platform. Implements WCAG 1.4.4 (Resize text)
 * without relying on the browser zoom, so the whole UI scales together via a
 * CSS custom property (see useFontSize + index.css).
 */
export default function FontSizeControl({
  scrolled = true,
}: {
  scrolled?: boolean;
}) {
  const { level, setLevel } = useFontSize();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const baseClass = scrolled
    ? 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700 border border-navy-200 dark:border-navy-700'
    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15';

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="اندازه متن"
        aria-haspopup="menu"
        aria-expanded={open}
        title={`اندازه متن: ${LEVEL_LABEL[level]}`}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all ${baseClass}`}
      >
        <Type size={16} />
        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center border border-white dark:border-navy-900">
          {LEVEL_SAMPLE[level]}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="absolute top-full mt-2 left-0 w-52 bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-700 rounded-2xl shadow-premium p-1.5 z-50"
          >
            <p className="px-2.5 py-1.5 text-[10px] font-bold text-navy-400 dark:text-navy-500 flex items-center gap-1.5">
              <Type size={11} /> اندازه متن
            </p>
            {FONT_SIZE_LEVELS.map((lvl) => {
              const active = level === lvl;
              return (
                <button
                  key={lvl}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setLevel(lvl);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="tabular-nums text-navy-400 dark:text-navy-500"
                      style={{ fontSize: `${10 + FONT_SIZE_LEVELS.indexOf(lvl) * 2}px` }}
                    >
                      A
                    </span>
                    {LEVEL_LABEL[lvl]}
                  </span>
                  {active && <Check size={13} />}
                </button>
              );
            })}
            <p className="mt-1.5 px-2.5 pt-1.5 border-t border-navy-100 dark:border-navy-800 text-[10px] text-navy-400 dark:text-navy-500 leading-relaxed">
              انتخاب شما ذخیره می‌شود و در بازدید بعدی اعمال خواهد شد.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
