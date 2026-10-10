import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, User, Building2, AlertTriangle, Landmark, ChevronLeft, FileText,
} from 'lucide-react';
import { lawComparisonTable } from '@/data';

type Viewport = 'desktop' | 'mobile';

export default function LawComparisonTable() {
  const [activeRow, setActiveRow] = useState<string | null>(null);

  return (
    <section id="comparison" className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-emerald-50/20 via-white to-slate-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 transition-colors duration-300">
      {/* ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-navy-200 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <Scale size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>مقایسه حقوق و تکالیف قانونی</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-3">
            جدول تطبیقی
            <span className="gradient-text"> حقوق مسافر و آژانس</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            نگاهی یک‌جا به حقوق مسافر، تکالیف آژانس و ضمانت اجرای هر یک از مهم‌ترین سناریوهای حقوقی گردشگری
          </p>
        </div>

        {/* Desktop table view (lg+) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-premium overflow-hidden"
        >
          {/* Header row */}
          <div className="grid grid-cols-5 gap-4 p-5 bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <FileText size={15} />
              موضوع
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <User size={15} />
              حقوق مسافر
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Building2 size={15} />
              تکالیف آژانس
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <AlertTriangle size={15} />
              ضمانت اجرا
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-200">
              <Landmark size={15} />
              منبع قانونی
            </div>
          </div>

          {/* Rows */}
          {lawComparisonTable.map((row, idx) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`grid grid-cols-5 gap-4 p-5 border-t border-navy-50 dark:border-navy-800 hover:bg-emerald-50/30 dark:hover:bg-navy-800/50 transition-colors group ${
                idx % 2 === 0 ? 'bg-white dark:bg-navy-900' : 'bg-slate-50/40 dark:bg-navy-950/40'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-[10px] font-bold tabular-nums">
                  {String(idx + 1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}
                </span>
                <span className="text-sm font-bold text-navy-900 dark:text-white leading-snug">{row.topic}</span>
              </div>
              <div className="text-xs text-navy-700 dark:text-navy-200 leading-relaxed">{row.passengerRight}</div>
              <div className="text-xs text-navy-700 dark:text-navy-200 leading-relaxed">{row.agencyObligation}</div>
              <div className="text-xs text-red-700 dark:text-red-300 leading-relaxed bg-red-50/50 dark:bg-red-900/20 px-2.5 py-1.5 rounded-lg border border-red-100/60 dark:border-red-800/50">
                {row.sanction}
              </div>
              <div className="text-[11px] text-navy-500 dark:text-navy-400 leading-snug font-medium bg-navy-50/60 dark:bg-navy-800/60 px-2.5 py-1.5 rounded-lg border border-navy-100 dark:border-navy-700">
                {row.source}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile accordion view (< lg) */}
        <div className="lg:hidden space-y-3">
          {lawComparisonTable.map((row, idx) => {
            const isOpen = activeRow === row.id;
            return (
              <motion.div
                key={row.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className={`bg-white dark:bg-navy-900 rounded-2xl border shadow-card overflow-hidden ${
                  isOpen ? 'border-emerald-300 dark:border-emerald-700' : 'border-navy-100 dark:border-navy-800'
                }`}
              >
                <button
                  onClick={() => setActiveRow(isOpen ? null : row.id)}
                  aria-expanded={isOpen}
                  aria-controls={`cmp-panel-${row.id}`}
                  className="w-full flex items-center justify-between gap-3 p-4 text-right"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-[11px] font-bold tabular-nums">
                      {String(idx + 1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}
                    </span>
                    <h3 className="text-sm font-bold text-navy-900 dark:text-white leading-snug">{row.topic}</h3>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? -90 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronLeft size={18} className={`flex-shrink-0 ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-navy-400 dark:text-navy-500'}`} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`cmp-panel-${row.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-navy-50 dark:border-navy-800 pt-3">
                        <MobileRow label="حقوق مسافر" value={row.passengerRight} icon={User} tint="emerald" />
                        <MobileRow label="تکالیف آژانس" value={row.agencyObligation} icon={Building2} tint="emerald" />
                        <MobileRow label="ضمانت اجرا" value={row.sanction} icon={AlertTriangle} tint="red" />
                        <MobileRow label="منبع قانونی" value={row.source} icon={Landmark} tint="navy" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileRow({
  label, value, icon: Icon, tint,
}: {
  label: string;
  value: string;
  icon: typeof User;
  tint: 'emerald' | 'red' | 'navy';
}) {
  const colors = {
    emerald: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50',
    red: 'text-red-700 dark:text-red-300 bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50',
    navy: 'text-navy-600 dark:text-navy-300 bg-navy-50/60 dark:bg-navy-800/60 border-navy-100 dark:border-navy-700',
  };
  return (
    <div className={`p-3 rounded-xl border ${colors[tint]}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className={tint === 'red' ? 'text-red-600 dark:text-red-400' : tint === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-navy-500 dark:text-navy-400'} />
        <span className="text-[11px] font-bold">{label}</span>
      </div>
      <p className="text-xs leading-relaxed">{value}</p>
    </div>
  );
}
