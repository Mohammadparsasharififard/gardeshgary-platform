import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Bookmark, ArrowUp, Moon, HelpCircle, Type, Keyboard,
} from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface ShortcutItem {
  keys: string[];
  description: string;
  icon: typeof Search;
  group: 'ناوبری' | 'ابزارها' | 'نمایش';
}

const SHORTCUTS: ShortcutItem[] = [
  // Navigation
  { keys: ['Ctrl', 'K'], description: 'باز کردن جستجوی هوشمند سراسری', icon: Search, group: 'ناوبری' },
  { keys: ['Home'], description: 'بازگشت به ابتدای صفحه', icon: ArrowUp, group: 'ناوبری' },
  { keys: ['End'], description: 'پرش به انتهای صفحه', icon: ArrowUp, group: 'ناوبری' },
  { keys: ['Escape'], description: 'بستن مودال/پنل باز', icon: X, group: 'ناوبری' },

  // Tools
  { keys: ['B'], description: 'باز کردن فهرست علاقه‌مندی‌ها', icon: Bookmark, group: 'ابزارها' },
  { keys: ['?'], description: 'باز کردن این راهنمای میانبرها', icon: HelpCircle, group: 'ابزارها' },

  // Display
  { keys: ['T'], description: 'تغییر حالت روشن/تاریک', icon: Moon, group: 'نمایش' },
  { keys: ['F'], description: 'تغییر اندازه متن', icon: Type, group: 'نمایش' },
];

const GROUPS: ShortcutItem['group'][] = ['ناوبری', 'ابزارها', 'نمایش'];

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSearch?: () => void;
  onTriggerBookmarks?: () => void;
  onTriggerTheme?: () => void;
  onTriggerFontSize?: () => void;
}

/**
 * KeyboardShortcutsHelp — a discoverable modal listing all the platform's
 * keyboard shortcuts. Triggered by pressing `?` (Shift+/) globally.
 *
 *  - role=dialog + aria-modal + focus-trap + Escape close
 *  - grouped by category (navigation / tools / display)
 *  - kbd chips rendered with the global `.kbd` CSS class
 *  - each shortcut can be invoked from within the dialog by clicking the row
 *    (when an `onTrigger*` callback is provided)
 */
export default function KeyboardShortcutsHelp({
  isOpen,
  onClose,
  onTriggerSearch,
  onTriggerBookmarks,
  onTriggerTheme,
  onTriggerFontSize,
}: KeyboardShortcutsHelpProps) {
  const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  const handleRowClick = useCallback(
    (item: ShortcutItem) => {
      if (item.keys.join('') === 'CtrlK') {
        if (onTriggerSearch) {
          onClose();
          onTriggerSearch();
        }
      } else if (item.keys[0] === 'B') {
        if (onTriggerBookmarks) {
          onClose();
          onTriggerBookmarks();
        }
      } else if (item.keys[0] === 'T') {
        if (onTriggerTheme) {
          onClose();
          onTriggerTheme();
        }
      } else if (item.keys[0] === 'F') {
        if (onTriggerFontSize) {
          onClose();
          onTriggerFontSize();
        }
      }
    },
    [onClose, onTriggerSearch, onTriggerBookmarks, onTriggerTheme, onTriggerFontSize],
  );

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
            aria-label="راهنمای میانبرهای صفحه‌کلید"
            className="relative bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-navy-100 dark:border-navy-700 max-w-2xl w-full max-h-[88vh] overflow-hidden flex flex-col"
            dir="rtl"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                    <Keyboard size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold leading-tight">
                      راهنمای میانبرهای صفحه‌کلید
                    </h3>
                    <p className="text-xs text-navy-300 mt-0.5">
                      برای کاربران حرفه‌ای و دسترسی‌پذیری بهتر
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="بستن راهنما"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {GROUPS.map((group) => {
                const items = SHORTCUTS.filter((s) => s.group === group);
                return (
                  <div key={group} className="mb-5 last:mb-0">
                    <h4 className="text-xs font-bold text-navy-700 dark:text-navy-200 mb-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {group}
                    </h4>
                    <ul className="space-y-1.5">
                      {items.map((item) => {
                        const Icon = item.icon;
                        const hasAction =
                          item.keys.join('') === 'CtrlK' ||
                          item.keys[0] === 'B' ||
                          item.keys[0] === 'T' ||
                          item.keys[0] === 'F';
                        return (
                          <li key={item.keys.join('+')}>
                            <button
                              type="button"
                              onClick={() => hasAction && handleRowClick(item)}
                              disabled={!hasAction}
                              className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl transition-colors ${
                                hasAction
                                  ? 'hover:bg-emerald-50/60 dark:hover:bg-navy-800 cursor-pointer text-right'
                                  : 'cursor-default text-right'
                              }`}
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-navy-50 dark:bg-navy-800 text-navy-500 dark:text-navy-300 flex items-center justify-center">
                                  <Icon size={14} />
                                </span>
                                <span className="text-xs sm:text-sm text-navy-700 dark:text-navy-200 font-medium leading-snug truncate">
                                  {item.description}
                                </span>
                              </span>
                              <span className="flex items-center gap-1 flex-shrink-0">
                                {item.keys.map((k) => (
                                  <kbd key={k} className="kbd kbd-dark">
                                    {k}
                                  </kbd>
                                ))}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              <div className="mt-4 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed flex items-start gap-2">
                <HelpCircle size={13} className="flex-shrink-0 mt-0.5" />
                <span>
                  این میانبرها روی صفحه‌کلید انگلیسی فعال هستند. اگر در فیلد متنی تایپ می‌کنید،
                  میانبرها موقتاً غیرفعال می‌شوند تا با تایپ شما تداخل نداشته باشد.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-navy-50/80 dark:bg-navy-950/40 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between gap-3">
              <p className="text-[11px] text-navy-500 dark:text-navy-400 flex items-center gap-1.5">
                <kbd className="kbd">Esc</kbd>
                برای بستن
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow transition-all"
              >
                متوجه شدم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export { SHORTCUTS };
