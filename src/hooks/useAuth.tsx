import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  apiClient,
  setToken,
  getToken,
  ApiError,
  TwoFactorRequiredError,
  type AuthUser,
  type LoginResponse,
} from '@/lib/api';

export type UserRole = 'ADMIN' | 'LAWYER' | 'USER';
export type AuthProvider = 'OTP' | 'SSO' | 'ADMIN_PASSWORD';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  nationalCode?: string;
  role: UserRole;
  provider: AuthProvider;
  roleLabel: string;
  loggedInAt: number;
}

// Legacy compatibility: export the shape the rest of the app expects.
// The new API uses uppercase roles (ADMIN/LAWYER/USER) but the original
// components expect lowercase ('admin'/'user'). We translate here so the UI
// doesn't break.

// Storage key for the legacy persisted user object (kept for backward compat)
const STORAGE_KEY = 'gardeshgary.auth.user.v1';

// ─── Context ───
interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  // New backend-backed login methods
  loginWithPassword: (username: string, password: string) => Promise<AuthUser>;
  /** Finish a login that was paused at the 2FA step (enrollment or TOTP
   *  challenge). Exchanges the code + pre-2FA token for the full session. */
  completeTwoFactor: (code: string, preTwoFactorToken: string) => Promise<AuthUser>;
  sendOtp: (mobile: string) => Promise<string | undefined>;
  verifyOtp: (mobile: string, code: string, name?: string) => Promise<AuthUser>;
  // Legacy login (kept for backward compat — no longer used by UI but
  // harmless to leave exported for now)
  login: (role: UserRole, name: string, provider: AuthProvider, extra?: { mobile?: string; nationalCode?: string }) => AuthUser;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  roles: Record<UserRole, boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Normalize the backend user (uppercase roles) to the legacy UI shape
// (lowercase roles + provider string).
function normalizeUser(u: AuthUser): AuthUser {
  const roleLower = (l: string) => l.toLowerCase() as UserRole;
  const roleLabelMap: Record<string, string> = {
    ADMIN: 'مدیر سیستم',
    LAWYER: 'متخصص حقوقی',
    USER: 'کاربر',
  };
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    nationalCode: (u as { nationalCode?: string }).nationalCode,
    role: roleLower(u.role),
    provider: (u.provider as AuthProvider) || 'OTP',
    roleLabel: roleLabelMap[u.role] || u.roleLabel || 'کاربر',
    loggedInAt: Date.now(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: if we have a token, fetch the user from the backend to verify
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient
      .me()
      .then(({ user: u }) => {
        setUser(normalizeUser(u));
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Persist user to localStorage for offline display
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  const loginWithPassword = useCallback(async (username: string, password: string) => {
    const res = await apiClient.login(username, password);

    // A SUPERADMIN (or any account with a mandatory 2FA policy) does NOT get
    // {user, token} back: the server answers 200 with {twoFactorRequired,
    // mustEnroll, preTwoFactorToken}. Destructuring that blindly used to
    // throw a TypeError (`user` undefined) which the modal's generic catch
    // misreported as «ارتباط با سرور برقرار نشد» — a lie, the login had
    // succeeded server-side and the operator was stuck. Detect the handshake
    // payload FIRST and raise a typed, actionable error that carries the
    // pre-token the modal needs to run the enrollment / challenge flow.
    const handshake = res as LoginResponse;
    if ('twoFactorRequired' in handshake && handshake.twoFactorRequired && handshake.preTwoFactorToken) {
      throw new TwoFactorRequiredError(
        handshake.mustEnroll
          ? 'ورود این حساب نیازمند راه‌اندازی ورود دومرحله‌ای (2FA) است. اکنون آن را تنظیم کنید یا از صفحه ورود مدیر (/admin/login) استفاده کنید.'
          : 'این حساب با ورود دومرحله‌ای (2FA) محافظت می‌شود. کد اپ احراز هویت را وارد کنید یا از صفحه ورود مدیر (/admin/login) استفاده کنید.',
        handshake.preTwoFactorToken,
        !!handshake.mustEnroll,
      );
    }

    const { user: u, token } = handshake as { user: AuthUser; token: string };
    if (!u || !token) {
      // Defensive: any other unexpected success payload must surface as a
      // logic error with an honest message — never as a fake network outage.
      throw new ApiError('پاسخ نامعتبر از سرور هنگام ورود. دوباره تلاش کنید.', 0);
    }
    setToken(token);
    const normalized = normalizeUser(u);
    setUser(normalized);
    return normalized;
  }, []);

  // Exchange a TOTP/backup code + pre-2FA token for the full session and
  // store it. Used by the AuthModal enrollment/challenge flow.
  const completeTwoFactor = useCallback(async (code: string, preTwoFactorToken: string) => {
    const { user: u, token } = await apiClient.twoFactorVerify(code, preTwoFactorToken);
    if (!u || !token) {
      throw new ApiError('پاسخ نامعتبر از سرور هنگام تأیید کد. دوباره تلاش کنید.', 0);
    }
    setToken(token);
    const normalized = normalizeUser(u);
    setUser(normalized);
    return normalized;
  }, []);

  const sendOtp = useCallback(async (mobile: string) => {
    const res = await apiClient.sendOtp(mobile);
    return res.devCode; // only present in dev mode
  }, []);

  const verifyOtp = useCallback(async (mobile: string, code: string, name?: string) => {
    const { user: u, token } = await apiClient.verifyOtp(mobile, code, name);
    setToken(token);
    const normalized = normalizeUser(u);
    setUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {
      /* ignore network errors */
    }
    setToken(null);
    setUser(null);
  }, []);

  // Legacy login (kept for backward compat)
  const login = useCallback(
    (role: UserRole, name: string, provider: AuthProvider) => {
      const roleLabelMap: Record<string, string> = {
        admin: 'مدیر سیستم',
        lawyer: 'متخصص حقوقی',
        user: 'کاربر',
      };
      const next: AuthUser = {
        id: `u${Date.now()}`,
        name: name || 'کاربر احراز‌هویت‌شده',
        role,
        provider,
        roleLabel: roleLabelMap[role] || 'کاربر',
        loggedInAt: Date.now(),
      };
      setUser(next);
      return next;
    },
    [],
  );

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);
  const hasAnyRole = useCallback((roles: UserRole[]) => !!user && roles.includes(user.role), [user]);

  const value: AuthContextValue = {
    user,
    isLoggedIn: user !== null,
    loading,
    loginWithPassword,
    completeTwoFactor,
    sendOtp,
    verifyOtp,
    login,
    logout,
    hasRole,
    hasAnyRole,
    roles: {
      admin: user?.role === 'admin',
      lawyer: user?.role === 'lawyer',
      user: user?.role === 'user',
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — must be used inside <AuthProvider>. Returns the shared auth state
 * so components across the tree (Header, AuthModal, dashboards) see the same
 * user without needing their own storage instance.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// We need useContext — re-import to avoid pulling from 'react' twice in types
import { useContext } from 'react';

export default useAuth;
