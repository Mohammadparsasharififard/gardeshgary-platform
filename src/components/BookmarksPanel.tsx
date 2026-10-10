import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bookmark, Trash2, ArrowLeft, Inbox, Calendar, Download,
} from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useToast } from '@/components/Toast';
import type { LawItem } from '@/data';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLaw?: (law: LawItem) => void;
}

/**
 * BookmarksPanel — modal listing every law the user has saved.
 *
 *  - role=dialog + aria-modal + aria-label
 *  - focus-trap + Escape close (useFocusTrap)
 *  - empty state with illustration
 *  - per-item remove + clear-all + export-as-text
 *
 * Each saved item only stores a lightweight snapshot (id/title/excerpt/...),
 * so "view full law" delegates to the parent via onOpenLaw. When the parent
 * can't resolve a full LawItem from the id, we degrade gracefully by just
 * showing the saved excerpt.
 */
export default function BookmarksPanel({ isOpen, onClose, onOpenLaw }: BookmarksPanelProps) {
  const { items, count, remove, clear } = useBookmarks();
  const { showToast } = useToast();
  const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  const handleExport = () => {
    if (items.length === 0) {
      showToast('موردی برای خروجی گرفتن وجود ندارد', 'info');
      return;
    }
    const lines = items.map(
      (it, i) =>
        `${i + 1}. ${it.title}\n   ${it.article ?? ''} | ${it.code ?? ''} | ${it.category ?? ''}\n   ${it.excerpt}\n`,
    );
    const text = `فهرست قوانین ذخیره‌شده — پلتفرم ملی حقوق گردشگری\nتاریخ: ${new Date().toLocaleDateString('fa-IR')}\n${'─'.repeat(50)}\n\n${lines.join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gardeshgary-bookmarks-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('فهرست علاقه‌مندی‌ها دانلود شد', 'success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="فهرست علاقه‌مندی‌های شما"
            className="relative bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-2xl w-full max-h-[88vh] overflow-hidden flex flex-col"
            dir="rtl"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                    <Bookmark size={22} className="text-white fill-white/30" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold leading-tight">
                      علاقه‌مندی‌های شما
                    </h3>
                    <p className="text-xs text-navy-300 mt-0.5">
                      {count > 0
                        ? `${count} قانون ذخیره‌شده — در دستگاه شما نگهداری می‌شود`
                        : 'هنوز قانونی ذخیره نکرده‌اید'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="بستن فهرست علاقه‌مندی‌ها"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center mb-4">
                    <Inbox size={36} className="text-emerald-400" />
                  </div>
                  <h4 className="text-base font-bold text-navy-800 mb-1.5">فهرست علاقه‌مندی‌ها خالی است</h4>
                  <p className="text-xs text-navy-500 leading-relaxed max-w-xs">
                    با کلیک روی آیکن «ذخیره» در کنار هر قانون، آن را برای مراجعه بعدی در اینجا نگه دارید.
                    فهرست شما به‌صورت محلی روی همین دستگاه ذخیره می‌شود.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {items.map((it) => (
                    <li
                      key={String(it.id)}
                      className="group relative p-4 rounded-2xl border border-navy-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            {it.category && (
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                {it.category}
                              </span>
                            )}
                            {it.article && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                {it.article}
                              </span>
                            )}
                            {it.code && (
                              <span className="text-[10px] text-navy-400 font-mono">{it.code}</span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-navy-900 leading-snug mb-1 truncate">
                            {it.title}
                          </h4>
                          <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed">{it.excerpt}</p>
                          <div className="flex items-center gap-1 text-[10px] text-navy-400 mt-2">
                            <Calendar size={11} />
                            ذخیره‌شده در {new Date(it.savedAt).toLocaleDateString('fa-IR')}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => remove(it.id)}
                            aria-label={`حذف ${it.title}`}
                            className="p-2 rounded-lg text-navy-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          {onOpenLaw && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenLaw({
                                  id: Number(it.id) || 0,
                                  title: it.title,
                                  code: it.code ?? '',
                                  category: (it.category as LawItem['category']) ?? 'قوانین اصلی',
                                  excerpt: it.excerpt,
                                  article: it.article ?? '',
                                  relevance: 'بالا',
                                  date: new Date(it.savedAt).toLocaleDateString('fa-IR'),
                                });
                              }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                            >
                              مشاهده <ArrowLeft size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="p-4 sm:p-5 bg-navy-50/80 border-t border-navy-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={clear}
                  className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-semibold border border-navy-200 hover:border-red-200 transition-all"
                >
                  <Trash2 size={14} />
                  پاک کردن فهرست
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
                >
                  <Download size={14} />
                  خروجی متنی فهرست
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
