import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';

const MODE_META: Record<ThemeMode, { label: string; icon: typeof Sun }> = {
  light: { label: 'روشن', icon: Sun },
  dark: { label: 'تاریک', icon: Moon },
  system: { label: 'سیستم', icon: Monitor },
};

/**
 * ThemeToggle — a compact 3-mode switcher (light / dark / system) with a
 * dropdown menu. Defaults to a single icon button that cycles on click; long-
 * press / click opens a menu to pick an explicit mode including "system" which
 * follows the OS preference.
 *
 * Renders nothing during SSR (no window) — but Vite SPA always has a window.
 */
export default function ThemeToggle({
  variant = 'icon',
  scrolled = true,
}: {
  /** icon = just the cycling button; menu = button + dropdown */
  variant?: 'icon' | 'menu';
  /** When true, the button uses the "on-light" (scrolled header) styling */
  scrolled?: boolean;
}) {
  const { mode, isDark, setTheme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const ActiveIcon = isDark ? Moon : Sun;

  const baseClass = scrolled
    ? 'bg-white text-navy-600 hover:bg-navy-100 border border-navy-200'
    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
        title={`حالت فعلی: ${MODE_META[mode].label}`}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all ${baseClass}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Moon size={16} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Sun size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  // menu variant
  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="انتخاب تم رنگی"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        title={`حالت فعلی: ${MODE_META[mode].label}`}
        className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs shrink-0 transition-all ${baseClass}`}
      >
        <ActiveIcon size={15} />
        <span className="hidden md:inline font-semibold">{MODE_META[mode].label}</span>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="absolute top-full mt-2 left-0 w-44 bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-700 rounded-2xl shadow-premium p-1.5 z-50"
          >
            <p className="px-2.5 py-1.5 text-[10px] font-bold text-navy-400 dark:text-navy-300">
              انتخاب تم
            </p>
            {(Object.keys(MODE_META) as ThemeMode[]).map((m) => {
              const M = MODE_META[m];
              const Icon = M.icon;
              const active = mode === m;
              return (
                <button
                  key={m}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setTheme(m);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={14} />
                    {M.label}
                  </span>
                  {active && <Check size={13} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
