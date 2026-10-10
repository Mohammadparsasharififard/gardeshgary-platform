// API client utility for the Gardeshgary frontend.
//
// All requests go to the Next.js API routes (same origin). The JWT token is
// stored in localStorage (set by the login flow) and sent as a Bearer header.

const TOKEN_KEY = 'gardeshgary.auth.token.v1';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string> | undefined) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (res.status === 401) {
    setToken(null);
    throw new ApiError('احراز هویت نشده یا نشست منقضی شده', 401);
  }

  let data: unknown = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  }
  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && String((data as { error: unknown }).error)) ||
      `خطای سرور (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Thrown by `loginWithPassword` when the account is protected by a MANDATORY
 * 2FA policy: the server answers 200 with `{twoFactorRequired, mustEnroll,
 * preTwoFactorToken}` instead of `{user, token}`. Blindly destructuring that
 * response used to throw a TypeError which the modal's catch misreported as
 * a network outage («ارتباط با سرور برقرار نشد») even though the login had
 * SUCCEEDED server-side. This typed error carries the pre-2FA token the UI
 * needs to run the enrollment (or TOTP-challenge) flow end-to-end.
 */
export class TwoFactorRequiredError extends ApiError {
  preTwoFactorToken: string;
  mustEnroll: boolean;
  constructor(message: string, preTwoFactorToken: string, mustEnroll: boolean) {
    super(message, 423);
    this.name = 'TwoFactorRequiredError';
    this.preTwoFactorToken = preTwoFactorToken;
    this.mustEnroll = mustEnroll;
  }
}

/** Raw login response — either a full session or a mandatory-2FA handshake. */
export type LoginResponse =
  | { user: AuthUser; token: string }
  | { twoFactorRequired: true; mustEnroll?: true; preTwoFactorToken: string; message: string };

// ─── API endpoints ────────────────────────────────────────────────────────
export const apiClient = {
  // Auth
  login: (username: string, password: string) =>
    api<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  // Stage a TOTP secret for mandatory enrollment. With a pre-2FA token this
  // is only allowed for accounts whose policy REQUIRES 2FA and don't have it
  // enabled yet (the server rejects everyone else — by design).
  twoFactorSetup: (preTwoFactorToken?: string) =>
    api<{ secret: string; otpauthUri: string; backupCodes: string[]; message: string }>(
      '/api/auth/2fa/setup',
      {
        method: 'POST',
        body: JSON.stringify(preTwoFactorToken ? { preTwoFactorToken } : {}),
      },
    ),
  // Mode A/B: confirm a TOTP (or backup) code with a pre-2FA token → returns
  // the FULL session ({user, token}) and, for a staged enrollment, flips 2FA
  // on in the same step. (Mode C — confirming while already logged in — is
  // handled by the admin panel, not this SPA.)
  twoFactorVerify: (code: string, preTwoFactorToken?: string) =>
    api<{ user: AuthUser; token: string; ok?: boolean }>('/api/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code, ...(preTwoFactorToken ? { preTwoFactorToken } : {}) }),
    }),
  sendOtp: (mobile: string) =>
    api<{ message: string; devCode?: string }>('/api/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    }),
  verifyOtp: (mobile: string, code: string, name?: string) =>
    api<{ user: AuthUser; token: string }>('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ mobile, code, name }),
    }),
  me: () => api<{ user: AuthUser }>('/api/auth/me'),
  logout: () => api<{ ok: true }>('/api/auth/logout', { method: 'POST' }),

  // Laws
  listLaws: (params?: { q?: string; category?: string; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.category) sp.set('category', params.category);
    if (params?.limit) sp.set('limit', String(params.limit));
    return api<{ laws: Law[]; total: number }>(`/api/laws${sp.toString() ? `?${sp}` : ''}`);
  },
  getLaw: (id: number) => api<{ law: Law }>(`/api/laws/${id}`),
  createLaw: (data: Partial<Law>) =>
    api<{ law: Law }>('/api/laws', { method: 'POST', body: JSON.stringify(data) }),
  updateLaw: (id: number, data: Partial<Law>) =>
    api<{ law: Law }>(`/api/laws/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLaw: (id: number) =>
    api<{ ok: true }>(`/api/laws/${id}`, { method: 'DELETE' }),

  // Rights guides
  listRightsGuides: (target?: 'TOURIST' | 'BUSINESS' | 'SPORTS') => {
    const sp = new URLSearchParams();
    if (target) sp.set('target', target);
    return api<{ guides: RightsGuide[]; total: number }>(`/api/rights-guides${sp.toString() ? `?${sp}` : ''}`);
  },

  // Lawyers
  listLawyers: (params?: { q?: string; city?: string; verified?: boolean }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.city) sp.set('city', params.city);
    if (params?.verified) sp.set('verified', 'true');
    return api<{ lawyers: Lawyer[]; total: number }>(`/api/lawyers${sp.toString() ? `?${sp}` : ''}`);
  },
  getLawyer: (id: string) => api<{ lawyer: Lawyer }>(`/api/lawyers/${id}`),
  createLawyer: (data: Partial<Lawyer>) =>
    api<{ lawyer: Lawyer }>('/api/lawyers', { method: 'POST', body: JSON.stringify(data) }),
  updateLawyer: (id: string, data: Partial<Lawyer>) =>
    api<{ lawyer: Lawyer }>(`/api/lawyers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLawyer: (id: string) =>
    api<{ ok: true }>(`/api/lawyers/${id}`, { method: 'DELETE' }),

  // Claims
  listClaims: (status?: string) => {
    const sp = new URLSearchParams();
    if (status) sp.set('status', status);
    return api<{ claims: Claim[]; total: number }>(`/api/claims${sp.toString() ? `?${sp}` : ''}`);
  },
  getClaim: (id: string) => api<{ claim: Claim }>(`/api/claims/${id}`),
  createClaim: (data: { title: string; type: string; description?: string; amount?: string }) =>
    api<{ claim: Claim }>('/api/claims', { method: 'POST', body: JSON.stringify(data) }),
  updateClaimStatus: (id: string, status: string, note?: string) =>
    api<{ claim: Claim }>(`/api/claims/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  // Bookings
  listBookings: (status?: string) => {
    const sp = new URLSearchParams();
    if (status) sp.set('status', status);
    return api<{ bookings: Booking[]; total: number }>(`/api/bookings${sp.toString() ? `?${sp}` : ''}`);
  },
  createBooking: (data: {
    lawyerId: string;
    topic: string;
    description?: string;
    scheduledAt: string;
    durationMin: number;
    type: 'IN_PERSON' | 'PHONE' | 'VIDEO';
  }) => api<{ booking: Booking }>('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBookingStatus: (id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') =>
    api<{ booking: Booking }>(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Notifications
  listNotifications: (onlyUnread = false) => {
    const sp = new URLSearchParams();
    if (onlyUnread) sp.set('unread', 'true');
    return api<{ notifications: Notification[]; unreadCount: number }>(`/api/notifications${sp.toString() ? `?${sp}` : ''}`);
  },
  markNotificationRead: (id: string) =>
    api<{ ok: true }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),

  // Bookmarks
  listBookmarks: () => api<{ bookmarks: Law[]; total: number }>('/api/bookmarks'),
  toggleBookmark: (lawId: number) =>
    api<{ ok: true; bookmarked: boolean }>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ lawId }),
    }),

  // Contact
  submitContact: (data: {
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    consultationType?: string;
    preferredTime?: string;
  }) => api<{ ok: true; id: string }>('/api/contact', { method: 'POST', body: JSON.stringify(data) }),

  // AI
  aiChat: (query: string) =>
    api<{ answer: string; citations: Citation[]; laws: unknown[]; source: string }>(
      '/api/ai/chat',
      { method: 'POST', body: JSON.stringify({ query }) },
    ),

  // Newsletter (footer signup)
  subscribeNewsletter: (email: string) =>
    api<{ ok: true; email: string; message: string }>('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // News (public)
  listNews: (params?: { q?: string; category?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.category) sp.set('category', params.category);
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.offset) sp.set('offset', String(params.offset));
    return api<{ news: NewsItem[]; total: number }>(`/api/news${sp.toString() ? `?${sp}` : ''}`);
  },
  getNews: (slug: string) => api<{ news: NewsItem }>(`/api/news/${encodeURIComponent(slug)}`),

  // Articles (public)
  listArticles: (params?: { q?: string; category?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.category) sp.set('category', params.category);
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.offset) sp.set('offset', String(params.offset));
    return api<{ articles: ArticleItem[]; total: number }>(`/api/articles${sp.toString() ? `?${sp}` : ''}`);
  },
  getArticle: (slug: string) => api<{ article: ArticleItem }>(`/api/articles/${encodeURIComponent(slug)}`),

  // Admin
  adminStats: () => api<{ stats: AdminStat[]; meta: Record<string, number> }>('/api/admin/stats'),
  adminActivities: () => api<{ activities: AdminActivity[] }>('/api/admin/activities'),
};

// ─── Types (mirror of the Prisma models) ──────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: 'ADMIN' | 'LAWYER' | 'USER';
  roleLabel: string;
  provider: 'OTP' | 'SSO' | 'ADMIN_PASSWORD';
}

export interface Law {
  id: number;
  title: string;
  code: string;
  category: string;
  excerpt: string;
  article: string;
  relevance: string;
  date: string;
  fullText?: string;
  sanction?: string;
  officialSource?: string;
  keyTakeaways: string[];
}

export interface RightsGuide {
  id: string;
  title: string;
  target: 'TOURIST' | 'BUSINESS' | 'SPORTS';
  iconName: string;
  summary: string;
  details: string[];
  lawCitations: string[];
}

export interface Lawyer {
  id: string;
  name: string;
  specialty: string;
  badges: string[];
  rating: number;
  reviews: number;
  experience: string;
  city: string;
  avatar?: string;
  bio: string;
  licenseNumber?: string;
  isVerified: boolean;
  isAvailable: boolean;
  hourlyRate: number;
}

export interface Claim {
  id: string;
  trackingCode: string;
  userId: string;
  title: string;
  type: string;
  description?: string;
  amount?: string;
  status: 'INITIAL_REVIEW' | 'EXPERT_EVALUATION' | 'COMMITTEE' | 'RESOLVED' | 'REJECTED';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  lawyerId: string;
  topic: string;
  description?: string;
  scheduledAt: string;
  durationMin: number;
  type: 'IN_PERSON' | 'PHONE' | 'VIDEO';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  voucherCode: string;
  amount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  authorName?: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags?: string;
  imageUrl?: string;
  authorName?: string;
  readingTimeMin: number;
  publishedAt: string;
  isPublished: boolean;
}

export interface Citation {
  title: string;
  article: string;
  code: string;
  officialSource?: string;
}

export interface AdminStat {
  id: string;
  icon: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AdminActivity {
  id: string;
  type: string;
  label: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
}
