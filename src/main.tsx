import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from '@/components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Register the service worker for PWA offline support.
// Only in production builds (dev uses Vite HMR which doesn't play well with SW).
// The build sets `base: '/gardeshgary/'`, so the SW lives next to index.html —
// we register using a relative path so it works in the iframe context too.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Resolve relative to the current document URL (gardeshgary/index.html → ./sw.js)
    const swUrl = new URL('./sw.js', window.location.href).href;
    navigator.serviceWorker
      .register(swUrl)
      .catch((err) => {
        // Silent failure — the app still works online without SW
        if (import.meta.env.DEV) console.warn('SW registration failed:', err);
      });
  });
}
