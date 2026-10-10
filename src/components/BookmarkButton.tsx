import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { LawItem } from '@/data';

interface BookmarkButtonProps {
  law: LawItem;
  /** Visual size variant — small (icon-only) or pill (with label) */
  size?: 'sm' | 'md' | 'pill';
  /** Override label text (defaults to "ذخیره" / "ذخیره‌شده") */
  addLabel?: string;
  removeLabel?: string;
}

/**
 * BookmarkButton — toggles a law in the user's persistent bookmarks.
 *
 * Renders an emerald "outline → filled" transition. The same shared store is
 * used by the BookmarksPanel modal so counts stay in sync everywhere.
 */
export default function BookmarkButton({
  law,
  size = 'md',
  addLabel = 'ذخیره',
  removeLabel = 'ذخیره‌شده',
}: BookmarkButtonProps) {
  const { has, toggle } = useBookmarks();
  const saved = has(law.id);

  const sizeClass =
    size === 'sm'
      ? 'p-1.5 rounded-lg'
      : size === 'pill'
        ? 'px-3 py-1.5 rounded-full text-xs font-bold gap-1.5'
        : 'px-3 py-2 rounded-xl text-sm font-semibold gap-2';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({
          id: law.id,
          title: law.title,
          excerpt: law.excerpt,
          article: law.article,
          category: law.category,
          code: law.code,
        });
      }}
      aria-pressed={saved}
      aria-label={saved ? `حذف ${law.title} از علاقه‌مندی‌ها` : `افزودن ${law.title} به علاقه‌مندی‌ها`}
      className={`relative inline-flex items-center justify-center transition-all duration-200 border ${
        saved
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
          : 'bg-white text-navy-600 border-navy-200 hover:border-emerald-300 hover:text-emerald-600'
      } ${sizeClass}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {saved ? (
          <motion.span
            key="on"
            initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="flex items-center gap-1.5"
          >
            <BookmarkCheck size={size === 'sm' ? 14 : 16} className="fill-emerald-500" />
            {size !== 'sm' && <span>{removeLabel}</span>}
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="flex items-center gap-1.5"
          >
            <Bookmark size={size === 'sm' ? 14 : 16} />
            {size !== 'sm' && <span>{addLabel}</span>}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
