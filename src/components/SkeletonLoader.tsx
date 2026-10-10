import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  /** Which skeleton layout to render */
  variant?: 'cards' | 'list' | 'text' | 'stat';
  /** Number of items to render (default 3) */
  count?: number;
  className?: string;
}

/**
 * SkeletonLoader — placeholder shimmer blocks for async-loading states.
 *
 * Uses the `.skeleton` CSS class (defined in index.css) which already
 * respects dark mode via the `.dark .skeleton` override.
 *
 * Variants:
 *  - cards: card-shaped blocks (for testimonials/glossary grid)
 *  - list:  list-row blocks (for search results)
 *  - text:  paragraph lines (for body text)
 *  - stat:  compact stat block (for stats grid)
 */
export default function SkeletonLoader({
  variant = 'cards',
  count = 3,
  className = '',
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        {items.map((i) => (
          <motion.div
            key={i}
            className="skeleton h-3 rounded"
            style={{ width: `${85 - i * 12}%` }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`} aria-hidden="true">
        {items.map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800">
            <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 rounded w-1/3" />
              <div className="skeleton h-2.5 rounded w-2/3" />
            </div>
            <div className="skeleton w-12 h-6 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 ${className}`} aria-hidden="true">
        {items.map((i) => (
          <div key={i} className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="skeleton w-12 h-12 rounded-xl" />
              <div className="skeleton w-8 h-4 rounded-full" />
            </div>
            <div className="skeleton h-7 rounded w-2/3" />
            <div className="skeleton h-3 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  // cards (default)
  return (
    <div className={`grid sm:grid-cols-2 gap-3 ${className}`} aria-hidden="true">
      {items.map((i) => (
        <div key={i} className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 rounded w-1/2" />
              <div className="skeleton h-2.5 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="skeleton h-2.5 rounded w-full" />
            <div className="skeleton h-2.5 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
