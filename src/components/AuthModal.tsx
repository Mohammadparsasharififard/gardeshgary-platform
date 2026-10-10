import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, Smartphone, Landmark, ArrowRight, UserCheck, Shield, Lock, User, KeyRound, QrCode
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { useToast } from '@/components/Toast';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useAuth } from '@/hooks/useAuth';
import { ApiError, TwoFactorRequiredError, apiClient } from '@/lib/api';
import QRCode from 'qrcode';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userName: string, role: string) => void;
}

// Only REAL transport failures may claim a connection problem. Chrome throws
// TypeError('Failed to fetch'), Firefox TypeError('NetworkError when
// attempting to fetch resource'), Safari TypeError('Load failed').
const NETWORK_ERR_RE = /failed to fetch|networkerror|load failed|network request failed/i;

/**
 * Map an unknown auth-flow error to a user-facing Persian message.
 * A TypeError caused by a logic bug (e.g. destructuring an undefined payload)
 * must NEVER be reported as «ارتباط با سرور برقرار نشد» — only genuine
 * fetch/transport failures may say that; everything else gets an honest
 * generic (or server-provided) message.
 */
function describeAuthError(
  err: unknown,
  opts: { unauthorized?: string; fallback: string },
): string {
  if (err instanceof ApiError) {
    if (err.status === 429) return 'تلاش‌های زیادی انجام شده. چند دقیقه بعد تلاش کنید.';
    if (err.status === 503) return 'تنظیمات امنیتی سرور ناقص است (JWT_SECRET). به مدیر سرور اطلاع دهید.';
    if (err.status === 401) return opts.unauthorized ?? err.message;
    if (err.status === 0 || err.status >= 500) return 'سرور در دسترس نیست. بعداً تلاش کنید.';
    return err.message; // server-provided Persian message (400/403/423/…)
  }
  if (err instanceof TypeError && NETWORK_ERR_RE.test(String(err.message))) {
    return 'ارتباط با سرور برقرار نشد. بعداً تلاش کنید.';
  }
  if (typeof DOMException !== 'undefined' && err instanceof DOMException && err.name === 'AbortError') {
    return 'زمان انتظار پاسخ سرور به پایان رسید. دوباره تلاش کنید.';
  }
  return opts.fallback;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { showToast } = useToast();
  const { loginWithPassword, completeTwoFactor, sendOtp, verifyOtp } = useAuth();
  const [tab, setTab] = useState<'otp' | 'sso' | 'admin'>('otp');
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<'input' | 'otp_verify'>('input');
  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  // ── 2FA enrollment / challenge state ──
  // Set when loginWithPassword throws TwoFactorRequiredError: the login
  // SUCCEEDED server-side (HTTP 200 + pre-token) and the modal now walks the
  // operator through enrollment (QR + TOTP) or a plain TOTP challenge.
  const [enroll, setEnroll] = useState<{
    preToken: string;
    mustEnroll: boolean;
    phase: 'staging' | 'ready';
    otpauthUri?: string;
    secret?: string;
    backupCodes?: string[];
  } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [enrollBusy, setEnrollBusy] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const resetEnrollState = useCallback(() => {
    setEnroll(null);
    setTotpCode('');
    setEnrollError(null);
    setEnrollBusy(false);
    setQrDataUrl(null);
  }, []);

  const trapRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  // Reset the 2FA sub-flow when the modal is dismissed so a reopened modal
  // starts from the login form. (A half-staged server-side secret is
  // harmless — re-staging overwrites it.)
  useEffect(() => {
    if (!isOpen) resetEnrollState();
  }, [isOpen, resetEnrollState]);

  // Render the otpauth:// URI as a QR data-URL (same look as /admin/login).
  useEffect(() => {
    if (!enroll?.otpauthUri) {
      setQrDataUrl(null);
      return;
    }
    let alive = true;
    QRCode.toDataURL(enroll.otpauthUri, { width: 220, margin: 1 })
      .then((url) => { if (alive) setQrDataUrl(url); })
      .catch(() => { if (alive) setQrDataUrl(null); });
    return () => { alive = false; };
  }, [enroll?.otpauthUri]);

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      showToast('لطفاً شماره تلفن همراه معتبر ۱۱ رقمی وارد نمایید', 'error');
      return;
    }
    setLoading(true);
    try {
      const code = await sendOtp(mobile);
      setDevCode(code);
      setStep('otp_verify');
      showToast(`کد تأیید ۶ رقمی به شماره ${mobile} پیامک گردید.${code ? ` (کد دمو: ${code})` : ''}`, 'info');
    } catch (err) {
      const msg = describeAuthError(err, { fallback: 'خطا در ارسال کد. دوباره تلاش کنید.' });
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      showToast('لطفاً کد تأیید ۶ رقمی دریافتی را وارد کنید', 'error');
      return;
    }
    setLoading(true);
    try {
      const user = await verifyOtp(mobile, otpCode);
      showToast(`ورود موفقیت‌آمیز بود! خوش آمدید (${user.roleLabel})`, 'success');
      onLoginSuccess?.(user.name, user.roleLabel);
      onClose();
      setStep('input');
      setOtpCode('');
      setMobile('');
      setDevCode(undefined);
    } catch (err) {
      const msg = describeAuthError(err, { unauthorized: 'کد اشتباه است یا منقضی شده', fallback: 'خطای غیرمنتظره. دوباره تلاش کنید.' });
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // SSO is not yet implemented on the backend — show a clear message
  const handleSSOLogin = () => {
    showToast('ورود با شناسه ملی به‌زودی فعال خواهد شد. لطفاً از ورود با کد یکبار مصرف استفاده کنید.', 'info');
  };

  // Kick off the mandatory-2FA sub-flow: for accounts that must ENROLL we
  // stage a secret (POST /api/auth/2fa/setup with the pre-token) and show the
  // QR; for accounts with 2FA already enabled we go straight to the code
  // challenge.
  const startEnrollment = async (preToken: string, mustEnroll: boolean) => {
    setTotpCode('');
    setEnrollError(null);
    if (!mustEnroll) {
      setEnroll({ preToken, mustEnroll: false, phase: 'ready' });
      return;
    }
    setEnroll({ preToken, mustEnroll: true, phase: 'staging' });
    try {
      const s = await apiClient.twoFactorSetup(preToken);
      setEnroll({
        preToken,
        mustEnroll: true,
        phase: 'ready',
        otpauthUri: s.otpauthUri,
        secret: s.secret,
        backupCodes: s.backupCodes,
      });
      showToast('راه‌اندازی 2FA آماده است. QR را با اپ احراز هویت اسکن کنید و کد ۶ رقمی را وارد کنید.', 'info');
    } catch (err) {
      // Staging failed (expired pre-token / rate limit / server). The operator
      // is NOT stuck: honest reason + /admin/login fallback — never a fake
      // connection error.
      setEnroll(null);
      const msg = describeAuthError(err, {
        fallback: 'راه‌اندازی 2FA ناموفق بود. از صفحه ورود مدیر (/admin/login) استفاده کنید.',
      });
      setAdminError(msg);
      showToast(msg, 'error');
    }
  };

  const handleEnrollVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enroll) return;
    const code = totpCode.replace(/\s+/g, '');
    if (code.length !== 6) {
      setEnrollError('کد ۶ رقمی اپ احراز هویت را وارد کنید');
      return;
    }
    setEnrollBusy(true);
    setEnrollError(null);
    try {
      // Confirming the code ENABLES 2FA (for a staged enrollment) and returns
      // the full session in one step.
      const user = await completeTwoFactor(code, enroll.preToken);
      showToast('ورود مدیر سیستم موفقیت‌آمیز بود!', 'success');
      onLoginSuccess?.(user.name, user.roleLabel);
      onClose();
      resetEnrollState();
      setAdminUser('');
      setAdminPass('');
      // Admins land in the standalone management panel. The SPA runs inside a
      // sandboxed iframe that cannot top-navigate, so /admin opens in a new
      // tab (allow-popups is granted to the iframe).
      try {
        window.open('/admin', '_blank', 'noopener');
      } catch {
        /* popup blocked — the toast still confirms the login */
      }
    } catch (err) {
      setEnrollError(describeAuthError(err, {
        fallback: 'کد نامعتبر است یا منقضی شده. دوباره تلاش کنید.',
      }));
    } finally {
      setEnrollBusy(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (!adminUser || !adminPass) {
      setAdminError('نام کاربری و رمز عبور را وارد کنید');
      showToast('نام کاربری و رمز عبور را وارد کنید', 'error');
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithPassword(adminUser, adminPass);
      showToast('ورود مدیر سیستم موفقیت‌آمیز بود!', 'success');
      onLoginSuccess?.(user.name, user.roleLabel);
      onClose();
      setAdminUser('');
      setAdminPass('');
      // Admins land in the standalone management panel. The SPA runs inside a
      // sandboxed iframe that cannot top-navigate, so /admin opens in a new
      // tab (allow-popups is granted to the iframe).
      try {
        window.open('/admin', '_blank', 'noopener');
      } catch {
        /* popup blocked — the toast still confirms the login */
      }
    } catch (err) {
      // MANDATORY-2FA handshake: the login itself SUCCEEDED (HTTP 200 +
      // pre-token) — switch the modal to the enrollment / challenge flow
      // instead of showing any error at all.
      if (err instanceof TwoFactorRequiredError) {
        setAdminError(null);
        void startEnrollment(err.preTwoFactorToken, err.mustEnroll);
        return;
      }
      // Distinguish between network errors and auth errors. The message is
      // shown BOTH inline (inside the form — always visible) and as a toast.
      const msg = describeAuthError(err, {
        unauthorized: 'نام کاربری یا رمز عبور اشتباه است',
        fallback: 'خطای غیرمنتظره در پردازش پاسخ سرور. دوباره تلاش کنید.',
      });
      setAdminError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-night-950/80 backdrop-blur-md"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          ref={trapRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          tabIndex={-1}
          className="relative bg-white dark:bg-night-900 rounded-3xl shadow-2xl border border-night-100 dark:border-night-700 max-w-md w-full overflow-hidden focus:outline-none"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-l from-night-950 via-night-900 to-night-800 p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-jade-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="rounded-xl overflow-hidden bg-white/10 border border-jade-400/30 p-1">
                  <BrandLogo size={36} withText={false} />
                </div>
                <div>
                  <h3 id="auth-modal-title" className="font-extrabold text-base text-white">ورود و ثبت‌نام</h3>
                  <p className="text-xs text-night-300">پلتفرم ملی حقوق گردشگری ایران</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="بستن پنجره ورود"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-night-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Role selector — single: user only (admin via separate tab) */}
            {tab !== 'admin' && (
              <div className="mt-5 bg-night-950/60 p-1.5 rounded-xl border border-white/5">
                <div className="py-1.5 px-2 rounded-lg bg-jade-600/20 text-jade-300 text-[11px] font-semibold flex items-center justify-center gap-1">
                  <UserCheck size={12} />
                  <span>ورود کاربر</span>
                </div>
              </div>
            )}
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 p-2 bg-night-50/70 dark:bg-night-950/40 border-b border-night-100 dark:border-night-800 gap-1 sm:gap-2">
            <button
              onClick={() => { setTab('otp'); setStep('input'); setAdminError(null); resetEnrollState(); }}
              className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${tab === 'otp' ? 'bg-white dark:bg-night-800 text-jade-700 dark:text-jade-300 shadow-sm border border-jade-100 dark:border-jade-700/30' : 'text-night-500 dark:text-night-400 hover:text-night-800 dark:hover:text-night-200'}`}
            >
              <Smartphone size={14} /><span className="hidden xs:inline sm:inline">کد یکبار مصرف</span><span className="xs:hidden sm:hidden">کد</span>
            </button>
            <button
              onClick={() => { setTab('sso'); setAdminError(null); resetEnrollState(); }}
              className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${tab === 'sso' ? 'bg-white dark:bg-night-800 text-jade-700 dark:text-jade-300 shadow-sm border border-jade-100 dark:border-jade-700/30' : 'text-night-500 dark:text-night-400 hover:text-night-800 dark:hover:text-night-200'}`}
            >
              <Landmark size={14} /><span className="hidden xs:inline sm:inline">شناسه ملی</span><span className="xs:hidden sm:hidden">ملی</span>
            </button>
            <button
              onClick={() => { setTab('admin'); setAdminError(null); }}
              className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${tab === 'admin' ? 'bg-night-800 dark:bg-night-950 text-jade-400 shadow-sm border border-jade-700/30' : 'text-night-500 dark:text-night-400 hover:text-night-800 dark:hover:text-night-200'}`}
            >
              <Shield size={14} /><span className="hidden xs:inline sm:inline">ورود مدیر</span><span className="xs:hidden sm:hidden">مدیر</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {tab === 'admin' ? (
              enroll ? (
                /* ─── 2FA ENROLLMENT / CHALLENGE ─── */
                <form onSubmit={handleEnrollVerify} className="space-y-4">
                  {enroll.mustEnroll && enroll.phase === 'staging' ? (
                    <div className="p-6 text-center space-y-3" aria-live="polite">
                      <div className="w-10 h-10 border-2 border-jade-600 border-t-transparent rounded-full animate-spin mx-auto" aria-hidden="true" />
                      <p className="text-xs text-night-600 dark:text-night-300">در حال آماده‌سازی راه‌اندازی 2FA...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-night-50 dark:bg-night-800/50 border border-night-100 dark:border-night-700 rounded-xl flex items-center gap-2.5 text-xs text-night-700 dark:text-night-300">
                        <QrCode size={18} className="text-jade-600 dark:text-jade-400 flex-shrink-0" />
                        <span>
                          {enroll.mustEnroll
                            ? 'راه‌اندازی ورود دومرحله‌ای (2FA) — QR را با اپ احراز هویت اسکن کنید'
                            : 'این حساب با ورود دومرحله‌ای (2FA) محافظت می‌شود — کد ۶ رقمی را وارد کنید'}
                        </span>
                      </div>

                      {enroll.mustEnroll && enroll.otpauthUri && (
                        <div className="flex flex-col items-center gap-2">
                          {qrDataUrl ? (
                            <img
                              src={qrDataUrl}
                              alt="QR کد راه‌اندازی ورود دومرحله‌ای"
                              width={180}
                              height={180}
                              className="rounded-xl border border-night-200 dark:border-night-700 bg-white p-1"
                            />
                          ) : (
                            <div className="w-[180px] h-[180px] rounded-xl bg-night-100 dark:bg-night-800 animate-pulse" aria-hidden="true" />
                          )}
                          {enroll.secret && (
                            <div className="w-full">
                              <p className="text-[10px] text-night-400 dark:text-night-500 mb-1 text-center">کلید دستی (در صورت عدم امکان اسکن):</p>
                              <code
                                dir="ltr"
                                className="block text-center text-[11px] font-mono bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-lg px-2 py-1.5 break-all text-night-800 dark:text-night-200 select-all"
                              >
                                {enroll.secret}
                              </code>
                            </div>
                          )}
                          {enroll.backupCodes && enroll.backupCodes.length > 0 && (
                            <details className="w-full text-right">
                              <summary className="text-[11px] text-jade-700 dark:text-jade-300 cursor-pointer select-none">
                                کدهای پشتیبان (فقط یک بار نمایش داده می‌شوند)
                              </summary>
                              <div dir="ltr" className="mt-1 max-h-28 overflow-y-auto grid grid-cols-2 gap-1 p-2 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-lg">
                                {enroll.backupCodes.map((c) => (
                                  <code key={c} className="text-[11px] font-mono text-night-700 dark:text-night-300 text-center">{c}</code>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      )}

                      <div>
                        <label htmlFor="admin-totp-input" className="block text-xs font-bold text-night-700 dark:text-night-200 mb-1.5">کد تأیید ۶ رقمی:</label>
                        <input
                          id="admin-totp-input"
                          type="text"
                          dir="ltr"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={7}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          placeholder="123456"
                          className="w-full text-center tracking-widest text-xl font-bold py-3 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-xl text-night-900 dark:text-white focus:ring-2 focus:ring-jade-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={enrollBusy}
                        className="w-full py-3.5 bg-night-800 dark:bg-night-950 hover:bg-night-700 dark:hover:bg-night-900 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-jade-700/30 btn-press"
                      >
                        {enrollBusy ? <span>در حال بررسی...</span> : (<><KeyRound size={15} /><span>{enroll.mustEnroll ? 'تأیید و فعال‌سازی 2FA' : 'تأیید کد و ورود'}</span></>)}
                      </button>

                      {enrollError && (
                        <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                          <Shield size={15} className="flex-shrink-0 mt-0.5" />
                          <span>{enrollError}</span>
                        </div>
                      )}

                      <div className="text-center space-y-1.5 pt-1">
                        <button
                          type="button"
                          onClick={resetEnrollState}
                          className="text-xs text-night-400 dark:text-night-500 hover:text-jade-700 dark:hover:text-jade-300 transition-colors"
                        >
                          انصراف و بازگشت به فرم ورود
                        </button>
                        <p className="text-[10px] text-night-400 dark:text-night-500">
                          یا{' '}
                          <a
                            href="/admin/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-jade-700 dark:text-jade-300 underline underline-offset-2"
                          >
                            صفحه اختصاصی ورود مدیر (/admin/login)
                          </a>
                        </p>
                      </div>
                    </>
                  )}
                </form>
              ) : (
              /* ─── ADMIN LOGIN ─── */
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="p-3 bg-night-50 dark:bg-night-800/50 border border-night-100 dark:border-night-700 rounded-xl flex items-center gap-2.5 text-xs text-night-700 dark:text-night-300">
                  <Shield size={18} className="text-jade-600 dark:text-jade-400 flex-shrink-0" />
                  <span>ورود اختصاصی مدیر سیستم — نیاز به نام کاربری و رمز عبور</span>
                </div>
                <div>
                  <label htmlFor="admin-username" className="block text-xs font-bold text-night-700 dark:text-night-200 mb-1.5">نام کاربری:</label>
                  <div className="relative">
                    <input
                      id="admin-username"
                      type="text"
                      dir="ltr"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin"
                      autoComplete="username"
                      className="w-full px-4 py-3 pr-11 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-xl text-night-900 dark:text-white text-sm focus:ring-2 focus:ring-jade-500 focus:outline-none"
                    />
                    <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-night-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-xs font-bold text-night-700 dark:text-night-200 mb-1.5">رمز عبور:</label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type="password"
                      dir="ltr"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="••••••"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-11 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-xl text-night-900 dark:text-white text-sm focus:ring-2 focus:ring-jade-500 focus:outline-none"
                    />
                    <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-night-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-night-800 dark:bg-night-950 hover:bg-night-700 dark:hover:bg-night-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-jade-700/30 btn-press"
                >
                  {loading ? <span>در حال بررسی...</span> : (<><Shield size={15} /><span>ورود به پنل مدیریت</span></>)}
                </button>
                {adminError && (
                  <div role="alert" className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                    <Shield size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}
                <p className="text-[10px] text-center text-night-400 dark:text-night-500">
                  دسترسی فقط برای مدیران سیستم
                </p>
              </form>
              )
            ) : tab === 'otp' ? (
              step === 'input' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label htmlFor="auth-mobile-input" className="block text-xs font-bold text-night-700 dark:text-night-200 mb-1.5">شماره تلفن همراه:</label>
                    <div className="relative">
                      <input
                        id="auth-mobile-input"
                        type="tel"
                        dir="ltr"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="0912XXXXXXX"
                        className="w-full px-4 py-3 pr-11 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-xl text-night-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-jade-500 focus:outline-none"
                      />
                      <Smartphone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-night-400" />
                    </div>
                    <p className="text-[11px] text-night-400 dark:text-night-500 mt-1">کد تأیید ورود به این شماره پیامک خواهد شد.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-jade-600 hover:bg-jade-500 disabled:bg-night-200 text-white rounded-xl text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2 btn-press"
                  >
                    {loading ? <span>در حال ارسال...</span> : (<><span>دریافت کد یکبار مصرف</span><ArrowRight size={14} className="rotate-180" /></>)}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-xs text-night-600 dark:text-night-300">کد ارسال شده به <strong dir="ltr">{mobile}</strong> را وارد کنید:</p>
                  </div>
                  <div>
                    <label htmlFor="auth-otp-input" className="sr-only">کد تأیید ۶ رقمی</label>
                    <input
                      id="auth-otp-input"
                      type="text"
                      dir="ltr"
                      value={otpCode}
                      maxLength={6}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="کد ۶ رقمی"
                      className="w-full text-center tracking-widest text-xl font-bold py-3 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-xl text-night-900 dark:text-white focus:ring-2 focus:ring-jade-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-jade-600 hover:bg-jade-500 disabled:bg-night-200 text-white rounded-xl text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2 btn-press"
                  >
                    {loading ? <span>در حال بررسی...</span> : <span>تأیید و ورود به پنل</span>}
                  </button>
                  <div className="text-center pt-2">
                    <button type="button" onClick={() => setStep('input')} className="text-xs text-night-400 dark:text-night-500 hover:text-jade-700 dark:hover:text-jade-300 transition-colors">
                      ویرایش شماره تلفن
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-jade-50/70 dark:bg-jade-900/20 border border-jade-100 dark:border-jade-700/30 rounded-xl flex items-center gap-2.5 text-xs text-jade-800 dark:text-jade-200">
                  <ShieldCheck size={18} className="text-jade-600 dark:text-jade-400 flex-shrink-0" />
                  <span>اتصال امن از طریق درگاه خدمات دولت</span>
                </div>
                <div>
                  <label htmlFor="auth-national-code" className="block text-xs font-bold text-night-700 dark:text-night-200 mb-1.5">کد ملی ۱۰ رقمی:</label>
                  <input
                    id="auth-national-code"
                    type="text"
                    dir="ltr"
                    maxLength={10}
                    disabled
                    placeholder="به‌زودی فعال خواهد شد"
                    className="w-full px-4 py-3 bg-night-50 dark:bg-night-800 border border-night-200 dark:border-night-700 rounded-xl text-night-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-jade-500 focus:outline-none opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSSOLogin}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-jade-600 to-teal-700 hover:from-jade-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2 btn-press"
                >
                  <Landmark size={15} />
                  <span>{loading ? 'در حال اتصال...' : 'ورود با شناسه ملی'}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
