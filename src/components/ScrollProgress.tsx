import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Slim gradient reading-progress bar pinned to the very top of the viewport.
 * Grows right-to-left to match the RTL reading direction.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-right pointer-events-none bg-gradient-to-l from-emerald-400 via-teal-400 to-amber-400 shadow-glow"
      style={{ scaleX }}
    />
  );
}
