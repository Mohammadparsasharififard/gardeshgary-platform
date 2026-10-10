import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useToast } from '@/components/Toast';
import { useEffect } from 'react';

/**
 * OfflineBanner — shows a sticky banner at the top of the viewport when the
 * browser goes offline, and a transient "back online" toast when it reconnects.
 *
 *  - Driven by useOnlineStatus (navigator.onLine + online/offline events)
 *  - Banner is dismissable but re-appears if connectivity drops again
 *  - "Retry" button calls window.location.reload() to force-retry pending
 *    network requests (useful after a long offline period where lazy chunks
 *    may have failed to load)
 *  - When the banner is visible it pushes content down (not an overlay) so it
 *    doesn't cover the header
 */
export default function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { showToast } = useToast();

  // When we come back online after having been offline, show a welcome toast.
  useEffect(() => {
    if (isOnline && wasOffline) {
      showToast('اتصال اینترنت برقرار شد. می‌توانید ادامه دهید.', 'success');
    }
  }, [isOnline, wasOffline, showToast]);

  const handleRetry = () => {
    if (isOnline) {
      showToast('در حال به‌روزرسانی صفحه…', 'info');
      setTimeout(() => window.location.reload(), 600);
    } else {
      showToast('هنوز آفلاین هستید. اتصال اینترنت را بررسی کنید.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className="bg-gradient-to-l from-amber-500 via-amber-600 to-orange-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="flex-shrink-0"
                >
                  <WifiOff size={18} />
                </motion.div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold leading-tight">
                    شما آفلاین هستید
                  </p>
                  <p className="text-[10px] text-amber-50/90 leading-tight hidden sm:block">
                    محتوای قبلاً باز‌شده همچنان در دسترس است. محتوای جدید نیاز به اتصال دارد.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-colors backdrop-blur-sm border border-white/20"
              >
                <RefreshCw size={13} className={isOnline ? '' : 'animate-spin-slow'} />
                تلاش مجدد
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
