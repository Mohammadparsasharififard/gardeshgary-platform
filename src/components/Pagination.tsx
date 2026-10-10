import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Number of pages to show around the current page (default 1) */
  siblingCount?: number;
  /** Label shown before the buttons (default: "صفحه") */
  pageLabel?: string;
  /** Total items count, shown as a hint */
  totalItems?: number;
  itemsPerPage?: number;
}

/**
 * Pagination — RTL-aware pagination control.
 *
 *  - In RTL, "previous" is to the RIGHT (ChevronRight icon) and "next" is to
 *    the LEFT (ChevronLeft icon) — matching the reading direction.
 *  - Sibling pages are shown around the current page; ellipsis (…) for gaps.
 *  - Keyboard accessible (real <button>s), aria-current on the active page.
 *  - Returns null when totalPages <= 1 (no pagination needed).
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  pageLabel = 'صفحه',
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  // Compute the page numbers to render (with ellipsis slots represented as -1)
  const pages = useMemo<(number | -1)[]>(() => {
    if (totalPages <= 1) return [];

    const range: (number | -1)[] = [];
    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);

    // Always include page 1
    range.push(1);

    // Left ellipsis?
    if (start > 2) range.push(-1);

    // Middle pages
    for (let p = start; p <= end; p++) range.push(p);

    // Right ellipsis?
    if (end < totalPages - 1) range.push(-1);

    // Always include last page
    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages, p));
    if (clamped !== currentPage) onPageChange(clamped);
  };

  // RTL note: ChevronRight visually means "go back" (right→left reading),
  // ChevronLeft means "go forward".
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 mt-6"
      aria-label="صفحه‌بندی"
      dir="rtl"
    >
      {/* Previous (RTL: points right) */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="صفحه قبلی"
        className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <ChevronRight size={16} />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) => {
          if (p === -1) {
            return (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-navy-400 dark:text-navy-500"
                aria-hidden="true"
              >
                <MoreHorizontal size={16} />
              </span>
            );
          }
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => goTo(p)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${pageLabel} ${p.toLocaleString('fa-IR')}`}
              className={`relative w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center tabular-nums ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-glow border border-emerald-500'
                  : 'bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              {p.toLocaleString('fa-IR')}
              {isActive && (
                <motion.span
                  layoutId="pagination-active"
                  className="absolute inset-0 rounded-xl ring-2 ring-emerald-400/40 pointer-events-none"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Next (RTL: points left) */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="صفحه بعدی"
        className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Items hint */}
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <p className="text-[11px] text-navy-400 dark:text-navy-500 mr-3 tabular-nums">
          {((currentPage - 1) * itemsPerPage + 1).toLocaleString('fa-IR')}–
          {Math.min(currentPage * itemsPerPage, totalItems).toLocaleString('fa-IR')} از{' '}
          {totalItems.toLocaleString('fa-IR')}
        </p>
      )}
    </nav>
  );
}
