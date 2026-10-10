import { motion } from 'framer-motion';

/**
 * SkipToContent — accessibility "skip link" that becomes visible when focused
 * via keyboard (Tab key on page load). Pressing Enter jumps focus to the main
 * content landmark so screen-reader & keyboard users can bypass the long
 * header nav.
 *
 * Implemented as the very first focusable element in the document, styled to
 * be invisible until :focus-visible, in line with WCAG 2.4.1 (Bypass Blocks).
 */
export default function SkipToContent() {
  return (
    <motion.a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[120] focus:px-4 focus:py-2.5 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-glow focus:text-sm focus:font-bold focus:outline-none"
      initial={false}
    >
      پرش به محتوای اصلی
    </motion.a>
  );
}
