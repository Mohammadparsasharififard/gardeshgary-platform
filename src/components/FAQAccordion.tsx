import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, MessageCircleQuestion } from 'lucide-react';
import { faqItems, type FAQItem } from '@/data';
import { useToast } from '@/components/Toast';

const CATEGORIES: (FAQItem['category'] | 'همه')[] = [
  'همه', 'مسافر', 'آژانس', 'هتل و اقامت', 'هوانوردی', 'عمومی',
];

export default function FAQAccordion() {
  const { showToast } = useToast();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCat, setActiveCat] = useState<string>('همه');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return faqItems.filter((item) => {
      const matchCat = activeCat === 'همه' || item.category === activeCat;
      const matchSearch =
        search.trim() === '' ||
        item.question.includes(search) ||
        item.answer.includes(search);
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  const handleAskAI = (q: string) => {
    const el = document.getElementById('ai-assistant');
    el?.scrollIntoView({ behavior: 'smooth' });
    showToast(`سؤال به دستیار هوشمند ارسال شد`, 'info');
  };

  return (
    <section id="faq" className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 transition-colors duration-300">
      {/* ambient blob */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <HelpCircle size={14} className="text-amber-600" />
            <span>پرسش‌های متداول حقوقی</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-3">
            پرسش‌های رایج
            <span className="gradient-text-amber"> گردشگری</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            پاسخ حقوقی تخصصی به پرسش‌های پرتکرار مسافران، آژانس‌ها و هتل‌ها — مستند به آخرین قوانین و آیین‌نامه‌های مصوب
          </p>
        </div>

        {/* Search + Categories */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی سؤال (مثلاً: کنسلی، غرامت، بیمه...)"
              aria-label="جستجوی سؤالات متداول"
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 rounded-2xl text-sm text-navy-900 dark:text-navy-100 placeholder-navy-400 dark:placeholder-navy-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
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

        {/* Accordion */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-sm text-navy-400 dark:text-navy-500 bg-white dark:bg-navy-900 rounded-3xl border border-dashed border-navy-200 dark:border-navy-700"
              >
                <MessageCircleQuestion size={36} className="text-navy-300 mx-auto mb-3" />
                سؤالی منطبق با عبارت جستجو یافت نشد.
              </motion.div>
            ) : (
              filtered.map((item, idx) => {
                const isOpen = openId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className={`bg-white dark:bg-navy-900 rounded-2xl border shadow-card overflow-hidden transition-colors ${
                      isOpen ? 'border-emerald-300 dark:border-emerald-700 shadow-premium' : 'border-navy-100 dark:border-navy-800'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-right group"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold tabular-nums transition-colors ${
                          isOpen
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {String(idx + 1).padStart(2, '0').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              {item.category}
                            </span>
                          </div>
                          <h3 className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                            isOpen ? 'text-emerald-800 dark:text-emerald-300' : 'text-navy-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
                          }`}>
                            {item.question}
                          </h3>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isOpen ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-navy-50 dark:bg-navy-800 text-navy-400 dark:text-navy-300'
                        }`}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 pb-5 pr-[60px] sm:pr-[64px]">
                            <div className="border-t border-emerald-100 dark:border-emerald-900/50 pt-4">
                              <p className="text-sm text-navy-700 dark:text-navy-200 leading-relaxed mb-3">
                                {item.answer}
                              </p>
                              <button
                                onClick={() => handleAskAI(item.question)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-700/50 transition-colors"
                              >
                                <MessageCircleQuestion size={13} />
                                پرسش از دستیار هوشمند AI
                              </button>
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
      </div>
    </section>
  );
}
