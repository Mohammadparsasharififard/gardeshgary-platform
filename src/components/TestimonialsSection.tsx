import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Quote, Star, ChevronLeft, ChevronRight, BadgeCheck, Sparkles, MessageSquare,
} from 'lucide-react';
import { testimonials, type Testimonial } from '@/data';

const CATEGORY_TINT: Record<Testimonial['category'], string> = {
  'مسافر': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50',
  'آژانس': 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50',
  'وکیل': 'bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-200 border-navy-200 dark:border-navy-700',
  'هتل‌دار': 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700/50',
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`امتیاز ${rating} از ۵`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-navy-200 dark:text-navy-700'}
        />
      ))}
    </div>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  return (
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-sm shadow-glow flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const count = testimonials.length;

  const go = useCallback((next: number) => {
    setActiveIdx((prev) => (next + count) % count);
  }, [count]);

  // Autoplay every 6s, pause on hover via `autoplay` flag
  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % count);
    }, 6000);
    return () => clearInterval(t);
  }, [autoplay, count]);

  const active = testimonials[activeIdx];

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 transition-colors duration-300"
    >
      <div className="absolute top-20 left-10 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>رضایت کاربران پلتفرم</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-3">
            تجربه‌های واقعی
            <span className="gradient-text"> کاربران</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            مسافران، آژانس‌ها، وکلای متخصص و هتل‌دارانی که از خدمات پلتفرم بهره برده‌اند
          </p>
        </div>

        {/* Carousel OR empty state */}
        {count === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-premium overflow-hidden min-h-[280px] sm:min-h-[240px] flex flex-col items-center justify-center text-center px-6 py-14"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border-2 border-dashed border-emerald-200 dark:border-emerald-700/50 flex items-center justify-center mb-5">
              <MessageSquare size={36} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-navy-900 dark:text-white mb-1.5">
              هنوز نظری ثبت نشده است
            </h3>
            <p className="text-xs sm:text-sm text-navy-500 dark:text-navy-300 max-w-md leading-relaxed">
              با اولین تجربه‌های کاربران پلتفرم، نظرات در این بخش نمایش داده خواهد شد.
            </p>
          </motion.div>
        ) : (
        <div
          className="relative"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className="relative bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-premium overflow-hidden min-h-[280px] sm:min-h-[240px]">
            {/* top gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 sm:p-10 flex flex-col sm:flex-row gap-5 sm:gap-7"
              >
                {/* quote icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow">
                    <Quote size={24} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-navy-700 dark:text-navy-200 leading-relaxed mb-5">
                    «{active.content}»
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Avatar name={active.name} color={active.avatarColor} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-navy-900 dark:text-white truncate">
                          {active.name}
                        </h4>
                        {active.verified && (
                          <BadgeCheck size={14} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-navy-500 dark:text-navy-400 truncate">{active.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Stars rating={active.rating} />
                      <span className="text-[10px] text-navy-400 dark:text-navy-500">{active.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-1.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`نمایش نظر ${i + 1}`}
                  aria-pressed={i === activeIdx}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIdx ? 'w-7 bg-emerald-600' : 'w-1.5 bg-navy-200 dark:bg-navy-700 hover:bg-navy-300 dark:hover:bg-navy-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go(activeIdx - 1)}
                aria-label="نظر قبلی"
                className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => go(activeIdx + 1)}
                aria-label="نظر بعدی"
                className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {(['مسافر', 'آژانس', 'وکیل', 'هتل‌دار'] as Testimonial['category'][]).map((cat) => {
              const exists = testimonials.some((t) => t.category === cat);
              if (!exists) return null;
              return (
                <span
                  key={cat}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${CATEGORY_TINT[cat]}`}
                >
                  {cat}
                </span>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
