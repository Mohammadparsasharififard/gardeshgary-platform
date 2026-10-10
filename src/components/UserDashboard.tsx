import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck, FileText, Bookmark, Clock, CheckCircle, XCircle, Sparkles, BookOpen,
} from 'lucide-react';
import { travelerClaims as staticClaims, type TravelerClaim } from '@/data';
import { dataLoaders, type Claim } from '@/lib/loaders';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';

// Map backend claim status to the legacy Persian labels
const CLAIM_STATUS_LABEL: Record<Claim['status'], string> = {
  INITIAL_REVIEW: 'در حال بررسی',
  EXPERT_EVALUATION: 'در حال بررسی',
  COMMITTEE: 'در حال بررسی',
  RESOLVED: 'تأیید شده',
  REJECTED: 'رد شده',
};

// ─── Status badge colors with HIGH contrast ───
const STATUS_STYLE: Record<string, string> = {
  'در حال بررسی': 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-700/50',
  'تأیید شده': 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50',
  'رد شده': 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700/50',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  'در حال بررسی': Clock,
  'تأیید شده': CheckCircle,
  'رد شده': XCircle,
};

// ─── Stat icon colors — each DISTINCT ───
const STAT_ICONS_MAP = [FileText, Bookmark, Sparkles, BookOpen] as const;
const STAT_COLORS = [
  'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
  'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
];

interface LocalClaim {
  id: string;
  title: string;
  date: string;
  amount: string;
  status: keyof typeof STATUS_STYLE;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const { count: bookmarkCount } = useBookmarks();
  const [claims, setClaims] = useState<LocalClaim[]>(
    staticClaims.map((c) => ({
      id: String(c.id),
      title: c.title,
      date: c.date,
      amount: c.amount,
      status: c.status,
    })),
  );
  const [bookingCount, setBookingCount] = useState(0);

  // Load real claims + bookings from the backend on mount
  useEffect(() => {
    if (!user) return;
    void (async () => {
      const [{ data: claimsData }, { data: bookingsData }] = await Promise.all([
        dataLoaders.loadClaims(),
        dataLoaders.loadBookings(),
      ]);
      if (claimsData && claimsData.length > 0) {
        const mapped: LocalClaim[] = claimsData.map((c: Claim) => ({
          id: c.id,
          title: c.title,
          date: new Date(c.createdAt).toLocaleDateString('fa-IR'),
          amount: c.amount || '—',
          status: CLAIM_STATUS_LABEL[c.status] as keyof typeof STATUS_STYLE,
        }));
        setClaims(mapped);
      }
      if (bookingsData) {
        setBookingCount(bookingsData.length);
      }
    })();
  }, [user]);

  const stats = [
    { label: 'شکایات من', value: claims.length.toLocaleString('fa-IR'), icon: STAT_ICONS_MAP[0], color: STAT_COLORS[0] },
    { label: 'قوانین ذخیره‌شده', value: bookmarkCount.toLocaleString('fa-IR'), icon: STAT_ICONS_MAP[1], color: STAT_COLORS[1] },
    { label: 'مشاوره‌ها', value: bookingCount.toLocaleString('fa-IR'), icon: STAT_ICONS_MAP[2], color: STAT_COLORS[2] },
    { label: 'قراردادها', value: '۰', icon: STAT_ICONS_MAP[3], color: STAT_COLORS[3] },
  ];

  return (
    <section id="user-dashboard" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-night-950 via-night-900 to-night-800 rounded-3xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden gpu"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-jade-500/15 rounded-full blur-3xl pointer-events-none aurora-anim" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-jade-500 to-jade-600 flex items-center justify-center shadow-glow">
              <UserCheck size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold mb-1 text-shadow-premium">پنل مسافر و گردشگر</h2>
              <p className="text-sm text-night-200">
                خوش آمدید، {user?.name ?? 'مسافر گرامی'} — پیگیری شکایات و قوانین ذخیره‌شده
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats — each with DISTINCT icon color */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-4 card-hover-v2"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div className="text-xl font-extrabold text-night-900 dark:text-white tabular-nums">{s.value}</div>
                <p className="text-[11px] text-night-500 dark:text-night-300 font-medium">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Claims list with color-coded status */}
        <div className="bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-night-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-jade-600 dark:text-jade-400" />
              شکایات من
            </h3>
            <button className="text-[11px] font-bold text-white bg-jade-600 hover:bg-jade-500 px-3 py-1.5 rounded-lg shadow-glow transition-colors btn-press">
              + شکایت جدید
            </button>
          </div>
          {claims.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="text-night-300 dark:text-night-600 mx-auto mb-2" />
              <p className="text-sm text-night-400 dark:text-night-500">هنوز شکایتی ثبت نکرده‌اید</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {claims.map((c) => {
                const StatusIcon = STATUS_ICONS[c.status] || Clock;
                const statusStyle = STATUS_STYLE[c.status];
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-night-100 dark:border-night-800 hover:shadow-card transition-all bg-night-50/30 dark:bg-night-800/20"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${statusStyle}`}>
                      <StatusIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-night-900 dark:text-white">{c.title}</h4>
                      <p className="text-[11px] text-night-500 dark:text-night-400">
                        {c.date} • مبلغ: {c.amount}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyle}`}>
                      {c.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-4 pt-4 border-t border-night-100 dark:border-night-800 text-[10px] text-night-400 dark:text-night-500">
            شکایات از دیتابیس لود می‌شوند. برای ثبت شکایت جدید از فرم صفحه شکایات استفاده کنید.
          </p>
        </div>
      </div>
    </section>
  );
}
