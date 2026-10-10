import { motion } from 'framer-motion';
import { Home, Search, ShieldAlert, ArrowLeft, Compass } from 'lucide-react';

interface NotFoundProps {
  /** Custom message (optional) */
  message?: string;
  /** Called when user clicks "back to home" */
  onGoHome?: () => void;
  /** Called when user clicks "search" */
  onSearch?: () => void;
}

/**
 * NotFound — branded 404 page with a Persian message, an animated compass
 * illustration, and quick-recovery actions (go home / search).
 *
 * Visual theme matches the platform (navy → emerald gradient on a dark hero
 * backdrop with grid + particles). Designed to be dropped into any 404 route
 * or shown inside a modal as a fallback for unknown sections.
 */
export default function NotFound({ message, onGoHome, onSearch }: NotFoundProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" dir="rtl">
      {/* deep backdrop */}
      <div className="absolute inset-0 bg-gradient-to-bl from-navy-950 via-navy-900 to-navy-950" />
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* glow blobs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-10 w-72 h-72 bg-amber-500/12 rounded-full blur-[100px]"
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 text-center">
        {/* Animated 404 with compass */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex mb-6"
        >
          {/* outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 -m-8 rounded-full border-2 border-dashed border-emerald-500/25"
          />
          {/* inner ring (counter-rotating) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 -m-4 rounded-full border border-amber-500/30"
          />
          {/* compass icon */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-glow-lg">
            <motion.div
              animate={{ rotate: [0, 15, -15, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            >
              <Compass size={44} className="text-white drop-shadow" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* 404 digits */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl sm:text-7xl font-extrabold mb-3"
        >
          <span className="gradient-text">۴۰۴</span>
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-white mb-2"
        >
          صفحه مورد نظر پیدا نشد
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base text-navy-300 leading-relaxed mb-8 max-w-md mx-auto"
        >
          {message ?? 'ممکن است صفحه جابه‌جا شده یا حذف شده باشد. برای پیدا کردن محتوای مورد نظرتان از جستجوی هوشمند استفاده کنید یا به صفحه اصلی بازگردید.'}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={onGoHome ?? (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); })}
            className="group relative inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-glow hover:scale-[1.03] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Home size={18} className="relative" />
            <span className="relative">بازگشت به صفحه اصلی</span>
          </button>

          <button
            onClick={onSearch ?? (() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
            })}
            className="inline-flex items-center justify-center gap-2 glass-card border border-white/15 hover:border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
          >
            <Search size={18} className="text-emerald-400" />
            جستجوی هوشمند
          </button>
        </motion.div>

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-navy-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={13} />
          بازگشت به صفحه قبلی
        </motion.button>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 text-[11px] text-navy-400 flex items-center justify-center gap-1.5"
        >
          <ShieldAlert size={12} className="text-amber-400" />
          اگر این خطا را غیرمنتظره دیدید، آن را به تیم پشتیبانی گزارش دهید.
        </motion.p>
      </div>
    </section>
  );
}
