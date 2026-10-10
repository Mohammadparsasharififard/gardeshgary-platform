import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, UserCheck, Building2, Compass, CheckCircle2, Scale, Sparkles, ChevronLeft,
  Plane, Hotel, Shield, Flag, AlertTriangle, Phone,
} from 'lucide-react';
import { rightsGuides as staticGuides, type RightsGuide } from '@/data';
import { dataLoaders } from '@/lib/loaders';
import { useToast } from '@/components/Toast';

interface RightsHubSectionProps {
  /** When set, force a specific category and hide the tab switcher.
   *  This lets routing pages (traveler-rights, business-rights, sports-rights)
   *  show only the relevant guides without the internal tab navigation. */
  forceTarget?: 'tourist' | 'business' | 'sports';
}

// Per-category visual identity (badge color, accent icon, hero title, summary)
const CATEGORY_PROFILE: Record<
  'tourist' | 'business' | 'sports',
  { badge: string; badgeText: string; icon: typeof UserCheck; title: string; subtitle: string; accent: string }
> = {
  tourist: {
    badge: 'bg-jade-50 dark:bg-jade-900/30 border-jade-200 dark:border-jade-700/50 text-jade-800 dark:text-jade-200',
    badgeText: 'حقوق گردشگر و مسافر',
    icon: UserCheck,
    title: 'حقوق و تعهدات قانونی مسافران',
    subtitle: 'هر آنچه گردشگر باید درباره پرواز، اقامت، قرارداد تور و جبران خسارت بداند',
    accent: 'from-jade-600/15 via-jade-500/5 to-transparent',
  },
  business: {
    badge: 'bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700/50 text-sky-800 dark:text-sky-200',
    badgeText: 'حقوق کسب‌وکارهای گردشگری',
    icon: Building2,
    title: 'مقررات آژانس‌ها، هتل‌ها و اقامتگاه‌ها',
    subtitle: 'معافیت‌های مالیاتی، ضمانت‌نامه‌ها، ووچر و مسئولیت‌های قانونی کسب‌وکارهای گردشگری',
    accent: 'from-sky-600/15 via-sky-500/5 to-transparent',
  },
  sports: {
    badge: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200',
    badgeText: 'حقوق گردشگری ورزشی و ماجراجویانه',
    icon: Compass,
    title: 'ایمنی، مجوزها و مسئولیت در تورهای ورزشی',
    subtitle: 'کوهنوردی، غواصی، رفتینگ، رالی و کویرنوردی — ابعاد حقوقی و ضمانت اجرا',
    accent: 'from-amber-600/15 via-amber-500/5 to-transparent',
  },
};

// Per-guide icon mapping (cleaner than the inline ternary we used before).
// Note: the data uses `Building` as the iconName string, but lucide-react
// exports it as `Building2` (the building icon variant we want here).
const ICON_MAP: Record<string, typeof Scale> = {
  Plane, Hotel, Building: Building2, Shield, Compass, Flag, UserCheck,
};

export default function RightsHubSection({ forceTarget }: RightsHubSectionProps) {
  const { showToast } = useToast();
  const [activeTarget, setActiveTarget] = useState<'tourist' | 'business' | 'sports'>(forceTarget || 'tourist');
  const [selectedGuide, setSelectedGuide] = useState<RightsGuide | null>(null);
  const [guides, setGuides] = useState<RightsGuide[]>(staticGuides);

  // Load real rights guides from the backend on mount
  useEffect(() => {
    void (async () => {
      // Map the target to the API enum
      const apiTarget = forceTarget
        ? ({ tourist: 'TOURIST', business: 'BUSINESS', sports: 'SPORTS' } as const)[forceTarget]
        : undefined;
      const { data } = await dataLoaders.loadRightsGuides(apiTarget);
      if (data && data.length > 0) {
        // Map backend RightsGuide (uppercase target) to the static RightsGuide shape
        const mapped: RightsGuide[] = data.map((g) => ({
          id: g.id,
          title: g.title,
          target: g.target.toLowerCase() as 'tourist' | 'business' | 'sports',
          iconName: g.iconName,
          summary: g.summary,
          details: g.details,
          lawCitations: g.lawCitations,
        }));
        setGuides(mapped);
      }
    })();
  }, [forceTarget]);

  // If forceTarget is set, always use it (ignore internal state)
  const currentTarget = forceTarget || activeTarget;
  const filteredGuides = guides.filter((g) => g.target === currentTarget);
  const profile = CATEGORY_PROFILE[currentTarget];

  const handleAskAIGuide = (title: string) => {
    setSelectedGuide(null);
    const aiElement = document.getElementById('ai-assistant');
    if (aiElement) {
      aiElement.scrollIntoView({ behavior: 'smooth' });
      showToast(`موضوع «${title}» به دستیار هوشمند جهت تحلیل ارسال شد`, 'info');
    }
  };

  // When forceTarget is set we render only the guides grid (the PageHeader already shows
  // the page title); when forceTarget is undefined we render the full hub experience.
  if (forceTarget) {
    return (
      <section className="py-10 sm:py-12 relative overflow-hidden">
        {/* Subtle accent glow per category */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-b ${profile.accent} pointer-events-none`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Mini category badge */}
          <div className="mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-bold ${profile.badge}`}
            >
              <profile.icon size={15} />
              {profile.badgeText}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-xl sm:text-2xl font-extrabold text-night-900 dark:text-white mt-3 mb-1.5"
            >
              {profile.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-night-500 dark:text-night-300 max-w-2xl leading-relaxed"
            >
              {profile.subtitle}
            </motion.p>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredGuides.map((guide, idx) => {
              const Icon = ICON_MAP[guide.iconName] || Scale;
              return (
                <motion.button
                  type="button"
                  key={guide.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedGuide(guide)}
                  className="group text-right p-5 sm:p-6 bg-white dark:bg-night-900 rounded-3xl border border-night-100 dark:border-night-800 shadow-card hover:shadow-premium hover:border-jade-300 dark:hover:border-jade-700/50 transition-all cursor-pointer flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-jade-50 dark:bg-jade-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-jade-600 dark:text-jade-400" />
                    </div>
                    <h3 className="font-bold text-night-900 dark:text-white text-sm leading-snug">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-xs text-night-600 dark:text-night-300 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {guide.summary}
                  </p>
                  <div className="pt-3 border-t border-night-50 dark:border-night-800 flex items-center justify-between text-xs font-semibold text-jade-700 dark:text-jade-300">
                    <span className="flex items-center gap-1">
                      <Scale size={13} />
                      {guide.lawCitations.length} استناد
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                      مشاهده کامل <ChevronLeft size={14} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle size={28} className="text-night-300 dark:text-night-600 mx-auto mb-2" />
              <p className="text-sm text-night-400 dark:text-night-500">
                راهنمایی برای این بخش به‌زودی اضافه خواهد شد.
              </p>
            </div>
          )}

          {/* Need help banner */}
          <div className="mt-10 sm:mt-12 bg-gradient-to-l from-night-950 via-night-900 to-night-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold mb-1">مشکل خود را پیدا نکردید؟</h3>
              <p className="text-xs sm:text-sm text-night-200 leading-relaxed">
                مشکل حقوقی‌تان را به زبان خودتان بنویسید تا سیستم قوانین مرتبط و متخصص مناسب را پیشنهاد دهد.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#/"
                className="inline-flex items-center gap-1.5 bg-jade-600 hover:bg-jade-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-glow transition-colors btn-press"
              >
                <Sparkles size={14} />
                راهنمای هوشمند
              </a>
              <a
                href="#/consultation"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-white/15 transition-colors"
              >
                <Phone size={14} />
                مشاوره با وکیل
              </a>
            </div>
          </div>
        </div>

        {/* Guide Detail Modal */}
        {selectedGuide && (
          <AnimatePresence>
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-night-950/70 backdrop-blur-md"
              onClick={() => setSelectedGuide(null)}
              dir="rtl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`جزئیات: ${selectedGuide.title}`}
                className="bg-white dark:bg-night-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
              >
                <div className="bg-gradient-to-l from-night-950 via-night-900 to-night-800 p-5 text-white flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white pr-2">{selectedGuide.title}</h3>
                  <button onClick={() => setSelectedGuide(null)} aria-label="بستن" className="text-night-300 hover:text-white p-1 flex-shrink-0">
                    <ChevronLeft size={18} />
                  </button>
                </div>
                <div className="p-5 space-y-4 text-sm text-night-700 dark:text-night-200 leading-relaxed max-h-[60vh] overflow-y-auto">
                  <p className="font-medium text-night-900 dark:text-white">{selectedGuide.summary}</p>
                  <div className="space-y-2">
                    <p className="font-bold text-night-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-jade-600 dark:text-jade-400" />
                      نکات کلیدی:
                    </p>
                    {selectedGuide.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-jade-50/40 dark:bg-jade-900/20 p-3 rounded-xl text-xs border border-jade-100 dark:border-jade-800/30">
                        <span className="w-4 h-4 bg-jade-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-night-100 dark:border-night-800">
                    <p className="font-bold text-night-900 dark:text-white mb-2 flex items-center gap-2">
                      <Scale size={16} className="text-jade-600 dark:text-jade-400" />
                      استنادهای قانونی:
                    </p>
                    {selectedGuide.lawCitations.map((citation, idx) => (
                      <p key={idx} className="text-xs text-night-600 dark:text-night-400 bg-night-50 dark:bg-night-800 px-3 py-2 rounded-lg mb-1">
                        {citation}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-night-50/80 dark:bg-night-950/40 border-t border-night-100 dark:border-night-800 flex justify-end">
                  <button
                    onClick={() => handleAskAIGuide(selectedGuide.title)}
                    className="flex items-center gap-2 bg-jade-600 hover:bg-jade-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow btn-press"
                  >
                    <Sparkles size={14} />
                    تحلیل با دستیار هوشمند
                  </button>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        )}
      </section>
    );
  }

  // ─── Full hub experience (when forceTarget is NOT set) ───
  return (
    <section id="rights-hub" className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-night-950/10 dark:from-night-950 dark:via-night-900 dark:to-night-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-jade-50 dark:bg-jade-900/30 border border-jade-200 dark:border-jade-700/50 text-jade-800 dark:text-jade-300 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <ShieldCheck size={16} className="text-jade-600 dark:text-jade-400" />
            <span>راهنمای جامع حقوق و تعهدات قانونی</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-night-900 dark:text-white mb-3">
            مرکز تخصصی حقوق گردشگری ایران
          </h2>
          <p className="text-night-500 dark:text-night-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            راهنمای قانونی تفکیک‌شده برای مسافران، کسب‌وکارهای گردشگری و تورهای ماجراجویانه و ورزشی
          </p>
        </div>

        {/* Category Tabs — only shown when forceTarget is NOT set */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(['tourist', 'business', 'sports'] as const).map((t) => {
            const TabIcon = CATEGORY_PROFILE[t].icon;
            return (
              <button
                key={t}
                onClick={() => setActiveTarget(t)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTarget === t
                    ? 'bg-jade-600 text-white shadow-soft'
                    : 'bg-white dark:bg-night-900 text-night-600 dark:text-night-300 hover:bg-jade-50 dark:hover:bg-night-800 border border-night-200 dark:border-night-700'
                }`}
              >
                <TabIcon size={16} />
                {t === 'tourist' ? 'حقوق گردشگر' : t === 'business' ? 'حقوق کسب‌وکارها' : 'گردشگری ورزشی'}
              </button>
            );
          })}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGuides.map((guide) => {
              const Icon = ICON_MAP[guide.iconName] || Scale;
              return (
                <motion.button
                  type="button"
                  key={guide.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedGuide(guide)}
                  className="group text-right p-5 sm:p-6 bg-white dark:bg-night-900 rounded-3xl border border-night-100 dark:border-night-800 shadow-card hover:shadow-premium hover:border-jade-300 dark:hover:border-jade-700/50 transition-all cursor-pointer flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-jade-50 dark:bg-jade-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-jade-600 dark:text-jade-400" />
                    </div>
                    <h3 className="font-bold text-night-900 dark:text-white text-sm leading-snug">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-xs text-night-600 dark:text-night-300 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {guide.summary}
                  </p>
                  <div className="pt-3 border-t border-night-50 dark:border-night-800 flex items-center justify-between text-xs font-semibold text-jade-700 dark:text-jade-300">
                    <span className="flex items-center gap-1">
                      <Scale size={13} />
                      {guide.lawCitations.length} استناد
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                      مشاهده کامل <ChevronLeft size={14} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-night-400 dark:text-night-500">راهنمایی برای این بخش به‌زودی اضافه خواهد شد.</p>
          </div>
        )}
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <AnimatePresence>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-night-950/70 backdrop-blur-md"
            onClick={() => setSelectedGuide(null)}
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`جزئیات: ${selectedGuide.title}`}
              className="bg-white dark:bg-night-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-l from-night-950 via-night-900 to-night-800 p-5 text-white flex items-center justify-between">
                <h3 className="font-extrabold text-base text-white pr-2">{selectedGuide.title}</h3>
                <button onClick={() => setSelectedGuide(null)} aria-label="بستن" className="text-night-300 hover:text-white p-1 flex-shrink-0">
                  <ChevronLeft size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm text-night-700 dark:text-night-200 leading-relaxed max-h-[60vh] overflow-y-auto">
                <p className="font-medium text-night-900 dark:text-white">{selectedGuide.summary}</p>
                <div className="space-y-2">
                  <p className="font-bold text-night-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-jade-600 dark:text-jade-400" />
                    نکات کلیدی:
                  </p>
                  {selectedGuide.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-jade-50/40 dark:bg-jade-900/20 p-3 rounded-xl text-xs border border-jade-100 dark:border-jade-800/30">
                      <span className="w-4 h-4 bg-jade-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-night-100 dark:border-night-800">
                  <p className="font-bold text-night-900 dark:text-white mb-2 flex items-center gap-2">
                    <Scale size={16} className="text-jade-600 dark:text-jade-400" />
                    استنادهای قانونی:
                  </p>
                  {selectedGuide.lawCitations.map((citation, idx) => (
                    <p key={idx} className="text-xs text-night-600 dark:text-night-400 bg-night-50 dark:bg-night-800 px-3 py-2 rounded-lg mb-1">
                      {citation}
                    </p>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-night-50/80 dark:bg-night-950/40 border-t border-night-100 dark:border-night-800 flex justify-end">
                <button
                  onClick={() => handleAskAIGuide(selectedGuide.title)}
                  className="flex items-center gap-2 bg-jade-600 hover:bg-jade-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow btn-press"
                >
                  <Sparkles size={14} />
                  تحلیل با دستیار هوشمند
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
