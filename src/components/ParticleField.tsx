import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

/**
 * Lightweight particle canvas.
 *
 * Performance optimizations:
 * - Uses IntersectionObserver to pause the rAF loop when the canvas is off-screen
 *  - Respects `prefers-reduced-motion` (no animation, just static dots)
 *  - Connection lines are skipped entirely (was the O(n²) hot path)
 *  - Cap device pixel ratio at 1.5 so retina screens don't burn 4× fillRate
 *  - Throttles resize to once per 200ms
 */
export default function ParticleField({ density = 30, className = '' }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationId: number | null = null;
    let particles: Particle[] = [];
    let running = false;
    let lastResize = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          hue: Math.random() > 0.5 ? 160 : 40,
        });
      }
    };

    const drawFrame = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${p.opacity})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(drawFrame);
    };

    const drawStatic = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${p.opacity})`;
        ctx.fill();
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      if (prefersReduced) {
        drawStatic();
      } else {
        animationId = requestAnimationFrame(drawFrame);
      }
    };

    const stop = () => {
      running = false;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const handleResize = () => {
      const now = Date.now();
      if (now - lastResize < 200) return;
      lastResize = now;
      resize();
      initParticles();
      if (prefersReduced) drawStatic();
    };

    resize();
    initParticles();
    start();

    // Pause when the hero scrolls out of view — saves main-thread time on sub-pages
    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) start();
            else stop();
          }
        },
        { threshold: 0.01 }
      );
      io.observe(canvas);
    }

    // Pause when the tab is hidden — saves battery and CPU
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (io === null || canvas.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibility);
      io?.disconnect();
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`particle-canvas ${className}`} aria-hidden="true" />;
}
