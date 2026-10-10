import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Scale, ChevronLeft, X, Sparkles, CheckCircle2
} from 'lucide-react';
import { encyclopediaTerms, type EncyclopediaTerm } from '@/data';
import { useToast } from '@/components/Toast';
import PrintButton from '@/components/PrintButton';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 6;

export default function EncyclopediaSection() {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('همه');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, cancelDebounce] = useDebounce(searchTerm, 300);
  const [selectedTerm, setSelectedTerm] = useState<EncyclopediaTerm | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['همه', 'اصطلاحات عمومی', 'قراردادها', 'مسئولیت مدنی', 'هوانوردی و اقامت', 'گردشگری ورزشی'];

  const filteredTerms = useMemo(() => {
    return encyclopediaTerms.filter((term) => {
      const matchCat = activeCategory === 'همه' || term.category === activeCategory;
      const matchSearch =
        debouncedSearch === '' ||
        term.term.includes(debouncedSearch) ||
        term.shortDef.includes(debouncedSearch) ||
        term.lawRef.includes(debouncedSearch);
      return matchCat && matchSearch;
    });
  }, [activeCategory, debouncedSearch]);

  // Reset to page 1 when the filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, debouncedSearch]);

  const totalPages = Math.ceil(filteredTerms.length / PAGE_SIZE);
  const paginatedTerms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTerms.slice(start, start + PAGE_SIZE);
  }, [filteredTerms, currentPage]);

  const handleAskAIAboutTerm = (termName: string) => {
    setSelectedTerm(null);
    const aiElement = document.getElementById('ai-assistant');
    if (aiElement) {
      aiElement.scrollIntoView({ behavior: 'smooth' });
      showToast(`تحلیل اصطلاح «${termName}» به دستیار هوشمند ارسال شد`, 'info');
    }
  };

  return (
    <section id="encyclopedia" className="py-24 relative overflow-hidden bg-gradient-to-b from-navy-950/10 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <BookOpen size={16} className="text-amber-600" />
            <span>دانشنامه جامع و ویکی مفاهیم حقوقی</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            دانشنامه حقوق گردشگری ایران
          </h2>
          <p className="text-navy-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            مرجع تعریف اصطلاحات تخصصی حقوقی، تعاریف آمره، قواعد مسئولیت مدنی و استنادهای مواد قانونی
          </p>
        </div>

        {/* Search Bar + Categories */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی اصطلاح حقوقی (مثلاً: فورس‌ماژور، مسئولیت تضامنی، پکیج تور...)"
              className="w-full pr-11 pl-4 py-3.5 bg-white border border-navy-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); cancelDebounce(); }}
                aria-label="پاک کردن جستجو"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-500 flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-soft'
                    : 'bg-white text-navy-600 hover:bg-navy-100 border border-navy-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedTerms.map((item) => (
              <motion.button
                type="button"
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedTerm(item)}
                aria-label={`مشاهده تعریف ${item.term}`}
                className="group w-full text-right p-6 bg-white rounded-3xl border border-navy-100 shadow-card hover:shadow-premium hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-navy-400 font-mono">ID: {item.id}</span>
                  </div>

                  <h3 className="font-extrabold text-navy-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.term}
                  </h3>

                  <p className="text-xs text-navy-600 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {item.shortDef}
                  </p>
                </div>

                <div className="pt-3 border-t border-navy-50 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span className="truncate max-w-[200px] text-[11px] text-navy-400">{item.lawRef}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                    تعریف کامل <ChevronLeft size={14} />
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 text-sm text-navy-400 bg-white rounded-3xl border border-navy-100 max-w-md mx-auto">
            اصطلاحی متناسب با جستجوی شما یافت نشد.
          </div>
        ) : (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTerms.length}
            itemsPerPage={PAGE_SIZE}
          />
        )}
      </div>

      {/* Term Detail Modal */}
      {selectedTerm && (
        <AnimatePresence>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
            onClick={() => setSelectedTerm(null)}
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`جزئیات اصطلاح حقوقی: ${selectedTerm.term}`}
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-navy-100"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-400/30">
                    <BookOpen size={20} className="text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono mb-1 inline-block">
                      {selectedTerm.category}
                    </span>
                    <h3 className="font-extrabold text-base text-white">{selectedTerm.term}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  aria-label="بستن جزئیات اصطلاح حقوقی"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 text-xs sm:text-sm text-navy-800 leading-relaxed max-h-[70vh] overflow-y-auto">
                <div className="p-4 bg-navy-50/70 rounded-2xl border border-navy-100">
                  <p className="font-bold text-navy-900 mb-1">تعریف جامع حقوقی:</p>
                  <p className="text-navy-700 leading-relaxed">{selectedTerm.fullDef}</p>
                </div>

                {/* Key points */}
                <div>
                  <p className="font-bold text-navy-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    نکات کلیدی و کاربردی:
                  </p>
                  <div className="space-y-1.5">
                    {selectedTerm.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl text-xs border border-emerald-100">
                        <span className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Law Reference */}
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs flex items-center gap-2 text-amber-900">
                  <Scale size={16} className="text-amber-700 flex-shrink-0" />
                  <span>مستند و رفرنس قانونی: <strong>{selectedTerm.lawRef}</strong></span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-navy-50/80 border-t border-navy-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTerm(null)}
                    className="px-4 py-2 bg-white hover:bg-navy-100 text-navy-700 rounded-xl text-xs font-semibold border border-navy-200"
                  >
                    بستن
                  </button>
                  <PrintButton />
                </div>

                <button
                  onClick={() => handleAskAIAboutTerm(selectedTerm.term)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-glow"
                >
                  <Sparkles size={14} />
                  <span>تحلیل هوشمند این مفاهیم با AI</span>
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}

