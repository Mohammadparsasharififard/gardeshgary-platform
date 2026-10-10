import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Search, BookOpen, ShieldCheck, ArrowDown,
  TrendingUp, ArrowLeft
} from 'lucide-react';
import { lawDatabase, lawCategories, type LawItem } from '@/data';
import { dataLoaders } from '@/lib/loaders';
import ParticleField from '@/components/ParticleField';
import LawDetailModal from '@/components/LawDetailModal';
import ActivityTicker from '@/components/ActivityTicker';

export default function Hero() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('همه');
  const [selectedLaw, setSelectedLaw] = useState<LawItem | null>(null);
  const [liveLaws, setLiveLaws] = useState<LawItem[]>(lawDatabase);
  // Use refs for mouse parallax — avoids a re-render on every mousemove event
  const heroRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Load real laws from the backend on mount.
  // Uses the shared bulk loader (no explicit limit) so this request is
  // deduped with SmartGuide's identical fetch — one network call total.
  useEffect(() => {
    void (async () => {
      const { data } = await dataLoaders.loadLaws();
      if (data && data.length > 0) {
        setLiveLaws(data.slice(0, 50) as unknown as LawItem[]);
      }
    })();
  }, []);

  useEffect(() => {
    // Skip mouse parallax entirely if the user prefers reduced motion.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let frame = 0;
    const handler = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (tiltRef.current) {
          tiltRef.current.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${y * -4}deg)`;
        }
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const filtered = useMemo(() => {
    return liveLaws.filter((law) => {
      const matchCat = activeCategory === 'همه' || law.category === activeCategory;
      const matchSearch =
        search === '' ||
        law.title.includes(search) ||
        law.excerpt.includes(search) ||
        law.article.includes(search);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, liveLaws]);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      {/* ─── NEW: "Midnight Desert" backdrop ───
          Deep night gradient + warm sand glow + geometric girih pattern */}
      <div className="absolute inset-0 bg-gradient-to-bl from-night-950 via-night-900 to-night-950"></div>
      <div className="absolute inset-0 girih-pattern opacity-30"></div>

      {/* Particle field — kept light for performance */}
      <ParticleField density={28} className="opacity-40" />

      {/* Warm sand glow blobs with aurora-flow animation (GPU-accelerated) */}
      <div
        className="absolute top-1/4 left-10 w-80 h-80 bg-sand-500/20 rounded-full blur-[110px] aurora-anim gpu"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-jade-500/18 rounded-full blur-[120px] aurora-anim-2 gpu"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-jade-400/10 rounded-full blur-[90px] aurora-anim-3 gpu"
        aria-hidden="true"
      />

      {/* Top gradient line — warm→jade */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-400/40 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card border border-jade-500/25 rounded-full px-4 py-2 mb-6"
            >
              <div className="relative">
                <ShieldCheck size={16} className="text-jade-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-jade-400 rounded-full animate-ping"></span>
              </div>
              <span className="text-jade-300 text-sm font-medium">پلتفرم ملی و هوشمند حقوق گردشگری ایران</span>
            </motion.div>

            {/* Live activity ticker (social proof) */}
            <div className="mb-6">
              <ActivityTicker />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4"
            >
              مرجع تخصصی و هوشمند
              <br />
              <span className="gradient-text-desert gradient-cycle">حقوق گردشگری ایران</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-lg text-navy-100 leading-relaxed mb-8 max-w-xl"
            >
              مشکل حقوقی خود را جستجو کنید یا از دستیار هوشمند بپرسید — قوانین مرتبط، راهنمایی و متخصص مناسب را دریافت کنید.
            </motion.p>

            {/* CTAs — simplified to focus on search + AI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 sm:gap-3 mb-8"
            >
              <a
                href="#/ai-assistant"
                className="group relative inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 shadow-glow btn-press"
              >
                <Sparkles size={16} className="relative" />
                <span className="relative">مشاوره با دستیار هوشمند</span>
              </a>

              <a
                href="#/laws"
                className="inline-flex items-center justify-center gap-2 glass-card border border-white/15 hover:border-white/30 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 btn-press"
              >
                <Search size={16} className="text-jade-400" />
                جستجوی قوانین
              </a>
            </motion.div>
          </div>

          {/* Right: 3D Floating Search Card (Law Database Explorer) */}
          <motion.div
            id="law-database"
            initial={{ opacity: 0, x: -30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="lg:col-span-5 scroll-mt-24"
          >
            <div ref={tiltRef} className="glass-card rounded-3xl shadow-float border border-white/15 p-4 sm:p-6 transition-transform duration-300 ease-out bg-navy-950/40 backdrop-blur-xl">
              {/* Glow accent */}
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-glow">
                    <BookOpen className="text-white" size={22} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-navy-900"></span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">بانک هوشمند قوانین گردشگری</h3>
                    <p className="text-navy-300 text-xs">جستجو، تحلیل مواد قانونی و ضمانت‌های اجرا</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  جستجوی هوشمند
                </span>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); }}
                  placeholder="جستجوی قانون، ماده، موضوع یا بخشنامه..."
                  aria-label="جستجوی قانون، ماده یا بخشنامه"
                  className="w-full pr-11 pl-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {lawCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); }}
                    aria-pressed={activeCategory === cat}
                    aria-label={`فیلتر دسته‌بندی: ${cat}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? 'bg-emerald-600 text-white shadow-soft'
                        : 'bg-white/5 text-navy-300 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filtered.slice(0, 6).map((law, i) => (
                  <motion.button
                    type="button"
                    key={law.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedLaw(law)}
                    aria-label={`مشاهده ${law.title}`}
                    className="w-full text-right p-3 rounded-xl border border-white/5 bg-white/5 hover:border-emerald-400/40 hover:bg-emerald-500/15 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {law.title}
                          </h4>
                          <span className="text-[9px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                            {law.code}
                          </span>
                        </div>
                        <p className="text-xs text-navy-300 mt-1 line-clamp-1 group-hover:text-navy-200">
                          {law.excerpt}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {law.article}
                        </span>
                        <span className="text-[9px] text-navy-400 group-hover:text-emerald-300 flex items-center gap-0.5">
                          مشاهده کامل <ArrowLeft size={10} />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-8 text-navy-400 text-xs">نتیجه‌ای منطبق با عبارت مورد نظر یافت نشد</div>
                )}
              </div>

              {/* Footer badge */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-navy-400 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-400" />
                  {lawDatabase.length} مقرره قانونی مستند
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  روی هر قانون برای متن کامل کلیک کنید
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Law Detail Modal */}
      <LawDetailModal
        law={selectedLaw}
        onClose={() => setSelectedLaw(null)}
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-navy-300 font-medium tracking-wide">اسکرول کنید</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <span className="w-1 h-2 bg-emerald-400 rounded-full scroll-hint-dot"></span>
        </div>
        <ArrowDown size={12} className="text-emerald-400/60" />
      </motion.div>
    </section>
  );
}
