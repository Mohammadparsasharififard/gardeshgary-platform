import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, ChevronLeft, X } from 'lucide-react';

export interface SearchResultItem {
  id: string | number;
  title: string;
  excerpt: string;
  meta?: string;
  href?: string;
}

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  onSelect?: (item: SearchResultItem) => void;
  onClear?: () => void;
  emptyMessage?: string;
  /** Highlight matches in title/excerpt (default true) */
  highlight?: boolean;
}

/**
 * SearchResults — a results list that highlights the query term inside each
 * result's title and excerpt.
 *
 *  - Highlights use <mark> with the global `.legal-mark` style (emerald underline)
 *  - AnimatePresence popLayout for smooth enter/exit
 *  - Empty state with Search icon
 *  - Clear button to reset the query
 */
export default function SearchResults({
  query,
  results,
  onSelect,
  onClear,
  emptyMessage = 'نتیجه‌ای یافت نشد.',
  highlight = true,
}: SearchResultsProps) {
  const hasQuery = query.trim().length > 0;
  const isEmpty = hasQuery && results.length === 0;

  // Split text into segments around the (case-insensitive) query match so we
  // can wrap matches in <mark>. Returns the original string if no match.
  function renderHighlighted(text: string): React.ReactNode {
    if (!highlight || !hasQuery) return text;
    const q = query.trim();
    if (!q) return text;
    const lower = text.toLowerCase();
    const ql = q.toLowerCase();
    const segments: React.ReactNode[] = [];
    let i = 0;
    let key = 0;
    while (i < text.length) {
      const idx = lower.indexOf(ql, i);
      if (idx === -1) {
        segments.push(text.slice(i));
        break;
      }
      if (idx > i) segments.push(text.slice(i, idx));
      segments.push(<mark key={key++} className="legal-mark">{text.slice(idx, idx + q.length)}</mark>);
      i = idx + q.length;
    }
    return segments;
  }

  return (
    <div className="space-y-2">
      {/* Results header */}
      {hasQuery && (
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] text-navy-500 dark:text-navy-400 tabular-nums">
            {results.length.toLocaleString('fa-IR')} نتیجه برای «{query}»
          </p>
          {onClear && (
            <button
              onClick={onClear}
              className="text-[11px] text-navy-400 dark:text-navy-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <X size={12} />
              پاک کردن
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {isEmpty ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 text-sm text-navy-400 dark:text-navy-500 bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-navy-200 dark:border-navy-700"
          >
            <Search size={32} className="text-navy-300 dark:text-navy-600 mx-auto mb-2.5" />
            {emptyMessage}
          </motion.div>
        ) : (
          results.map((item, idx) => (
            <motion.button
              key={String(item.id)}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.18, delay: Math.min(idx * 0.03, 0.3) }}
              onClick={() => onSelect?.(item)}
              className="group w-full flex items-start gap-3 p-3.5 rounded-2xl border border-navy-100 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-card transition-all text-right"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-navy-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors leading-snug">
                  {renderHighlighted(item.title)}
                </h4>
                <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {renderHighlighted(item.excerpt)}
                </p>
                {item.meta && (
                  <p className="text-[10px] text-navy-400 dark:text-navy-500 mt-1.5 tabular-nums">
                    {item.meta}
                  </p>
                )}
              </div>
              <ChevronLeft size={16} className="flex-shrink-0 text-navy-300 dark:text-navy-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-x-1 transition-all mt-1" />
            </motion.button>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
