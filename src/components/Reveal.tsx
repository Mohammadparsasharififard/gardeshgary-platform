import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Advanced reveal: opacity + 3D transform + blur de-focus
// All GPU-accelerated (transform/opacity/filter only, no layout shift)
const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface RevealProps {
  children: ReactNode;
  /** stagger delay in seconds */
  delay?: number;
  className?: string;
  id?: string;
  /** Optional: directional variant (default = up) */
  direction?: 'up' | 'left' | 'right' | 'scale';
}

const directionOffsets = {
  up: { x: 0, y: 30 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  scale: { x: 0, y: 0 },
};

/**
 * Scroll-reveal wrapper: sophisticated entrance animation with:
 *  - GPU-accelerated transform (translate3d + scale) — no layout shift
 *  - De-blur effect (filter: blur) for cinematic depth
 *  - Directional variants (up/left/right/scale)
 *  - Once-only (no re-trigger on scroll-back)
 *  - Stagger delay support for sequential reveals
 *
 * Performance: uses only `transform` and `opacity` which are composited on
 * the GPU, so it never triggers reflow/paint.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  id,
  direction = 'up',
}: RevealProps) {
  const offset = directionOffsets[direction];
  const dirVariants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      scale: direction === 'scale' ? 0.9 : 0.97,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      id={id}
      className={className}
      variants={dirVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05, margin: '0px 0px -60px 0px' }}
      // Performance hint: tell the browser what will change
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  );
}
