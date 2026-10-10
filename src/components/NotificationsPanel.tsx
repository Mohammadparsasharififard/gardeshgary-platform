import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bell, BellOff, CheckCheck, Trash2, ChevronLeft,
  Info, CheckCircle2, AlertTriangle, Scale, BellRing,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotifications, type AppNotification } from '@/hooks/useNotifications';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useToast } from '@/components/Toast';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_ICON: Record<AppNotification['type'], typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  'law-update': Scale,
};

const TYPE_TINT: Record<AppNotification['type'], string> = {
  info: 'bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-300 border-navy-200 dark:border-navy-700',
  success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/50',
  warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700/50',
  'law-update': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50',
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'هم‌اکنون';
  if (minutes < 60) return `${minutes.toLocaleString('fa-IR')} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours.toLocaleString('fa-IR')} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days.toLocaleString('fa-IR')} روز پیش`;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { items, unreadCount, markAllRead, markRead, remove, clear, requestOsPermission, sendOsNotification } = useNotifications();
  const { showToast } = useToast();
  const [osPermission, setOsPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied',
  );
  const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  // Close on Escape handled by focus trap
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleEnableOs = async () => {
    const perm = await requestOsPermission();
    setOsPermission(perm);
    if (perm === 'granted') {
      sendOsNotification('پلتفرم حقوق گردشگری', 'اعلان‌های سیستم فعال شد. از این پس به‌روزرسانی قوانین را دریافت خواهید کرد.');
      showToast('اعلان‌های سیستم فعال شد', 'success');
    } else if (perm === 'denied') {
      showToast('دسترسی به اعلان‌ها مسدود شد', 'error');
    } else {
      showToast('دسترسی به اعلان‌ها رد نشد', 'info');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="اعلان‌های شما"
            className="relative bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-navy-100 dark:border-navy-700 max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
            dir="rtl"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-5 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-glow">
                      <Bell size={20} className="text-white" />
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-navy-950 text-[10px] font-extrabold flex items-center justify-center border-2 border-navy-900">
                        {unreadCount.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold leading-tight">اعلان‌های شما</h3>
                    <p className="text-[11px] text-navy-300 mt-0.5">
                      {unreadCount > 0
                        ? `${unreadCount.toLocaleString('fa-IR')} اعلان جدید`
                        : 'همه اعلان‌ها خوانده شده‌اند'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="بستن اعلان‌ها"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* OS permission banner */}
            {osPermission === 'default' && (
              <div className="px-4 pt-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-700/40">
                  <BellRing size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-200 flex-1 leading-relaxed">
                    برای دریافت به‌روزرسانی قوانین، اعلان‌های سیستم را فعال کنید.
                  </p>
                  <button
                    onClick={handleEnableOs}
                    className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors"
                  >
                    فعال‌سازی
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            {items.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-navy-100 dark:border-navy-800">
                <button
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCheck size={13} />
                  خواندن همه
                </button>
                <button
                  onClick={clear}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 size={13} />
                  پاک کردن
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                  <div className="w-16 h-16 rounded-full bg-navy-50 dark:bg-navy-800 border-2 border-dashed border-navy-200 dark:border-navy-700 flex items-center justify-center mb-3">
                    <BellOff size={28} className="text-navy-300 dark:text-navy-600" />
                  </div>
                  <h4 className="text-sm font-bold text-navy-800 dark:text-white mb-1">اعلانی وجود ندارد</h4>
                  <p className="text-[11px] text-navy-500 dark:text-navy-400 leading-relaxed max-w-xs">
                    وقتی به‌روزرسانی قوانین یا پاسخ به شکایات شما رخ دهد، اینجا نمایش داده می‌شود.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-navy-50 dark:divide-navy-800">
                  {items.map((n) => {
                    const Icon = TYPE_ICON[n.type];
                    const tint = TYPE_TINT[n.type];
                    return (
                      <li
                        key={n.id}
                        className={`group relative p-4 hover:bg-navy-50/40 dark:hover:bg-navy-800/40 transition-colors ${!n.read ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                      >
                        {!n.read && (
                          <span className="absolute top-4 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <div className="flex items-start gap-3 pr-3">
                          <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${tint}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm leading-snug mb-1 ${n.read ? 'font-semibold text-navy-700 dark:text-navy-300' : 'font-bold text-navy-900 dark:text-white'}`}>
                              {n.title}
                            </h4>
                            <p className="text-[11px] text-navy-500 dark:text-navy-400 leading-relaxed mb-1.5">
                              {n.body}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-navy-400 dark:text-navy-500 tabular-nums">
                                {timeAgo(n.timestamp)}
                              </span>
                              <div className="flex items-center gap-1">
                                {n.href && (
                                  <button
                                    onClick={() => {
                                      markRead(n.id);
                                      onClose();
                                      window.location.hash = n.href!;
                                    }}
                                    className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
                                  >
                                    مشاهده <ChevronLeft size={11} />
                                  </button>
                                )}
                                <button
                                  onClick={() => remove(n.id)}
                                  aria-label={`حذف اعلان ${n.title}`}
                                  className="p-1 rounded text-navy-300 dark:text-navy-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
