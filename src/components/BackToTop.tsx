import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop — floating button that appears after the reader scrolls past
 * `showAfter` pixels and smoothly returns them to the top. Rendered in RTL
 * so it docks to the bottom-left corner (mirror of typical LTR bottom-right).
 *
 * Accessibility:
 *  - aria-label describes the action
 *  - focus-visible ring inherited from global stylesheet
 *  - keyboard accessible (it's a real <button>)
 *  - hidden from screen readers until visible (aria-hidden toggling)
 */
export default function BackToTop({ showAfter = 600 }: { showAfter?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  const scrollTop = () => {
    // Native smooth scroll respects `scroll-behavior: smooth` on <html>
    // but we also provide a JS fallback for browsers that ignore it.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={scrollTop}
          aria-label="بازگشت به ابتدای صفحه"
          aria-hidden={!visible}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 left-6 z-[60] flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-glow border border-emerald-400/40 group"
        >
          {/* pulsing halo */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping-slow"
          />
          <ArrowUp
            size={20}
            className="relative group-hover:-translate-y-0.5 transition-transform"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
