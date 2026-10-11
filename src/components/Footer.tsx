import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Mail, Send, AlertCircle, Headset, BadgeCheck, Clock, ArrowUp, CheckCircle2, Loader2 } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/Toast';
import { apiClient, ApiError } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Persist subscription state across reloads (addresses persistence gap)
  const [subscribedEmail, setSubscribedEmail] = useLocalStorage<string | null>(
    'gardeshgary.newsletter.v1',
    null,
  );

  // One-time scroll-to-top handler used by the "back to top" link
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Clear the success message after a while, but keep persisted state
  const [justSubscribed, setJustSubscribed] = useState(false);
  useEffect(() => {
    if (justSubscribed) {
      const t = setTimeout(() => setJustSubscribed(false), 4000);
      return () => clearTimeout(t);
    }
  }, [justSubscribed]);

  // Real API subscription — POST /api/newsletter/subscribe. The endpoint is
  // rate-limited (10/h per IP) and persists the email in the DB so admins
  // can view/export the subscriber list from the /admin panel.
  const handleSubscribe = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('لطفاً ایمیل خود را وارد کنید');
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError('قالب ایمیل نامعتبر است');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiClient.subscribeNewsletter(trimmed);
      setSubscribedEmail(trimmed);
      setJustSubscribed(true);
      setEmail('');
      showToast(res.message || 'عضویت شما در خبرنامه با موفقیت ثبت شد', 'success');
    } catch (err) {
      const msg = err instanceof ApiError
        ? err.message
        : 'خطا در ثبت عضویت. لطفاً بعداً تلاش کنید.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const footerLinks = {
    'خدمات': [
      { label: 'دستیار هوشمند', href: '#/ai-assistant' },
      { label: 'حقوق گردشگر', href: '#/traveler-rights' },
      { label: 'بانک جامع قوانین', href: '#/laws' },
      { label: 'حقوق کسب‌وکار', href: '#/business-rights' },
      { label: 'مشاوران حقوقی و وکلا', href: '#/experts' },
    ],
    'سازمان': [
      { label: 'مشاوره و رزرو', href: '#/consultation' },
      { label: 'اخبار و مقالات', href: '#/news' },
      { label: 'حقوق ورزشی', href: '#/sports-rights' },
    ],
    'حساب کاربری': [
      { label: 'پنل کاربری', href: '#/dashboard' },
    ],
  };

  return (
    <footer className="relative bg-navy-950 text-navy-200 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]"></div>
      {/* Newsletter */}
      <div className="relative border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">عضویت در خبرنامه حقوقی</h3>
              <p className="text-sm text-navy-300">آخرین تغییرات قوانین گردشگری و مقالات تخصصی را دریافت کنید</p>
            </div>
            <div>
              <form
                onSubmit={(e) => { e.preventDefault(); if (!submitting) void handleSubscribe(); }}
                className="flex gap-2"
                noValidate
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                    placeholder={subscribedEmail ? subscribedEmail : 'ایمیل خود را وارد کنید'}
                    aria-label="ایمیل برای عضویت در خبرنامه"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'newsletter-error' : undefined}
                    className={`w-full px-4 py-3 bg-navy-800 border rounded-xl text-sm text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      error ? 'border-red-400/70' : 'border-navy-700'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="sheen flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? 'در حال ثبت...' : 'عضویت'}
                </button>
              </form>
              {error && (
                <motion.p
                  id="newsletter-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-2 flex items-center gap-1.5"
                >
                  <AlertCircle size={13} /> {error}
                </motion.p>
              )}
              {justSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 text-sm mt-2 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> عضویت شما با موفقیت ثبت شد!
                </motion.p>
              )}
              {!justSubscribed && subscribedEmail && !error && (
                <p className="text-navy-400 text-[11px] mt-2 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  عضو خبرنامه هستید — {subscribedEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo size={40} withText={false} />
              <div>
                <h4 className="text-white font-bold text-sm">پلتفرم ملی حقوق گردشگری</h4>
                <p className="text-xs text-emerald-400">مرجع تخصصی حقوقی</p>
              </div>
            </div>
            <p className="text-xs text-navy-300 leading-relaxed mb-4">
              بستر تخصصی ارائه خدمات حقوقی هوشمند در حوزه گردشگری با بهره‌گیری از هوش مصنوعی و شبکه وکلای متخصص.
            </p>
            {/* Social — only the real support channel; no placeholder profiles */}
            <div className="flex items-center gap-2">
              <a
                href="mailto:info@gardeshgary.ir"
                aria-label="ایمیل پشتیبانی پلتفرم"
                className="w-9 h-9 bg-navy-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-navy-300 hover:text-emerald-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact channels — live form + support email */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-navy-800">
          <a href="mailto:info@gardeshgary.ir" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-navy-800 group-hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
              <Mail size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-navy-400">ایمیل پشتیبانی</p>
              <p className="text-sm text-white font-medium" dir="ltr">info@gardeshgary.ir</p>
            </div>
          </a>
          <a href="#/consultation" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-navy-800 group-hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
              <Send size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-navy-400">فرم تماس آنلاین</p>
              <p className="text-sm text-white font-medium" dir="rtl">ثبت پیام و درخواست مشاوره</p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
              <Headset size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-navy-400">سامانه پاسخگویی</p>
              <p className="text-sm text-white font-medium" dir="rtl">پاسخ حداکثر ظرف ۲۴ ساعت کاری</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          {[
            { icon: Headset, title: 'سامانه پاسخگویی', sub: 'فرم تماس و ایمیل — ۲۴ ساعت کاری' },
            { icon: Clock, title: 'پاسخگویی هوشمند', sub: 'دستیار آنلاین (نمونه)' },
            { icon: BadgeCheck, title: 'مجوز رسمی', sub: '[در حال اخذ]' },
          ].map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-4 py-3 bg-navy-900/80 border border-navy-800 rounded-xl hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{title}</p>
                <p className="text-[10px] text-navy-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-navy-900 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-navy-300 leading-relaxed">
            <span className="text-amber-500 font-semibold">هشدار حقوقی: </span>
            اطلاعات ارائه‌شده در این پلتفرم جنبه مشاوره‌ای دارد و جایگزین مشاوره حقوقی تخصصی نیست. پیش از اقدام قانونی، با وکیل متخصص مشورت کنید. پاسخ‌های دستیار هوشمند بر اساس قوانین موجود تولید می‌شوند و ممکن است به‌روز نباشند.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-400">© ۱۴۰۳ پلتفرم ملی حقوق گردشگری - تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4 text-xs text-navy-400">
            <span className="flex items-center gap-2">
              قدرت گرفته از
              <Scale size={12} className="text-emerald-400" />
              هوش مصنوعی حقوقی
            </span>
            <button
              onClick={scrollTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-emerald-600 text-navy-200 hover:text-white transition-colors border border-navy-700 hover:border-emerald-500"
              aria-label="بازگشت به ابتدای صفحه"
            >
              <ArrowUp size={12} />
              بازگشت به بالا
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
