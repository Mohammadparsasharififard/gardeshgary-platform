// Service Worker for پلتفرم ملی حقوق گردشگری
// Strategy:
//  - Precache the app shell on install (offline-first)
//  - Cache-first for static assets (JS/CSS/fonts/images) with network fallback
//  - Stale-while-revalidate for navigation requests (HTML) so users get cached
//    content instantly while we update in the background
//  - Network-only for everything else (API calls, etc.)
//
// Important: this SW is registered with a path relative to /gardeshgary/, so
// all cache keys must also be relative to /gardeshgary/. We resolve them
// against the SW's own scope (self.registration.scope) to keep things working
// inside the Next.js iframe proxy as well as standalone.

// v3: 2FA enrollment flow in AuthModal + honest network-vs-logic error
// mapping (rebuild with new asset hashes — old caches must be dropped).
const CACHE_VERSION = 'gardeshgary-v3';
const SCOPE = self.registration.scope; // e.g. https://host/gardeshgary/
const SHELL_RELS = ['./', './index.html', './favicon.svg', './og-image.png'];
const APP_SHELL = SHELL_RELS.map((r) => new URL(r, SCOPE).href);

const STATIC_ASSET_RE = /\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|gif|webp|ico)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // addAll tolerates 404s by using individual cache.add calls
      .then(async (cache) => {
        await Promise.allSettled(APP_SHELL.map((u) => cache.add(u)));
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin requests (e.g. Vite HMR in dev)
  if (url.origin !== self.location.origin) return;

  // Skip Vite dev-specific paths
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/node_modules/.vite/')) return;

  // Skip requests outside the SW scope (e.g. Next.js _next assets)
  if (!url.pathname.startsWith(new URL(SCOPE).pathname)) return;

  // Navigation requests (HTML page loads) → stale-while-revalidate
  if (request.mode === 'navigate') {
    const shellUrl = new URL('./index.html', SCOPE).href;
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(shellUrl);
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(shellUrl, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // Static assets → cache-first with network fallback
  if (STATIC_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          // Revalidate in background
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
            })
            .catch(() => {});
          return cached;
        }
        try {
          const response = await fetch(request);
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return new Response('', { status: 504 });
        }
      }),
    );
    return;
  }

  // Default: try network, fall back to cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request)),
  );
});
