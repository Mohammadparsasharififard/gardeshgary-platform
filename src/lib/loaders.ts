/**
 * Async data loader for the Gardeshgary frontend.
 *
 * Strategy:
 *   - Components continue to import static data from `@/data` for immediate
 *     render (good for first paint).
 *   - On mount, components can call these loaders to refresh the data from
 *     the backend API. If the API is unreachable, the static fallback is kept.
 *   - This way the UI never breaks, even if the backend is down.
 */
import { apiClient, type Law, type Lawyer, type RightsGuide, type Claim, type Booking, type Notification, type AdminStat, type AdminActivity, type NewsItem, type ArticleItem } from './api';

// ─── In-memory cache + loaders ────────────────────────────────────────────
type LoadResult<T> = { data: T | null; error: string | null };

async function safeLoad<T>(fn: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'خطای ناشناخته';
    return { data: null, error: msg };
  }
}

// ─── Shared bulk-laws cache (dedupes simultaneous mount fetches) ───────────
const BULK_LAWS_TTL_MS = 60_000;
let bulkLawsPromise: Promise<LoadResult<Law[]>> | null = null;
let bulkLawsAt = 0;

function loadBulkLaws(): Promise<LoadResult<Law[]>> {
  const now = Date.now();
  if (bulkLawsPromise && now - bulkLawsAt < BULK_LAWS_TTL_MS) {
    return bulkLawsPromise;
  }
  bulkLawsAt = now;
  bulkLawsPromise = safeLoad(() => apiClient.listLaws({ limit: 100 }).then((r) => r.laws));
  // Clear the cached promise on failure so a retry gets a fresh attempt.
  bulkLawsPromise.catch(() => {
    if (bulkLawsAt && Date.now() - bulkLawsAt >= BULK_LAWS_TTL_MS) return;
    bulkLawsPromise = null;
  });
  return bulkLawsPromise;
}

export const dataLoaders = {
  // Laws — bulk requests (no q/category) share ONE in-flight request + a
  // 60s cache. Previously Hero fetched ?limit=50 and SmartGuide fetched
  // ?limit=100 simultaneously on mount (duplicate network calls). Now both
  // reuse the same 100-item superset — Hero slices what it needs.
  async loadLaws(params?: { q?: string; category?: string; limit?: number }) {
    const isBulk = !params?.q && !params?.category;
    if (isBulk) return loadBulkLaws();
    return safeLoad(() => apiClient.listLaws(params).then((r) => r.laws));
  },

  // Lawyers
  async loadLawyers(params?: { q?: string; city?: string; verified?: boolean }) {
    return safeLoad(() => apiClient.listLawyers(params).then((r) => r.lawyers));
  },

  // Rights guides
  async loadRightsGuides(target?: 'TOURIST' | 'BUSINESS' | 'SPORTS') {
    return safeLoad(() => apiClient.listRightsGuides(target).then((r) => r.guides));
  },

  // News (public feed)
  async loadNews(params?: { q?: string; category?: string; limit?: number; offset?: number }) {
    return safeLoad(() => apiClient.listNews(params).then((r) => r.news));
  },

  // Articles (public feed)
  async loadArticles(params?: { q?: string; category?: string; limit?: number; offset?: number }) {
    return safeLoad(() => apiClient.listArticles(params).then((r) => r.articles));
  },

  // Claims
  async loadClaims(status?: string) {
    return safeLoad(() => apiClient.listClaims(status).then((r) => r.claims));
  },

  async createClaim(data: { title: string; type: string; description?: string; amount?: string }) {
    return safeLoad(() => apiClient.createClaim(data));
  },

  // Bookings
  async loadBookings(status?: string) {
    return safeLoad(() => apiClient.listBookings(status).then((r) => r.bookings));
  },

  async createBooking(data: {
    lawyerId: string;
    topic: string;
    description?: string;
    scheduledAt: string;
    durationMin: number;
    type: 'IN_PERSON' | 'PHONE' | 'VIDEO';
  }) {
    return safeLoad(() => apiClient.createBooking(data));
  },

  // Notifications
  async loadNotifications(onlyUnread = false) {
    return safeLoad(() => apiClient.listNotifications(onlyUnread));
  },

  async markNotificationRead(id: string) {
    return safeLoad(() => apiClient.markNotificationRead(id));
  },

  // Bookmarks
  async loadBookmarks() {
    return safeLoad(() => apiClient.listBookmarks().then((r) => r.bookmarks));
  },

  async toggleBookmark(lawId: number) {
    return safeLoad(() => apiClient.toggleBookmark(lawId));
  },

  // Contact
  async submitContact(data: {
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    consultationType?: string;
    preferredTime?: string;
  }) {
    return safeLoad(() => apiClient.submitContact(data));
  },

  // Newsletter subscribe (write — never cached). Hits the public endpoint
  // /api/newsletter/subscribe which rate-limits by IP.
  async subscribeNewsletter(email: string) {
    return safeLoad(async () => {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data && data.error) || `خطای سرور (${res.status})`);
      }
      return data as { ok: true; email: string; message: string };
    });
  },

  // AI
  async aiChat(query: string) {
    return safeLoad(() => apiClient.aiChat(query));
  },

  // Admin
  async loadAdminStats() {
    return safeLoad(() => apiClient.adminStats().then((r) => r.stats));
  },

  async loadAdminActivities() {
    return safeLoad(() => apiClient.adminActivities().then((r) => r.activities));
  },

  async updateClaimStatus(id: string, status: string, note?: string) {
    return safeLoad(() => apiClient.updateClaimStatus(id, status, note));
  },

  async updateBookingStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
    return safeLoad(() => apiClient.updateBookingStatus(id, status));
  },
};

// Re-export types for convenience
export type {
  Law,
  Lawyer,
  RightsGuide,
  Claim,
  Booking,
  Notification,
  AdminStat,
  AdminActivity,
  NewsItem,
  ArticleItem,
};
