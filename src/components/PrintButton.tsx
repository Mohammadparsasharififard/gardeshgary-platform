import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Check } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface PrintButtonProps {
  /** Title shown in the toast before printing (default: "آماده‌سازی برای چاپ…") */
  preparingLabel?: string;
  /** Tailwind position classes; defaults to a position near the calculator */
  className?: string;
  /** Optional selector scope: when set, only that subtree is printed (experimental, see implementation) */
  scope?: string;
}

/**
 * PrintButton — triggers window.print() with a brief "preparing" toast so the
 * user understands the print dialog is about to open. Uses the global print
 * stylesheet (already defined in index.css) which hides nav/hero/footer/etc.
 *
 * The button is keyboard-accessible and includes a focus ring via the global
 * :focus-visible rule. After click, a 500ms grace period lets any pending
 * state settle before the print dialog appears.
 */
export default function PrintButton({
  preparingLabel = 'در حال آماده‌سازی نسخه چاپ…',
  className = '',
  scope,
}: PrintButtonProps) {
  const { showToast } = useToast();
  const [preparing, setPreparing] = useState(false);

  // Reset the preparing flag after the print dialog should have opened
  useEffect(() => {
    if (!preparing) return;
    const t = setTimeout(() => {
      window.print();
      setPreparing(false);
    }, 450);
    return () => clearTimeout(t);
  }, [preparing]);

  const handlePrint = () => {
    showToast(preparingLabel, 'info');
    setPreparing(true);
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      disabled={preparing}
      aria-label="چاپ این صفحه"
      className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 disabled:opacity-60 ${
        preparing
          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
          : 'bg-white text-navy-700 border-navy-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/40'
      } ${className}`}
      data-print-scope={scope}
    >
      <AnimatePresence mode="wait" initial={false}>
        {preparing ? (
          <motion.span
            key="prep"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Check size={14} className="text-emerald-600" />
            آماده
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Printer size={14} />
            چاپ
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
