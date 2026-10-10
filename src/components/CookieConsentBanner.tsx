import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, ShieldCheck, Settings2 } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

/**
 * CookieConsentBanner — GDPR-style cookie consent banner that appears at the
 * bottom of the screen until the user accepts/rejects/dismisses.
 *
 *  - Driven by useCookieConsent (persistent + cross-tab)
 *  - Respects prefers-reduced-motion via the global CSS override
 *  - Keyboard accessible: all actions are real <button>s
 *  - Stays hidden once any choice is made for the current policy version
 *  - Has a small re-open affordance? No — the choice is final until version bump
 */
export default function CookieConsentBanner() {
  const { hasChosen, accept, reject, dismiss } = useCookieConsent();
  // Defer mounting a tiny bit so it doesn't fight with the hero animation
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (hasChosen) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, [hasChosen]);

  return (
    <AnimatePresence>
      {visible && !hasChosen && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          role="region"
          aria-label="اعلان رضایت کوکی"
          className="fixed bottom-0 left-0 right-0 z-[80] px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto pointer-events-auto">
            <div className="relative glass-nav dark:bg-navy-900/95 border border-navy-200 dark:border-navy-700 rounded-2xl shadow-premium overflow-hidden">
              {/* top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-emerald-500/40" />
              {/* dismiss X */}
              <button
                onClick={dismiss}
                aria-label="بستن اعلان کوکی"
                className="absolute top-2 left-2 z-10 w-8 h-8 rounded-lg bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-navy-600 dark:text-navy-300 flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </button>

              <div className="grid sm:grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-center p-3 sm:p-4">
                {/* icon */}
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-emerald-500/15 border border-amber-200/50 dark:border-amber-700/40 items-center justify-center flex-shrink-0">
                  <Cookie size={20} className="text-amber-600 dark:text-amber-400" />
                </div>

                {/* text */}
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 mb-0.5">
                    <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    رضایت کاربر درباره کوکی‌ها
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-navy-600 dark:text-navy-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    این پلتفرم برای بهبود تجربه کاربر از کوکی‌های ضروری استفاده می‌کند.
                    {' '}
                    <a
                      href="#"
                      className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      سیاست حفظ حریم خصوصی
                    </a>
                  </p>
                </div>

                {/* actions */}
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 sm:flex-shrink-0">
                  <button
                    onClick={reject}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-200 border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                  >
                    <Settings2 size={12} />
                    فقط ضروری
                  </button>
                  <button
                    onClick={accept}
                    className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow transition-all btn-press"
                  >
                    <Check size={12} />
                    می‌پذیرم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
