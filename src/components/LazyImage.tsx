import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  /** Optional low-quality placeholder (blur-up). When omitted, a shimmer skeleton is shown. */
  placeholderSrc?: string;
  /** Aspect ratio as 'w/h' (e.g. '16/9', '1/1'). Defaults to natural. */
  aspectRatio?: string;
  /** Tailwind class for the wrapper (e.g. 'rounded-xl') */
  className?: string;
  /** Width/height to reserve (avoids CLS) */
  width?: number;
  height?: number;
  /** Loading strategy (default: 'lazy') */
  loading?: 'lazy' | 'eager';
  /** Decoding hint (default: 'async') */
  decoding?: 'async' | 'sync' | 'auto';
  /** Called when the image finishes loading */
  onLoad?: () => void;
  /** Called when the image fails to load */
  onError?: () => void;
}

/**
 * LazyImage — a drop-in <img> replacement that:
 *  - defers loading until the element is close to the viewport (IntersectionObserver)
 *  - shows a shimmer skeleton placeholder while loading
 *  - supports blur-up via an optional `placeholderSrc`
 *  - reserves space via width/height or aspectRatio to avoid layout shift (CLS)
 *  - fades in the final image on load
 *  - reports errors with a fallback icon
 *
 * When `loading="eager"` is set, the image loads immediately (use for above-the-fold
 * hero images).
 */
export default function LazyImage({
  src,
  alt,
  placeholderSrc,
  aspectRatio,
  className = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
}: LazyImageProps) {
  const [inView, setInView] = useState(loading === 'eager');
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Observe intersection to trigger lazy load
  useEffect(() => {
    if (loading === 'eager') {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' }, // start loading ~200px before visible
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loading]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setErrored(true);
    onError?.();
  }, [onError]);

  const style: React.CSSProperties = {
    aspectRatio,
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-navy-50 dark:bg-navy-800 ${className}`}
      style={style}
    >
      {/* Shimmer skeleton until loaded */}
      <AnimatePresence>
        {!loaded && !errored && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 skeleton"
          />
        )}
      </AnimatePresence>

      {/* Error fallback */}
      {errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-navy-300 dark:text-navy-600 gap-1.5">
          <ImageIcon size={24} />
          <span className="text-[10px]">تصویر بارگذاری نشد</span>
        </div>
      )}

      {/* Blur-up placeholder */}
      {placeholderSrc && inView && !errored && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100 blur-md scale-105'
          }`}
        />
      )}

      {/* Real image — only renders when in view */}
      {inView && !errored && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.04 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
