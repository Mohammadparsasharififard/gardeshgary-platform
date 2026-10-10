import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plane, Hotel, Gavel, FileText, User, Activity, Sparkles } from 'lucide-react';
import { activityTicker, type ActivityItem } from '@/data';

const ICONS: Record<ActivityItem['icon'], typeof CheckCircle2> = {
  check: CheckCircle2,
  plane: Plane,
  hotel: Hotel,
  gavel: Gavel,
  file: FileText,
  user: User,
};

const TINTS: Record<ActivityItem['icon'], string> = {
  check: 'text-emerald-500 dark:text-emerald-400',
  plane: 'text-sky-500 dark:text-sky-400',
  hotel: 'text-amber-500 dark:text-amber-400',
  gavel: 'text-red-500 dark:text-red-400',
  file: 'text-navy-500 dark:text-navy-300',
  user: 'text-teal-500 dark:text-teal-400',
};

/**
 * RotatingActivity — the rotating piece of the ticker. Extracted so the
 * non-empty branch can be type-narrowed cleanly (Icon/tint/active are all
 * guaranteed to be defined once we are inside the non-empty branch).
 */
function RotatingActivity({ active }: { active: ActivityItem }) {
  const Icon = ICONS[active.icon];
  const tint = TINTS[active.icon];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active.id}
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -14, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center gap-1.5"
      >
        <Icon size={12} className={`flex-shrink-0 ${tint}`} />
        <span className="text-[11px] text-white/90 font-medium truncate">{active.text}</span>
        <span className="text-[9px] text-navy-400 flex-shrink-0 hidden sm:inline">· {active.timestamp}</span>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * ActivityTicker — a compact live-activity pill that rotates through the most
 * recent actions on the platform. Adds social proof and a sense of liveliness
 * to the hero without occupying much space.
 *
 *  - auto-rotates every 3.5s
 *  - pauses on hover
 *  - a small "live" badge with a pulsing dot conveys real-time
 *  - shows a static welcome message when there are no items yet
 */
export default function ActivityTicker() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = activityTicker.length;
  const isEmpty = count === 0;

  useEffect(() => {
    if (paused || isEmpty) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % count), 3500);
    return () => clearInterval(t);
  }, [paused, count, isEmpty]);

  const active = isEmpty ? null : activityTicker[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="inline-flex items-center gap-2.5 glass-card rounded-full pl-2.5 pr-3.5 py-1.5 border border-emerald-500/20 hover:border-emerald-400/40 transition-colors"
      dir="rtl"
    >
      {/* live badge */}
      <span className="flex items-center gap-1.5 flex-shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[9px] font-bold text-emerald-300 hidden sm:inline">زنده</span>
      </span>

      <span className="w-px h-3 bg-white/10 flex-shrink-0" />

      {/* rotating text OR static welcome message */}
      <div className="relative h-4 overflow-hidden min-w-[180px] sm:min-w-[240px]">
        {isEmpty || !active ? (
          <div className="absolute inset-0 flex items-center gap-1.5">
            <Sparkles size={12} className="flex-shrink-0 text-emerald-400" />
            <span className="text-[11px] text-white/90 font-medium truncate">به پلتفرم خوش آمدید</span>
          </div>
        ) : (
          <RotatingActivity active={active} />
        )}
      </div>

      <Activity size={11} className="text-emerald-400 flex-shrink-0" />
    </motion.div>
  );
}
