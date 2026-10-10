import { motion } from 'framer-motion';
import {
  Scale, Users, FileText, Building2, Gavel, Clock, type LucideIcon,
} from 'lucide-react';
import { platformStats, type PlatformStat } from '@/data';
import { useCountUp } from '@/hooks/useCountUp';

const ICONS: Record<PlatformStat['icon'], LucideIcon> = {
  Scale,
  Users,
  FileText,
  Building2,
  Gavel,
  Clock,
};

const TINTS: Record<PlatformStat['tint'], { ring: string; icon: string; text: string; glow: string }> = {
  emerald: {
    ring: 'from-emerald-400 to-emerald-600',
    icon: 'text-emerald-600',
    text: 'text-emerald-700',
    glow: 'bg-emerald-500/15',
  },
  amber: {
    ring: 'from-amber-400 to-amber-600',
    icon: 'text-amber-600',
    text: 'text-amber-700',
    glow: 'bg-amber-500/15',
  },
  navy: {
    ring: 'from-navy-500 to-navy-700',
    icon: 'text-navy-700',
    text: 'text-navy-700',
    glow: 'bg-navy-500/10',
  },
};

function StatCard({ stat, index }: { stat: PlatformStat; index: number }) {
  const Icon = ICONS[stat.icon];
  const tint = TINTS[stat.tint];
  const [ref, value, done] = useCountUp<HTMLDivElement>({
    end: stat.value,
    duration: 2200,
    delay: index * 120,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="card-lift relative group bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800 p-5 sm:p-6 shadow-card overflow-hidden"
    >
      {/* gradient ring behind icon */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${tint.ring} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
      />
      {/* shimmer sweep when counting completes */}
      {done && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '120%', opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-100/40 to-transparent skew-x-12"
        />
      )}

      <div className="relative flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${tint.glow} border border-navy-100 dark:border-navy-800 flex items-center justify-center`}>
          <Icon size={22} className={tint.icon} />
        </div>
        <span className="text-[10px] font-bold text-navy-300 dark:text-navy-500 bg-navy-50 dark:bg-navy-800 px-2 py-0.5 rounded-full border border-navy-100 dark:border-navy-700 tabular-nums">
          {String(index + 1).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}
        </span>
      </div>

      <div className="relative">
        <div className={`text-3xl sm:text-4xl font-extrabold tabular-nums ${tint.text} leading-none mb-2`}>
          {value.toLocaleString('fa-IR')}
          <span className="text-2xl">{stat.suffix}</span>
        </div>
        <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 font-medium leading-snug">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="py-20 sm:py-24 relative overflow-hidden gradient-mesh-bg">
      {/* subtle grid pattern */}
      <div className="absolute inset-0 grid-overlay opacity-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <Gavel size={14} className="text-emerald-600" />
            <span>تأثیر ملی پلتفرم در یک نگاه</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-3">
            آمار شفاف از
            <span className="gradient-text"> فعالیت حقوقی</span>
            <span className="text-emerald-600 dark:text-emerald-400"> پلتفرم</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            آمار پلتفرم پس از راه‌اندازی کامل نمایش داده خواهد شد
          </p>
        </div>

        {/* Stats Grid */}
        {platformStats.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 shadow-card">
              <span className="w-2 h-2 rounded-full bg-jade-500 animate-pulse" />
              <span className="text-sm text-night-500 dark:text-night-400 font-medium">آمار در حال راه‌اندازی است</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {platformStats.map((stat, i) => (
              <StatCard key={stat.id} stat={stat} index={i} />
            ))}
          </div>
        )}

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-navy-400 dark:text-navy-500"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            به‌روزرسانی لحظه‌ای
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            مستند به سامانه‌های رسمی
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-navy-500" />
            قابل استعلام از MCTH
          </span>
        </motion.div>
      </div>
    </section>
  );
}
