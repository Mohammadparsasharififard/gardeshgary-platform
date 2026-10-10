import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Search, ChevronLeft, Library, Tag } from 'lucide-react';
import { glossaryTerms, type GlossaryTerm } from '@/data';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 6;

const CATEGORIES: (GlossaryTerm['category'] | 'همه')[] = [
  'همه', 'حقوق مدنی', 'قرارداد', 'مسئولیت', 'آیین‌نامه', 'هوانوردی', 'اقامت',
];

const CAT_TINT: Record<GlossaryTerm['category'], string> = {
  'حقوق مدنی': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50',
  'قرارداد': 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50',
  'مسئولیت': 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50',
  'آیین‌نامه': 'bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-200 border-navy-200 dark:border-navy-700',
  'هوانوردی': 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-700/50',
  'اقامت': 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700/50',
};

export default function LegalGlossary() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [activeCat, setActiveCat] = useState<string>('همه');
  const [openId, setOpenId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return glossaryTerms.filter((t) => {
      const matchCat = activeCat === 'همه' || t.category === activeCat;
      const matchSearch =
        debouncedSearch.trim() === '' ||
        t.term.includes(debouncedSearch) ||
        t.shortDef.includes(debouncedSearch);
      return matchCat && matchSearch;
    });
  }, [activeCat, debouncedSearch]);

  // Reset to page 1 when filter changes
  useEffect(() => { setCurrentPage(1); }, [activeCat, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <section
      id="glossary"
      className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-emerald-50/10 via-white to-slate-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 transition-colors duration-300"
    >
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-emerald-500/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-navy-200 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <Library size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>واژه‌نامه حقوقی گردشگری</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-3">
            <BookMarked className="inline-block text-emerald-600 dark:text-emerald-400 ml-1.5 mb-1" size={28} />
            واژه‌نامه حقوقی
          </h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            تعریف کوتاه اصطلاحات تخصصی حقوقی گردشگری با مثال کاربردی
          </p>
        </div>

        {/* Search + Categories */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی اصطلاح (مثلاً: فورس‌ماژور، غرامت، فسخ...)"
              aria-label="جستجوی واژه‌نامه حقوقی"
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 rounded-2xl text-sm text-navy-900 dark:text-navy-100 placeholder-navy-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCat === cat
                    ? 'bg-emerald-600 text-white shadow-soft'
                    : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-700 border border-navy-200 dark:border-navy-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sm:col-span-2 text-center py-12 text-sm text-navy-400 dark:text-navy-500 bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-navy-200 dark:border-navy-700"
              >
                اصطلاحی یافت نشد.
              </motion.div>
            ) : (
              paginated.map((t, idx) => {
                const isOpen = openId === t.id;
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, delay: idx * 0.03 }}
                    className={`bg-white dark:bg-navy-900 rounded-2xl border shadow-card overflow-hidden transition-colors ${
                      isOpen ? 'border-emerald-300 dark:border-emerald-700' : 'border-navy-100 dark:border-navy-800'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : t.id)}
                      aria-expanded={isOpen}
                      aria-controls={`glossary-panel-${t.id}`}
                      className="w-full flex items-start justify-between gap-3 p-4 text-right group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${CAT_TINT[t.category]} flex items-center gap-1`}>
                            <Tag size={9} />
                            {t.category}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold transition-colors ${
                          isOpen
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-navy-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
                        }`}>
                          {t.term}
                        </h3>
                        <p className="text-[11px] text-navy-500 dark:text-navy-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {t.shortDef}
                        </p>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? -90 : 0 }} transition={{ duration: 0.25 }}>
                        <ChevronLeft size={16} className={`flex-shrink-0 mt-0.5 ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-navy-400 dark:text-navy-500'}`} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && t.example && (
                        <motion.div
                          id={`glossary-panel-${t.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="border-t border-emerald-100 dark:border-emerald-900/40 pt-3">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1.5">
                                <span>مثال کاربردی:</span>
                              </div>
                              <p className="text-xs text-navy-600 dark:text-navy-300 leading-relaxed bg-amber-50/40 dark:bg-amber-900/10 p-2.5 rounded-lg border border-amber-100 dark:border-amber-800/40">
                                {t.example}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer note + pagination */}
        <div className="mt-8">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              itemsPerPage={PAGE_SIZE}
            />
          )}
          <p className="text-center mt-3 text-[11px] text-navy-400 dark:text-navy-500">
            {filtered.length.toLocaleString('fa-IR')} اصطلاح از مجموع {glossaryTerms.length.toLocaleString('fa-IR')} اصطلاح حقوقی
          </p>
        </div>
      </div>
    </section>
  );
}
