import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, Plus, CheckCircle2, Clock, FileSearch, Gavel, Search,
  BarChart3, TrendingUp, PieChart, FileText, ShieldCheck, X
} from 'lucide-react';
import { claimsData, claimSteps, analyticsData, analyticsMonthly, type ClaimItem } from '@/data';
import { useToast } from '@/components/Toast';
import { lazy, Suspense } from 'react';

// Code-split: the dossier overlay loads only when a claim is opened
const ClaimDossierModal = lazy(() => import('@/components/ClaimDossierModal'));
import { generateDossierId } from '@/utils/id';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  'بررسی اولیه': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' },
  'ارزیابی کارشناسی': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' },
  'ارسال به کمیته': { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', dot: 'bg-purple-500' },
  'حل‌وفصل شده': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
};

const stepIcons = [ClipboardList, FileSearch, Search, Gavel, CheckCircle2];

export default function ClaimsDashboard() {
  const { showToast } = useToast();
  const [claimsList, setClaimsList] = useState<ClaimItem[]>(claimsData);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem>(claimsData[0]);
  const [statusFilter, setStatusFilter] = useState<string>('همه');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);

  // New claim form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('تأخیر پرواز');
  const [newClaimant, setNewClaimant] = useState('');
  const [newDefendant, setNewDefendant] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredClaims = claimsList.filter((c) => {
    if (statusFilter === 'همه') return true;
    return c.status === statusFilter;
  });

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClaimant.trim()) {
      showToast('لطفاً عنوان شکایت و نام شاکی را وارد فرمایید', 'error');
      return;
    }

    const newClaimId = `CL-1403-00${claimsList.length + 1}`;
    const newClaimObj: ClaimItem = {
      id: newClaimId,
      title: newTitle,
      claimant: newClaimant,
      type: newType,
      status: 'بررسی اولیه',
      progress: 20,
      date: new Date().toLocaleDateString('fa-IR'),
      amount: newAmount ? `${newAmount} تومان` : 'در حال ارزیابی کارشناسی',
      defendant: newDefendant || 'آژانس / شرکت مربوطه',
      dossierNumber: generateDossierId(),
      courtBranch: 'کمیسیون بدوی رسیدگی به شکایات گردشگری',
      description: newDesc || 'شکایت جدید در سامانه ثبت گردید و جهت انطباق مدارک در نوبت کارشناسی اولیه قرار گرفت.',
    };

    setClaimsList([newClaimObj, ...claimsList]);
    setSelectedClaim(newClaimObj);
    setShowSubmitModal(false);

    // Reset fields
    setNewTitle('');
    setNewClaimant('');
    setNewDefendant('');
    setNewAmount('');
    setNewDesc('');

    showToast(`شکایت جدید با کد پیگیری ${newClaimId} با موفقیت ثبت شد`, 'success');
  };

  return (
    <section id="claims" className="py-24 aurora-bg relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-[100px]"
      ></motion.div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-0 w-96 h-96 bg-amber-200/15 rounded-full blur-[120px]"
      ></motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-navy-100 text-navy-700 rounded-full px-4 py-1.5 mb-4"
          >
            <ClipboardList size={16} />
            <span className="text-sm font-semibold">سامانه داوری و حل اختلاف</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">داشبورد پیگیری شکایات و ادعاها</h2>
          <p className="text-navy-500 max-w-2xl mx-auto text-base">
            سامانه شفاف پیگیری لحظه‌ای پرونده‌های دعاوی گردشگری با نمایش مرحله به مرحله روند دادرسی و حل‌وفصل
          </p>
        </div>

        {/* Analytics Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setAnimatedBars(true)}
          className="glass-card bg-white/80 rounded-3xl shadow-premium border border-white/40 p-6 sm:p-8 mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 bg-gradient-to-br from-navy-800 to-navy-950 rounded-2xl flex items-center justify-center shadow-soft">
                <BarChart3 size={22} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-navy-900 text-sm sm:text-base">داشبورد آماری پرونده‌های حقوق گردشگری</h3>
                <p className="text-xs text-navy-400">بیشترین علل دعاوی، حجم پرونده‌ها و روند ماهانه حل‌وفصل</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <TrendingUp size={14} className="text-emerald-600" /> ۸۷٪ نرخ موفقیت در مصالحه پرونده‌ها
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Cause Distribution - Horizontal Bars */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 mb-4 flex items-center gap-2">
                <PieChart size={15} className="text-emerald-600" />
                توزیع موضوعی علل شکایات ثبتی
              </h4>
              <div className="space-y-5">
                {analyticsData.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-semibold text-navy-800">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-navy-400">{item.count.toLocaleString('fa-IR')} پرونده</span>
                        <span className="text-xs sm:text-sm font-bold text-navy-900">{item.percentage}٪</span>
                      </div>
                    </div>
                    <div className="h-3 bg-navy-100/70 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={animatedBars ? { width: `${item.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
                        className={`h-full rounded-full ${item.color} relative shadow-sm`}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-navy-100">
                <div className="text-center p-3 rounded-2xl bg-navy-50/50">
                  <p className="text-xl sm:text-2xl font-black text-navy-900">۲٬۳۱۲</p>
                  <p className="text-[11px] text-navy-500 mt-0.5">کل پرونده‌های ثبتی</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-emerald-50/50">
                  <p className="text-xl sm:text-2xl font-black text-emerald-700">۸۷٪</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">مختومه با استرداد وجه</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-amber-50/50">
                  <p className="text-xl sm:text-2xl font-black text-amber-700">۱۴ روز</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">میانگین زمان دادرسی</p>
                </div>
              </div>
            </div>

            {/* Monthly Trend - Vertical Bars */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-emerald-600" />
                روند ماهانه حل‌وفصل دعاوی (۱۴۰۳)
              </h4>
              <div className="flex items-end justify-between gap-2 h-48 pt-4 bg-navy-50/30 p-4 rounded-2xl border border-navy-100">
                {analyticsMonthly.map((month, i) => {
                  const maxVal = Math.max(...analyticsMonthly.map((m) => m.value));
                  const heightPct = (month.value / maxVal) * 100;
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-navy-800">{month.value}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={animatedBars ? { height: `${heightPct}%` } : { height: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg min-h-[6px] relative group shadow-glow"
                      >
                        <div className="absolute inset-0 bg-white/10 rounded-t-lg"></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
                          {month.value} پرونده حل‌شده
                        </div>
                      </motion.div>
                      <span className="text-[10px] text-navy-500 font-medium">{month.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Claims List + Detail Tracker */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Claims List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-navy-900 text-sm">فهرست پرونده‌های جاری</h3>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-105"
              >
                <Plus size={15} />
                ثبت شکایت جدید
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-navy-100/60 rounded-xl">
              {['همه', 'بررسی اولیه', 'ارزیابی کارشناسی', 'ارسال به کمیته', 'حل‌وفصل شده'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === st ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredClaims.map((claim) => {
                const sc = statusColors[claim.status] || statusColors['بررسی اولیه'];
                const isSelected = selectedClaim.id === claim.id;
                return (
                  <button
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-card'
                        : 'border-navy-100 bg-white/90 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-bold text-sm leading-snug truncate ${isSelected ? 'text-emerald-800' : 'text-navy-900'}`}>
                          {claim.title}
                        </h4>
                        <p className="text-xs text-navy-400 mt-0.5">کد: {claim.id} • {claim.type}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${sc.bg} ${sc.text}`}>
                        {claim.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-navy-500 mt-2">
                      <span className="truncate max-w-[140px]">شاکی: {claim.claimant}</span>
                      <span className="font-bold text-navy-800">{claim.amount}</span>
                    </div>

                    <div className="mt-2.5 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${claim.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${claim.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      ></motion.div>
                    </div>
                  </button>
                );
              })}

              {filteredClaims.length === 0 && (
                <div className="p-8 text-center text-xs text-navy-400 bg-white/50 rounded-2xl border border-navy-100">
                  هیچ پرونده‌ای در این وضعیت یافت نشد
                </div>
              )}
            </div>
          </div>

          {/* Right: Selected Claim Detail Tracker */}
          <div className="lg:col-span-7">
            <div className="glass bg-white/90 rounded-3xl shadow-card border border-navy-100 p-6 sm:p-8 sticky top-24">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-navy-100">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-bold bg-navy-100 text-navy-700 px-2.5 py-0.5 rounded-md">
                      {selectedClaim.id}
                    </span>
                    <span className="text-[11px] text-navy-400">تاریخ ثبت: {selectedClaim.date}</span>
                  </div>
                  <h3 className="font-extrabold text-navy-900 text-base sm:text-lg leading-tight">
                    {selectedClaim.title}
                  </h3>
                </div>

                <div className="text-right sm:text-left bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl flex-shrink-0">
                  <p className="text-[11px] text-emerald-800 font-medium">مبلغ مورد مطالبه</p>
                  <p className="text-base sm:text-lg font-black text-emerald-700">{selectedClaim.amount}</p>
                </div>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="space-y-1 mb-6">
                {claimSteps.map((s, i) => {
                  const Icon = stepIcons[i];
                  const isComplete = selectedClaim.progress >= (s.step / claimSteps.length) * 100;
                  const isCurrent = !isComplete && selectedClaim.progress >= ((s.step - 1) / claimSteps.length) * 100;
                  return (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                            isComplete ? 'bg-emerald-600 text-white shadow-glow' :
                            isCurrent ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
                            'bg-navy-100 text-navy-400'
                          }`}
                        >
                          {isComplete ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                        </div>
                        {i < claimSteps.length - 1 && (
                          <div className={`w-0.5 h-10 ${isComplete ? 'bg-emerald-500' : 'bg-navy-200'}`}></div>
                        )}
                      </div>
                      <div className="pt-1.5 pb-5 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs sm:text-sm font-bold ${isComplete || isCurrent ? 'text-navy-900' : 'text-navy-400'}`}>
                            {s.label}
                          </h4>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Clock size={11} /> در جریان رسیدگی
                            </span>
                          )}
                          {isComplete && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 size={11} /> تکمیل شده
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-navy-500 mt-1">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-navy-100">
                <button
                  onClick={() => setShowDossierModal(true)}
                  className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
                >
                  <FileText size={15} />
                  <span>مشاهده پرونده کامل و مستندات</span>
                </button>

                <button
                  onClick={() => showToast('خلاصه آخرین اقدامات پرونده برای شما ارسال گردید', 'success')}
                  className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                >
                  <ShieldCheck size={15} />
                  <span>استعلام اصالت کد پیگیری</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dossier Modal */}
      {showDossierModal && selectedClaim && (
        <Suspense fallback={null}>
          <ClaimDossierModal
            claim={selectedClaim}
            onClose={() => setShowDossierModal(false)}
          />
        </Suspense>
      )}

      {/* Submit New Claim Modal */}
      {showSubmitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
          onClick={() => setShowSubmitModal(false)}
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-100">
              <h3 className="font-extrabold text-navy-900 text-lg">ثبت شکایت رسمی جدید</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-8 h-8 rounded-lg bg-navy-50 text-navy-500 hover:bg-navy-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-navy-500 mb-5 leading-relaxed">
              مشخصات تخلف را وارد نمایید. پس از ثبت، پرونده بلافاصله جهت بررسی کارشناسی در کمیسیون داوری درج می‌گردد.
            </p>

            <form onSubmit={handleCreateClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1.5">عنوان ادعا / موضوع تخلف:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثلاً: مطالبه خسارت تأخیر پرواز اهواز - تهران"
                  className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">نوع دعوا:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-xs sm:text-sm text-navy-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="تأخیر پرواز">تأخیر و کنسلی پرواز</option>
                    <option value="کنسلی تور">کنسلی و ابطال تور</option>
                    <option value="کیفیت خدمات">عدم تطابق هتل و خدمات</option>
                    <option value="استرداد هزینه">استرداد وجه در فورس‌ماژور</option>
                    <option value="حوادث و بیمه">حادثه و خسارت جانی/مالی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">مبلغ مورد مطالبه (تومان):</label>
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="مثلاً: ۳٬۵۰۰٬۰۰۰"
                    className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">نام و نام خانوادگی شاکی:</label>
                  <input
                    type="text"
                    required
                    value={newClaimant}
                    onChange={(e) => setNewClaimant(e.target.value)}
                    placeholder="نام شاکی"
                    className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">طرف شکایت (آژانس / ایرلاین):</label>
                  <input
                    type="text"
                    value={newDefendant}
                    onChange={(e) => setNewDefendant(e.target.value)}
                    placeholder="نام آژانس یا هتل"
                    className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1.5">شرح واقعه و مستندات:</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="جزئیات واقعه و علت ادعای خسارت را به اختصار شرح دهید..."
                  className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-navy-600 bg-navy-50 hover:bg-navy-100 transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-glow"
                >
                  ثبت رسمی شکایت
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
