import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, BookOpen, Newspaper, Scale, Users
} from 'lucide-react';
import {
  lawDatabase, encyclopediaTerms, newsArticles, rightsGuides, experts,
  type LawItem
} from '@/data';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type SearchFilter = 'all' | 'laws' | 'encyclopedia' | 'news' | 'rights' | 'experts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLaw?: (law: LawItem) => void;
}

export default function GlobalSearchModal({ isOpen, onClose, onSelectLaw }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');

  // Focus trap (Escape is already handled by the global listener below)
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { laws: [], encyclopedia: [], news: [], rights: [], lawyers: [] };
    const q = query.trim().toLowerCase();

    const laws = lawDatabase.filter((l) => l.title.includes(q) || l.excerpt.includes(q) || l.article.includes(q));
    const encyclopedia = encyclopediaTerms.filter((e) => e.term.includes(q) || e.shortDef.includes(q) || e.category.includes(q));
    const news = newsArticles.filter((n) => n.title.includes(q) || n.excerpt.includes(q));
    const rights = rightsGuides.filter((r) => r.title.includes(q) || r.summary.includes(q));
    const lawyers = experts.filter((e) => e.name.includes(q) || e.specialty.includes(q) || e.city.includes(q));

    return { laws, encyclopedia, news, rights, lawyers };
  }, [query]);

  if (!isOpen) return null;

  const totalResultsCount =
    searchResults.laws.length +
    searchResults.encyclopedia.length +
    searchResults.news.length +
    searchResults.rights.length +
    searchResults.lawyers.length;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-4 bg-navy-950/80 backdrop-blur-md"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          ref={trapRef}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="جستجوی سراسری پلتفرم"
          tabIndex={-1}
          className="relative bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[82vh] focus:outline-none"
        >
          {/* Top Search Bar */}
          <div className="p-4 sm:p-5 border-b border-navy-100 bg-slate-50/70 flex items-center gap-3">
            <Search size={20} className="text-emerald-600 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              aria-label="عبارت جستجو"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی هوشمند در قوانین، دانشنامه، اخبار، حقوق مسافر و وکلا..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-navy-900 placeholder-navy-400 focus:outline-none"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline-block text-[10px] text-navy-400 bg-navy-100 px-2 py-0.5 rounded font-mono">
                Esc
              </span>
              <button
                onClick={onClose}
                aria-label="بستن جستجو"
                className="p-1.5 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Category Quick Filter Bar */}
          <div className="px-4 py-2 bg-navy-50/50 border-b border-navy-100 flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'همه بخش‌ها' },
              { id: 'laws', label: 'قوانین' },
              { id: 'encyclopedia', label: 'دانشنامه' },
              { id: 'news', label: 'اخبار' },
              { id: 'rights', label: 'حقوق گردشگر' },
              { id: 'experts', label: 'متخصصان' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as SearchFilter)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-navy-600 hover:bg-navy-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results Feed */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-xs text-navy-800">
            {!query.trim() ? (
              <div className="text-center py-10 space-y-3 text-navy-400">
                <Search size={36} className="mx-auto opacity-30 text-emerald-600" />
                <p className="text-sm font-medium">عبارت مورد نظر خود را تایپ کنید</p>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto pt-2">
                  {['فورس‌ماژور', 'تأخیر پرواز', 'کنسلی هتل', 'بیمه طبیعت‌گردی', 'حقوق تورلیدر'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="bg-navy-50 hover:bg-emerald-50 hover:text-emerald-700 text-navy-600 border border-navy-100 px-2.5 py-1 rounded-lg text-xs transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : totalResultsCount === 0 ? (
              <div className="text-center py-10 text-navy-400">
                نتیجه‌ای برای «{query}» در پلتفرم یافت نشد.
              </div>
            ) : (
              <div className="space-y-4">
                {/* LAWS */}
                {(activeFilter === 'all' || activeFilter === 'laws') && searchResults.laws.length > 0 && (
                  <div>
                    <h4 className="font-bold text-navy-900 text-xs mb-2 flex items-center gap-1.5">
                      <Scale size={14} className="text-emerald-600" /> قوانین و بخشنامه‌ها ({searchResults.laws.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.laws.map((law) => (
                        <div
                          key={law.id}
                          onClick={() => { onClose(); onSelectLaw?.(law); }}
                          className="p-3 bg-navy-50/60 hover:bg-emerald-50/70 border border-navy-100 hover:border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-bold text-navy-900 group-hover:text-emerald-800 text-xs">{law.title}</span>
                            <p className="text-[11px] text-navy-500 line-clamp-1 mt-0.5">{law.excerpt}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold whitespace-nowrap mr-2">
                            {law.article}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ENCYCLOPEDIA */}
                {(activeFilter === 'all' || activeFilter === 'encyclopedia') && searchResults.encyclopedia.length > 0 && (
                  <div>
                    <h4 className="font-bold text-navy-900 text-xs mb-2 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-amber-600" /> دانشنامه حقوقی ({searchResults.encyclopedia.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.encyclopedia.map((enc) => (
                        <div
                          key={enc.id}
                          onClick={() => {
                            onClose();
                            const el = document.getElementById('encyclopedia');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="p-3 bg-amber-50/40 hover:bg-amber-50 border border-amber-100 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-amber-900 text-xs">{enc.term}</span>
                            <p className="text-[11px] text-navy-600 line-clamp-1 mt-0.5">{enc.shortDef}</p>
                          </div>
                          <span className="text-[10px] bg-white text-amber-800 px-2 py-0.5 rounded font-medium whitespace-nowrap mr-2 border border-amber-200">
                            {enc.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NEWS */}
                {(activeFilter === 'all' || activeFilter === 'news') && searchResults.news.length > 0 && (
                  <div>
                    <h4 className="font-bold text-navy-900 text-xs mb-2 flex items-center gap-1.5">
                      <Newspaper size={14} className="text-blue-600" /> اخبار و مقالات ({searchResults.news.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.news.map((news) => (
                        <div
                          key={news.id}
                          onClick={() => {
                            onClose();
                            const el = document.getElementById('news');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="p-3 bg-blue-50/40 hover:bg-blue-50 border border-blue-100 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-navy-900 text-xs">{news.title}</span>
                            <p className="text-[11px] text-navy-500 line-clamp-1 mt-0.5">{news.excerpt}</p>
                          </div>
                          <span className="text-[10px] text-navy-400 whitespace-nowrap mr-2">{news.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LAWYERS */}
                {(activeFilter === 'all' || activeFilter === 'experts') && searchResults.lawyers.length > 0 && (
                  <div>
                    <h4 className="font-bold text-navy-900 text-xs mb-2 flex items-center gap-1.5">
                      <Users size={14} className="text-emerald-600" /> وکلا و مشاوران ({searchResults.lawyers.length})
                    </h4>
                    <div className="space-y-1.5">
                      {searchResults.lawyers.map((exp) => (
                        <div
                          key={exp.id}
                          onClick={() => {
                            onClose();
                            const el = document.getElementById('experts');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="p-3 bg-white hover:bg-navy-50 border border-navy-100 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-navy-900 text-xs">{exp.name}</span>
                            <p className="text-[11px] text-navy-500 mt-0.5">{exp.specialty} • {exp.city}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                            امتیاز {exp.rating}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-navy-50/80 border-t border-navy-100 text-[11px] text-navy-500 flex items-center justify-between px-5">
            <span>تعداد کل نتایج: <strong className="text-navy-900">{totalResultsCount}</strong> مورد</span>
            <span>پلتفرم ملی حقوق گردشگری ایران</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

