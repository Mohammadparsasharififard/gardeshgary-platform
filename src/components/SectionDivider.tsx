import { motion } from 'framer-motion';

interface SectionDividerProps {
  /** Visual variant — wave (default), gradient-line, or diamond */
  variant?: 'wave' | 'line' | 'diamond';
  /** Tailwind text-color class controlling the tint (default emerald) */
  tint?: string;
  /** Optional label shown centered (for `line` and `diamond` variants) */
  label?: string;
}

/**
 * SectionDivider — elegant breathing-room between major sections.
 *
 *  - `wave`: a soft SVG wave with two offset gradients (emerald → amber)
 *  - `line`: a hairline gradient with an optional centered label chip
 *  - `diamond`: a rotated square " jewel " accent with flanking lines
 *
 * All variants are purely decorative so they carry aria-hidden.
 */
export default function SectionDivider({
  variant = 'wave',
  tint = 'text-emerald-500',
  label,
}: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div
        aria-hidden="true"
        className="relative flex items-center justify-center py-8 sm:py-10"
      >
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full max-w-7xl h-[40px] sm:h-[50px] opacity-70"
          fill="none"
        >
          <defs>
            <linearGradient id="wave-emerald" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-amber" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 30 C 200 60, 400 0, 600 30 S 1000 60, 1200 30"
            stroke="url(#wave-emerald)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
          <motion.path
            d="M0 40 C 200 10, 400 60, 600 40 S 1000 10, 1200 40"
            stroke="url(#wave-amber)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.15 }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'diamond') {
    return (
      <div
        aria-hidden="true"
        className={`relative flex items-center justify-center gap-4 py-8 ${tint}`}
      >
        <div className="h-px w-24 sm:w-40 bg-gradient-to-l from-transparent to-current opacity-40" />
        <motion.span
          initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
          whileInView={{ rotate: 45, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="w-2.5 h-2.5 bg-current rotate-45 shadow-glow"
        />
        <span className="w-1 h-1 bg-current rounded-full opacity-60" />
        <motion.span
          initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
          whileInView={{ rotate: 45, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="w-1.5 h-1.5 bg-amber-500 rotate-45"
        />
        <div className="h-px w-24 sm:w-40 bg-gradient-to-r from-transparent to-current opacity-40" />
      </div>
    );
  }

  // line variant (with optional centered label chip)
  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="h-px flex-1 max-w-[35%] bg-gradient-to-l from-transparent via-emerald-300/40 to-transparent" />
      {label ? (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="px-4 text-[11px] font-bold tracking-widest text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 rounded-full py-1 whitespace-nowrap"
        >
          {label}
        </motion.span>
      ) : (
        <span className="mx-4 w-1.5 h-1.5 rounded-full bg-emerald-400/70 shadow-glow" />
      )}
      <div className="h-px flex-1 max-w-[35%] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
    </div>
  );
}
