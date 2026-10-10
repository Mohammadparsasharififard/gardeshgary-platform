import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, User, Briefcase, FileText, ClipboardList, Clock,
  Wallet, ShieldCheck, Star, Calendar, MessageSquare, Award
} from 'lucide-react';
import { userDashboardStats, expertDashboardStats } from '@/data';

export default function DashboardsPreviewSection() {
  const [activePanel, setActivePanel] = useState<'user' | 'expert'>('user');

  return (
    <section id="dashboards" className="py-24 relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute inset-0 grid-overlay opacity-25"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <LayoutDashboard size={16} className="text-emerald-400" />
            <span>معماری پنل‌های تخصصی کاربری</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            ساختار پنل کاربری و پنل متخصصان حقوقی
          </h2>
          <p className="text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            پیش‌نمایش ساختار UI/UX داشبورد اختصاصی گردشگران، آژانس‌ها و شبکه وکلای پایه یک دادگستری
          </p>
        </div>

        {/* Panel Switcher Tabs */}
        <div className="grid grid-cols-2 max-w-md mx-auto mb-10 bg-navy-950/80 p-1.5 rounded-2xl border border-white/10 gap-1 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActivePanel('user')}
            className={`py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activePanel === 'user'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-navy-300 hover:text-white'
            }`}
          >
            <User size={18} />
            <span>پنل اختصاصی کاربر / گردشگر</span>
          </button>

          <button
            onClick={() => setActivePanel('expert')}
            className={`py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activePanel === 'expert'
                ? 'bg-emerald-600 text-white shadow-glow'
                : 'text-navy-300 hover:text-white'
            }`}
          >
            <Briefcase size={18} />
            <span>پنل وکیل / متخصص حقوقی</span>
          </button>
        </div>

        {/* PANEL CONTENT PREVIEW */}
        {activePanel === 'user' ? (
          /* USER DASHBOARD PREVIEW */
          <motion.div
            key="user-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-8"
          >
            {/* Top User Profile Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-extrabold text-lg text-white shadow-glow">
                  MR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-white">محمد رضایی</h3>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> احراز شده در دولت هوشمند
                    </span>
                  </div>
                  <p className="text-xs text-navy-300 mt-1 font-mono">کد ملی: ۰۰۹۸۷۶۵۴۳۲ • عضویت سطح طلایی</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 p-3 rounded-2xl">
                <Wallet size={18} className="text-emerald-400" />
                <div>
                  <p className="text-[10px] text-navy-400">اعتبار کیف پول حقوقی</p>
                  <p className="font-bold text-emerald-300 text-sm">۲٬۵۰۰٬۰۰۰ تومان</p>
                </div>
              </div>
            </div>

            {/* User Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-navy-400 mb-2">
                  <span className="text-xs font-semibold">شکایات فعال</span>
                  <ClipboardList size={18} className="text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">{userDashboardStats.activeClaims}</p>
                <span className="text-[10px] text-emerald-400">در حال پیگیری در کمیته</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-navy-400 mb-2">
                  <span className="text-xs font-semibold">قراردادهای صادرشده</span>
                  <FileText size={18} className="text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white">{userDashboardStats.totalContracts}</p>
                <span className="text-[10px] text-amber-300">دارای امضای دیجیتال</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-navy-400 mb-2">
                  <span className="text-xs font-semibold">مشاوره‌های رزروشده</span>
                  <Calendar size={18} className="text-blue-400" />
                </div>
                <p className="text-2xl font-black text-white">{userDashboardStats.consultationsBooked}</p>
                <span className="text-[10px] text-blue-300">وکلای پایه یک</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-navy-400 mb-2">
                  <span className="text-xs font-semibold">استعلامات AI</span>
                  <MessageSquare size={18} className="text-purple-400" />
                </div>
                <p className="text-2xl font-black text-white">{userDashboardStats.aiQueriesCount}</p>
                <span className="text-[10px] text-purple-300">استخراج مستندات</span>
              </div>
            </div>

            {/* User Recent Activity */}
            <div>
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Clock size={15} className="text-emerald-400" />
                آخرین فعالیت‌های کاربر:
              </h4>
              <div className="space-y-2">
                {userDashboardStats.recentActivity.map((act, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl text-xs">
                    <span className="font-bold text-white">{act.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-navy-400">{act.date}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* EXPERT / LAWYER DASHBOARD PREVIEW */
          <motion.div
            key="expert-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-8"
          >
            {/* Top Expert Profile Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-extrabold text-lg text-white shadow-glow">
                  SK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-white">دکتر سیمین کریمی</h3>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Award size={12} /> وکیل پایه یک و داور ارشد
                    </span>
                  </div>
                  <p className="text-xs text-navy-300 mt-1 font-mono">پروانه وکالت: ۹۸۴۲۱/مرکز • تهران</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] text-navy-400">کارکرد ماه جاری</p>
                  <p className="font-extrabold text-emerald-400 text-sm">{expertDashboardStats.monthlyEarnings}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/30 p-3 rounded-2xl">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-amber-300">{expertDashboardStats.rating}</span>
                </div>
              </div>
            </div>

            {/* Expert Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <span className="text-xs text-navy-400 font-semibold block mb-1">پرونده‌های ارجاعی فعال</span>
                <p className="text-2xl font-black text-white">{expertDashboardStats.assignedDossiers}</p>
                <span className="text-[10px] text-emerald-400">در حال تنظیم لایحه</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <span className="text-xs text-navy-400 font-semibold block mb-1">مشاوره‌های آنلاین رزروشده</span>
                <p className="text-2xl font-black text-white">{expertDashboardStats.activeConsultations}</p>
                <span className="text-[10px] text-amber-300">این هفته</span>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl col-span-2 lg:col-span-1">
                <span className="text-xs text-navy-400 font-semibold block mb-1">نرخ رضایت موکلین</span>
                <p className="text-2xl font-black text-emerald-400">۹۹.۲٪</p>
                <span className="text-[10px] text-emerald-300">۱۵۶ نظر مثبت ثبت‌شده</span>
              </div>
            </div>

            {/* Expert Upcoming Appointments */}
            <div>
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Calendar size={15} className="text-amber-400" />
                وقت‌های مشاوره پیش‌رو:
              </h4>
              <div className="space-y-2">
                {expertDashboardStats.upcomingAppointments.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl text-xs">
                    <div>
                      <span className="font-bold text-white">{app.client}</span>
                      <p className="text-[11px] text-navy-400 mt-0.5">{app.topic}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-amber-300 font-medium">{app.time}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                        {app.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

