import { motion } from 'framer-motion';
import { Building, Plane, Users, DollarSign, CheckCircle, XCircle, Clock, PackageOpen } from 'lucide-react';
import { agencyTours, type AgencyTour } from '@/data';
import { useAuth } from '@/hooks/useAuth';

// ─── Status badge colors with HIGH contrast ───
const STATUS_STYLE: Record<AgencyTour['status'], string> = {
  'فعال': 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50',
  'تکمیل‌شده': 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-700/50',
  'لغوشده': 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700/50',
};

const STATUS_ICONS: Record<AgencyTour['status'], typeof Clock> = {
  'فعال': Clock,
  'تکمیل‌شده': CheckCircle,
  'لغوشده': XCircle,
};

// ─── Stat icon colors — each DISTINCT ───
const STAT_CONFIG = [
  { label: 'تورهای فعال', value: '۱ (نمونه)', icon: Plane, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { label: 'مسافران', value: '۲۰ (نمونه)', icon: Users, color: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' },
  { label: 'قراردادها', value: '۱۵ (نمونه)', icon: CheckCircle, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { label: 'درآمد (نمونه)', value: '[نمونه]', icon: DollarSign, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
];

export default function AgencyDashboard() {
  const { user } = useAuth();

  return (
    <section id="agency-dashboard" className="py-12 px-4 sm:px-6 lg:px-8">
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
              <Building size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold mb-1 text-shadow-premium">پنل آژانس گردشگری</h2>
              <p className="text-sm text-night-200">
                خوش آمدید، {user?.name ?? 'مدیر آژانس'} — مدیریت تورها و قراردادها
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats — each with DISTINCT icon color */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CONFIG.map((s, i) => {
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

        {/* Tours list with color-coded status */}
        <div className="bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-night-900 dark:text-white flex items-center gap-2">
              <Plane size={16} className="text-jade-600 dark:text-jade-400" />
              تورهای من
            </h3>
            <button className="text-[11px] font-bold text-white bg-jade-600 hover:bg-jade-500 px-3 py-1.5 rounded-lg shadow-glow transition-colors btn-press">
              + تور جدید
            </button>
          </div>
          <ul className="space-y-2">
            {agencyTours.length === 0 ? (
              <li className="flex flex-col items-center justify-center text-center py-10 px-6">
                <div className="w-14 h-14 rounded-2xl bg-jade-50 dark:bg-jade-900/30 border-2 border-dashed border-jade-200 dark:border-jade-700/50 flex items-center justify-center mb-3">
                  <PackageOpen size={26} className="text-jade-600 dark:text-jade-400" />
                </div>
                <p className="text-sm font-bold text-night-700 dark:text-night-200 mb-1">
                  توری ثبت نشده است
                </p>
                <p className="text-[11px] text-night-400 dark:text-night-500 leading-relaxed">
                  پس از ایجاد اولین تور، فهرست تورها در این بخش نمایش داده خواهد شد.
                </p>
              </li>
            ) : (
              agencyTours.map((t) => {
                const StatusIcon = STATUS_ICONS[t.status];
                const statusStyle = STATUS_STYLE[t.status];
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-night-100 dark:border-night-800 hover:shadow-card transition-all bg-night-50/30 dark:bg-night-800/20"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${statusStyle}`}>
                      <StatusIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-night-900 dark:text-white">{t.name}</h4>
                      <p className="text-[11px] text-night-500 dark:text-night-400">
                        {t.passengers.toLocaleString('fa-IR')} مسافر • {t.date}
                      </p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-[10px] text-night-400 dark:text-night-500">{t.revenue}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusStyle}`}>
                        {t.status}
                      </span>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
          <p className="mt-4 pt-4 border-t border-night-100 dark:border-night-800 text-[10px] text-night-400 dark:text-night-500">
            این پنل نمایشی است. داده‌ها نمونه هستند.
          </p>
        </div>
      </div>
    </section>
  );
}
