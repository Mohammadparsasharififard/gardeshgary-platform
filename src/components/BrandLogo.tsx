// Official brand logo for «حقوق گردشگری» platform.
//
// Uses the real logo image (public/logo.png) — a circular emblem with:
//   - Scales of justice (center)
//   - Open book (base)
//   - Globe (background)
//   - Airplane + flight arc
//   - Laurel branch
//   - Text «حقوق گردشگری»
//
// The image is served from /gardeshgary/logo.png in production (same-origin
// with the iframe). In dev, the Vite proxy serves it from /gardeshgary/logo.png.
//
// For dark mode, we add a subtle circular background so the white-bg logo
// blends with the dark header.

interface BrandLogoProps {
  /** Square pixel size of the logo. Default 48. */
  size?: number;
  /** Show the title text next to the emblem. Default false (we use the image which has text). */
  withText?: boolean;
  /** Override the dark-mode detection (force light/dark). */
  variant?: 'auto' | 'light' | 'dark';
  className?: string;
}

export function BrandLogo({
  size = 48,
  withText = false,
  variant = 'auto',
  className = '',
}: BrandLogoProps) {
  return (
    <div
      className={`brand-logo inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        // In dark mode, add a subtle cream background so the white-bg logo
        // is visible. In light mode, the logo blends with the white header.
        background: 'var(--brand-logo-bg, transparent)',
        flexShrink: 0,
      }}
      aria-label="لوگوی رسمی پلتفرم ملی حقوق گردشگری"
      role="img"
    >
      <img
        src="/gardeshgary/logo.png"
        alt="لوگوی پلتفرم ملی حقوق گردشگری"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        // Prevent layout shift while loading
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export default BrandLogo;
