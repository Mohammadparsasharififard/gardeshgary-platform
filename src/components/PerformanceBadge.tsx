import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { usePerformance, type PerformanceRating } from '@/hooks/usePerformance';

const RATING_STYLE: Record<PerformanceRating['rating'], { icon: typeof CheckCircle2; color: string; label: string }> = {
  good: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50', label: 'عالی' },
  'needs-improvement': { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/50', label: 'قابل بهبود' },
  poor: { icon: XCircle, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50', label: 'ضعیف' },
};

/**
 * PerformanceBadge — a small floating widget that shows live Core Web Vitals
 * (LCP/CLS/FID/INP/TTFB). Hidden behind a toggle so it doesn't clutter the
 * main UI.
 *
 *  - Only renders in dev mode (`import.meta.env.DEV`) by default
 *  - Docked to bottom-right (RTL: bottom-left) so it doesn't overlap BackToTop
 *  - Each metric shows value + rating icon + label
 *  - Color-coded per Core Web Vitals thresholds
 */
export default function PerformanceBadge({ devOnly = true }: { devOnly?: boolean }) {
  const { vitals, ratings } = usePerformance();
  const [open, setOpen] = useState(false);

  // Hide in production unless explicitly enabled
  if (devOnly && !import.meta.env.DEV) return null;

  const hasData = ratings.length > 0;
  const worstRating = ratings.find((r) => r.rating === 'poor')
    ?? ratings.find((r) => r.rating === 'needs-improvement')
    ?? (hasData ? { rating: 'good' as const } : null);

  const badgeColor = !hasData
    ? 'bg-navy-50 dark:bg-navy-800 text-navy-500 dark:text-navy-300 border-navy-200 dark:border-navy-700'
    : worstRating?.rating === 'poor'
      ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/50'
      : worstRating?.rating === 'needs-improvement'
        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700/50'
        : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/50';

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'بستن نشانگر عملکرد' : 'نمایش نشانگر عملکرد'}
        className={`fixed bottom-6 right-6 z-[55] w-10 h-10 rounded-full border shadow-premium flex items-center justify-center transition-all hover:scale-110 ${badgeColor}`}
        title="Core Web Vitals"
      >
        <Gauge size={16} />
        {!hasData && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-navy-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="fixed bottom-20 right-6 z-[55] w-64 bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-700 shadow-premium p-3"
            role="dialog"
            aria-label="معیارهای عملکرد"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Gauge size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-navy-800 dark:text-white">عملکرد زنده</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="p-1 rounded-lg text-navy-400 hover:text-navy-700 dark:hover:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {!hasData ? (
              <p className="text-[11px] text-navy-400 dark:text-navy-500 py-3 text-center">
                منتظر دریافت داده‌ها... با صفحه تعامل کنید تا معیارها ثبت شوند.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {ratings.map((r) => {
                  const Style = RATING_STYLE[r.rating];
                  const Icon = Style.icon;
                  return (
                    <li
                      key={r.metric}
                      className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border ${Style.color}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon size={12} />
                        <span className="text-[11px] font-bold">{r.label}</span>
                      </span>
                      <span className="text-[11px] font-extrabold tabular-nums">
                        {r.value.toLocaleString('fa-IR')}
                        {r.metric === 'cls' ? '' : ' ms'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="mt-2.5 pt-2 border-t border-navy-100 dark:border-navy-700 text-[9px] text-navy-400 dark:text-navy-500 leading-relaxed">
              Core Web Vitals به‌صورت زنده از PerformanceObserver مرورگر جمع‌آوری می‌شود.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
