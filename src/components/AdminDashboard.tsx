import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, AlertTriangle, CheckCircle, Building, Gavel,
  Shield, Activity, TrendingUp, TrendingDown, BarChart3, Inbox, type LucideIcon,
} from 'lucide-react';
import { adminStats as staticStats, adminActivities as staticActivities, type AdminStat } from '@/data';
import { dataLoaders, type AdminStat as ApiStat, type AdminActivity as ApiActivity } from '@/lib/loaders';
import { useAuth } from '@/hooks/useAuth';

const STAT_ICONS: Record<string, LucideIcon> = {
  Users, FileText, AlertTriangle, CheckCircle, Building, Gavel,
};

// ─── Distinct icon colors per stat type ───
const STAT_ICON_COLORS: Record<string, string> = {
  Users: 'bg-jade-50 dark:bg-jade-900/30 text-jade-600 dark:text-jade-400',
  FileText: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
  AlertTriangle: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  CheckCircle: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  Building: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  Gavel: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
};

// ─── Trend badges with strong contrast ───
const TREND_STYLE = {
  up: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/50',
  down: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700/50',
  neutral: 'text-navy-600 dark:text-navy-300 bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700',
};

// ─── Activity type badges with distinct, high-contrast colors ───
const ACTIVITY_TYPE_STYLE: Record<string, { color: string; label: string }> = {
  login: { color: 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 border border-navy-200 dark:border-navy-700', label: 'ورود' },
  register: { color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50', label: 'ثبت‌نام' },
  claim: { color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50', label: 'شکایت' },
  consult: { color: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700/50', label: 'مشاوره' },
  content: { color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50', label: 'محتوا' },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStat[]>(staticStats);
  const [activities, setActivities] = useState<typeof staticActivities>(staticActivities);

  // Load real stats + activities from the backend on mount
  useEffect(() => {
    void (async () => {
      const [{ data: statsData }, { data: activitiesData }] = await Promise.all([
        dataLoaders.loadAdminStats(),
        dataLoaders.loadAdminActivities(),
      ]);
      if (statsData) {
        // Map API stats to AdminStat shape
        const mapped: AdminStat[] = (statsData as ApiStat[]).map((s) => ({
          id: s.id as never,
          icon: s.icon as never,
          label: s.label,
          value: s.value,
          change: s.change,
          trend: s.trend as never,
        }));
        setStats(mapped);
      }
      if (activitiesData && activitiesData.length > 0) {
        const mapped = (activitiesData as ApiActivity[]).map((a) => ({
          id: a.id,
          type: a.type as never,
          action: a.action,
          user: a.user,
          role: a.role as never,
          timestamp: a.timestamp,
        }));
        setActivities(mapped);
      }
    })();
  }, []);

  return (
    <section id="admin-dashboard" className="py-12 px-4 sm:px-6 lg:px-8">
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
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold mb-1 text-shadow-premium">پنل مدیریت سیستم</h2>
              <p className="text-sm text-night-200">
                خوش آمدید، {user?.name ?? 'مدیر'} — {user?.roleLabel ?? 'مدیر سیستم'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.length === 0 ? (
            <div className="col-span-2 lg:col-span-3 bg-white dark:bg-night-900 rounded-2xl border border-dashed border-night-200 dark:border-night-700 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-jade-50 dark:bg-jade-900/30 border border-jade-200 dark:border-jade-700/50 flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={26} className="text-jade-600 dark:text-jade-400" />
              </div>
              <h3 className="text-sm font-bold text-night-900 dark:text-white mb-1">آمار در حال راه‌اندازی است</h3>
              <p className="text-[11px] text-night-500 dark:text-night-300">پس از فعال‌سازی سرویس‌ها، آمار پنل در این بخش نمایش داده خواهد شد.</p>
            </div>
          ) : (
            stats.map((stat, i) => {
              const Icon = STAT_ICONS[stat.icon] || BarChart3;
              const iconColor = STAT_ICON_COLORS[stat.icon] || STAT_ICON_COLORS.Users;
              const trend = TREND_STYLE[stat.trend];
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-5 card-hover-v2"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${trend}`}>
                      {stat.trend === 'up' ? <TrendingUp size={10} /> : stat.trend === 'down' ? <TrendingDown size={10} /> : null}
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-night-900 dark:text-white tabular-nums mb-1">{stat.value}</div>
                  <p className="text-xs text-night-500 dark:text-night-300 font-medium">{stat.label}</p>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Recent activity + quick actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-night-900 dark:text-white flex items-center gap-2">
                <Activity size={16} className="text-jade-600 dark:text-jade-400" />
                فعالیت‌های اخیر
              </h3>
              <span className="text-[10px] text-night-400 dark:text-night-500 bg-night-50 dark:bg-night-800 px-2 py-0.5 rounded-full">زنده</span>
            </div>
            <ul className="space-y-2">
              {activities.length === 0 ? (
                <li className="flex flex-col items-center justify-center text-center py-10 px-6">
                  <div className="w-14 h-14 rounded-2xl bg-night-50 dark:bg-night-800 border-2 border-dashed border-night-200 dark:border-night-700 flex items-center justify-center mb-3">
                    <Inbox size={26} className="text-night-300 dark:text-night-600" />
                  </div>
                  <p className="text-sm font-bold text-night-700 dark:text-night-200 mb-1">فعالیتی ثبت نشده است</p>
                  <p className="text-[11px] text-night-400 dark:text-night-500 leading-relaxed">رویدادهای پنل پس از راه‌اندازی در این بخش فهرست خواهند شد.</p>
                </li>
              ) : (
                activities.map((a) => {
                  const style = ACTIVITY_TYPE_STYLE[a.type] || ACTIVITY_TYPE_STYLE.content;
                  return (
                    <li key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-night-50/40 dark:bg-night-800/30 hover:bg-night-50 dark:hover:bg-night-800/50 transition-colors">
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ${style.color}`}>{style.label}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-night-900 dark:text-white">{a.action}</p>
                        <p className="text-[10px] text-night-500 dark:text-night-400">{a.user} • {a.role}</p>
                      </div>
                      <span className="text-[10px] text-night-400 dark:text-night-500 flex-shrink-0 tabular-nums">{a.timestamp}</span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-5 shadow-card">
            <h3 className="text-sm font-bold text-night-900 dark:text-white mb-4">اقدامات سریع</h3>
            <div className="space-y-2">
              {[
                { label: 'مدیریت کاربران', icon: Users, color: 'text-jade-600 dark:text-jade-400' },
                { label: 'مدیریت محتوا', icon: FileText, color: 'text-sky-600 dark:text-sky-400' },
                { label: 'مدیریت آژانس‌ها', icon: Building, color: 'text-amber-600 dark:text-amber-400' },
                { label: 'گزارش‌ها', icon: Activity, color: 'text-purple-600 dark:text-purple-400' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-night-100 dark:border-night-800 hover:border-jade-300 dark:hover:border-jade-700/50 hover:bg-jade-50/40 dark:hover:bg-night-800/50 transition-all text-right btn-press"
                  >
                    <Icon size={16} className={action.color} />
                    <span className="text-xs font-semibold text-night-700 dark:text-night-200">{action.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 pt-4 border-t border-night-100 dark:border-night-800 text-[10px] text-night-400 dark:text-night-500 leading-relaxed">
              این پنل نمایشی است. داده‌ها نمونه هستند.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
