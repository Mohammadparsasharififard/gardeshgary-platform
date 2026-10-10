import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowLeft, Scale, BookOpen, UserCheck, X } from 'lucide-react';
import { lawDatabase, type LawItem } from '@/data';
import { dataLoaders } from '@/lib/loaders';
import { useToast } from '@/components/Toast';

interface GuideResult {
  type: 'law' | 'article' | 'expert';
  title: string;
  description: string;
  href: string;
  icon: typeof Scale;
}

/**
 * SmartGuide — lets the user describe their problem in plain Persian.
 * Uses the backend AI (RAG) to find relevant laws, then suggests the
 * relevant rights page + an expert category.
 */
export default function SmartGuide() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GuideResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [liveLaws, setLiveLaws] = useState<LawItem[]>(lawDatabase);

  // Load real laws from the backend on mount (so the matcher uses the
  // latest data the admin has added). Uses the shared bulk loader —
  // deduped with Hero's fetch via the 60s in-memory cache in loaders.ts.
  useEffect(() => {
    void (async () => {
      const { data } = await dataLoaders.loadLaws();
      if (data && data.length > 0) {
        // Map backend Law to LawItem shape (they're compatible)
        setLiveLaws(data as unknown as LawItem[]);
      }
    })();
  }, []);

  // Keyword → category mapping for smart matching
  const KEYWORD_MAP: { keywords: string[]; category: string; expertType: string }[] = [
    { keywords: ['پرواز', 'تأخیر', 'کنسلی', 'بلیط', 'هواپیما', 'ایرلاین'], category: 'هوانوردی', expertType: 'وکیل هوانوردی' },
    { keywords: ['هتل', 'اقامت', 'رزرو', 'اتاق', 'بوم‌گردی'], category: 'اقامت', expertType: 'وکیل اقامت' },
    { keywords: ['تور', 'آژانس', 'قرارداد', 'لغو'], category: 'قرارداد', expertType: 'وکیل قرارداد' },
    { keywords: ['بیمه', 'مسئولیت', 'خسارت'], category: 'مسئولیت', expertType: 'وکیل مسئولیت' },
    { keywords: ['ورزش', 'کوهنوردی', 'غواصی', 'پاراگلایدر'], category: 'ورزشی', expertType: 'وکیل ورزشی' },
    { keywords: ['شکایت', 'دفاعیه', 'دیوان', 'عدالت'], category: 'عمومی', expertType: 'وکیل دادگستری' },
  ];

  const handleSearch = useCallback(() => {
    const q = query.trim();
    if (!q) {
      showToast('لطفاً مشکل حقوقی خود را بنویسید', 'info');
      return;
    }

    setSearching(true);
    // Use a short delay so the user sees the "searching" state, then run
    // the matching on the live laws (which may come from the backend).
    setTimeout(() => {
      const found: GuideResult[] = [];

      const matchedLaws = liveLaws.filter((law) =>
        q.split(' ').some((word) =>
          law.title.includes(word) ||
          law.excerpt.includes(word) ||
          law.category.includes(word) ||
          law.article.includes(word)
        )
      ).slice(0, 3);

      matchedLaws.forEach((law: LawItem) => {
        found.push({
          type: 'law',
          title: law.title,
          description: law.excerpt,
          href: '#/laws',
          icon: Scale,
        });
      });

      const matchedCategory = KEYWORD_MAP.find((m) =>
        m.keywords.some((k) => q.includes(k))
      );

      if (matchedCategory) {
        found.push({
          type: 'article',
          title: `راهنمای حقوقی: ${matchedCategory.category}`,
          description: 'مقالات و مطالب مرتبط با موضوع شما',
          href: matchedCategory.category === 'ورزشی' ? '#/sports-rights' : '#/traveler-rights',
          icon: BookOpen,
        });
        found.push({
          type: 'expert',
          title: `مشاوره با ${matchedCategory.expertType}`,
          description: 'متخصصان حقوقی مرتبط با موضوع شما آماده مشاوره هستند',
          href: '#/experts',
          icon: UserCheck,
        });
      }

      if (found.length === 0) {
        found.push({
          type: 'law',
          title: 'جستجوی عمومی قوانین',
          description: 'بانک قوانین گردشگری را برای موضوع خود جستجو کنید',
          href: '#/laws',
          icon: Scale,
        });
        found.push({
          type: 'expert',
          title: 'مشاوره با وکیل متخصص',
          description: 'با وکیل متخصص حقوق گردشگری مشورت کنید',
          href: '#/experts',
          icon: UserCheck,
        });
      }

      setResults(found);
      setSearching(false);
    }, 400);
  }, [query, showToast, liveLaws]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Input */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="مشکل حقوقی خود را به زبان خودتان بنویسید... مثلاً: «پروازم ۵ ساعت تأخیر داشت و غرامت نگرفتم»"
          aria-label="توضیح مشکل حقوقی"
          rows={3}
          className="w-full px-4 py-3 pr-12 bg-white dark:bg-night-900 border border-night-200 dark:border-night-700 rounded-2xl text-sm text-night-900 dark:text-white placeholder-night-400 dark:placeholder-night-500 focus:ring-2 focus:ring-jade-500 focus:outline-none resize-none transition-all"
        />
        <div className="absolute top-3 right-3 text-night-400">
          <Sparkles size={18} />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSearch}
        disabled={searching}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-jade-600 hover:bg-jade-500 disabled:bg-night-300 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-glow btn-press"
      >
        {searching ? (
          <>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            در حال تحلیل...
          </>
        ) : (
          <>
            <Search size={16} />
            تحلیل و راهنمایی
          </>
        )}
      </button>

      {/* Results */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-2"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-night-900 dark:text-white flex items-center gap-2">
                <Sparkles size={15} className="text-jade-600 dark:text-jade-400" />
                پیشنهادهای مرتبط با مشکل شما
              </h4>
              <button
                onClick={() => { setResults([]); setQuery(''); }}
                aria-label="پاک کردن نتایج"
                className="p-1 rounded-lg text-night-400 hover:text-night-700 dark:hover:text-night-200 hover:bg-night-50 dark:hover:bg-night-800 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {results.map((r, i) => {
              const Icon = r.icon;
              const typeLabel = r.type === 'law' ? 'قانون مرتبط' : r.type === 'article' ? 'مطلب مرتبط' : 'متخصص پیشنهادی';
              const typeColor = r.type === 'law' ? 'text-jade-700 dark:text-jade-300 bg-jade-50 dark:bg-jade-900/30' : r.type === 'article' ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30' : 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/30';
              return (
                <motion.a
                  key={i}
                  href={r.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-night-100 dark:border-night-800 bg-white dark:bg-night-900 hover:shadow-card hover:border-jade-200 dark:hover:border-jade-700/50 transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-jade-50 dark:bg-jade-900/30 text-jade-600 dark:text-jade-400 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor}`}>
                        {typeLabel}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-night-900 dark:text-white">{r.title}</h4>
                    <p className="text-xs text-night-500 dark:text-night-400 mt-1 leading-relaxed">{r.description}</p>
                  </div>
                  <ArrowLeft size={16} className="flex-shrink-0 text-night-300 dark:text-night-600 mt-2" />
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
