import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Landmark, GraduationCap, Briefcase, Scale, Rocket,
  Plug, Play, Loader2, CheckCircle2, AlertCircle, Code2, Copy, Check,
  X, Send
} from 'lucide-react';
import { partners, apiTestEndpoints, apiMockResponses } from '@/data';
import { useToast } from '@/components/Toast';

const partnerIcons = [Landmark, GraduationCap, Rocket, Briefcase, Scale, Building2];

type TestStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Partners() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'partners' | 'sandbox'>('partners');
  const [testStatuses, setTestStatuses] = useState<Record<string, TestStatus>>({});
  const [testResults, setTestResults] = useState<Record<string, object>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // Partnership form states
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('آژانس مسافرتی');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleApiTest = (endpointId: string) => {
    setTestStatuses((prev) => ({ ...prev, [endpointId]: 'loading' }));

    setTimeout(() => {
      setTestStatuses((prev) => ({ ...prev, [endpointId]: 'success' }));
      setTestResults((prev) => ({ ...prev, [endpointId]: apiMockResponses[endpointId] || {} }));
      showToast('استعلام با موفقیت از سرور شبیه‌ساز انجام شد (پاسخ ۲۰۰ OK)', 'success');
    }, 1500);
  };

  const handleCopyJson = (endpointId: string) => {
    const res = testResults[endpointId];
    if (res) {
      navigator.clipboard?.writeText(JSON.stringify(res, null, 2));
      setCopiedId(endpointId);
      showToast('خروجی JSON با موفقیت کپی گردید', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactPhone.trim()) {
      showToast('لطفاً نام سازمان و شماره تماس را وارد فرمایید', 'error');
      return;
    }
    setShowPartnerModal(false);
    showToast(`درخواست همکاری سازمان «${orgName}» ثبت شد. کارشناسان ما ظرف ۲۴ ساعت تماس خواهند گرفت.`, 'success');
    setOrgName('');
    setContactName('');
    setContactPhone('');
  };

  return (
    <section id="about" className="py-24 aurora-bg relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px]"
      ></motion.div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/15 rounded-full blur-[120px]"
      ></motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-navy-100 text-navy-800 rounded-full px-4 py-1.5 mb-4"
          >
            <Building2 size={16} />
            <span className="text-sm font-semibold">همکاری‌های سازمانی و فناوری</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">اتصال به سامانه نهادها، دانشگاه‌ها و مراجع نظارتی</h2>
          <p className="text-navy-500 max-w-2xl mx-auto text-base">
            همکاری با مراجع قانونی، دانشگاه‌ها و مراکز نوآوری برای توسعه اکوسیستم خدمات حقوقی دیجیتال گردشگری
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'partners' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white/80 text-navy-600 hover:bg-navy-100 border border-navy-100'
            }`}
          >
            <Building2 size={16} />
            نهادها و سازمان‌های همکار
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'sandbox' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white/80 text-navy-600 hover:bg-navy-100 border border-navy-100'
            }`}
          >
            <Plug size={16} />
            محیط تست وب‌سرویس و API Sandbox
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'partners' && (
            <motion.div
              key="partners"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Partners Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {partners.map((partner, i) => {
                  const Icon = partnerIcons[i % partnerIcons.length];
                  return (
                    <motion.div
                      key={partner.short}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="group relative glass-card bg-gradient-to-br from-white/90 to-white/70 border border-white/60 rounded-3xl p-6 hover:shadow-premium hover:border-emerald-300 transition-all overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-br-full group-hover:from-emerald-500/20 transition-colors"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-navy-800 to-navy-950 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-soft">
                          <Icon size={26} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">{partner.short}</span>
                          </div>
                          <h3 className="font-extrabold text-navy-900 text-sm leading-snug mb-1">{partner.name}</h3>
                          <p className="text-xs text-navy-500 leading-relaxed">{partner.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Integration Banner */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-10 relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-8 sm:p-10 overflow-hidden border border-white/10 shadow-glow"
              >
                <div className="absolute inset-0 grid-overlay opacity-20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-right">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">آیا سازمان، آژانس یا نهاد شما آماده اتصال است؟</h3>
                    <p className="text-navy-200 text-xs sm:text-sm max-w-lg leading-relaxed">
                      سامانه‌های حقوقی، رزرو و گشت‌های خود را به پلتفرم ملی حقوق گردشگری متصل کنید و از مزایای حل اختلاف هوشمند بهره‌مند شوید.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPartnerModal(true)}
                    className="relative flex-shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-glow-lg hover:scale-105 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">درخواست اتصال و همکاری سازمانی</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'sandbox' && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass bg-white/90 rounded-3xl shadow-card border border-navy-100 overflow-hidden"
            >
              {/* Sandbox Header */}
              <div className="relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 px-6 py-5 flex items-center justify-between text-white overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-glow">
                    <Code2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">سامانه تست وب‌سرویس نهادها (API & Webhook Testing Sandbox)</h3>
                    <p className="text-navy-300 text-xs">محیط آزمایشی جهت شبیه‌سازی اتصال API به سامانه‌های ملی و نظارتی</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full font-mono">
                  Sandbox Active
                </span>
              </div>

              <div className="p-6 space-y-6">
                {apiTestEndpoints.map((endpoint) => {
                  const status = testStatuses[endpoint.id] || 'idle';
                  const result = testResults[endpoint.id];
                  return (
                    <div key={endpoint.id} className="border border-navy-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                      {/* Endpoint Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-navy-50/60">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-navy-900 text-sm mb-1">{endpoint.name}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>{endpoint.method}</span>
                            <code className="text-[11px] text-navy-600 font-mono bg-white px-2.5 py-0.5 rounded-md border border-navy-200 truncate">{endpoint.endpoint}</code>
                          </div>
                        </div>

                        <button
                          onClick={() => handleApiTest(endpoint.id)}
                          disabled={status === 'loading'}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-navy-300 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-105 whitespace-nowrap"
                        >
                          {status === 'loading' ? (
                            <><Loader2 size={14} className="animate-spin" /> در حال ارسال به سرور...</>
                          ) : (
                            <><Play size={14} /> تست استعلام هوشمند API</>
                          )}
                        </button>
                      </div>

                      {/* Result Display */}
                      <AnimatePresence>
                        {status === 'success' && result && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white border-t border-navy-100">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-600" />
                                  <span className="text-xs font-bold text-emerald-800">کد ۲۰۰ OK - زمان پاسخ: ۴۲ میلی‌ثانیه</span>
                                </div>

                                <button
                                  onClick={() => handleCopyJson(endpoint.id)}
                                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy-600 bg-navy-50 hover:bg-navy-100 px-2.5 py-1 rounded-lg border border-navy-200 transition-colors"
                                >
                                  {copiedId === endpoint.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                  <span>{copiedId === endpoint.id ? 'کپی شد' : 'کپی پاسخ JSON'}</span>
                                </button>
                              </div>

                              <div className="bg-navy-950 rounded-2xl p-4 overflow-x-auto shadow-inner">
                                <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed" dir="ltr">
                                  {JSON.stringify(result, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {status === 'idle' && (
                        <div className="p-3.5 bg-white border-t border-navy-100 flex items-center gap-2 text-navy-400 text-xs">
                          <AlertCircle size={14} />
                          <span>جهت شبیه‌سازی ارسال درخواست HTTP و بررسی ساختار داده، روی دکمه «تست استعلام هوشمند API» کلیک فرمایید</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Info Banner */}
                <div className="flex items-start gap-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                  <Plug size={20} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 mb-1">مشخصات فنی پروتکل یکپارچه‌سازی:</p>
                    <p className="text-xs text-navy-600 leading-relaxed">
                      این محیط آزمایشی بر پایه پروتکل RESTful JSON و استاندارد احراز هویت متقابل mTLS با توکن‌های رمزنگاری‌شده JWT پیاده‌سازی شده است. آژانس‌ها و شرکت‌های خدمات مسافرتی می‌توانند وب‌سرویس صدور قرارداد و استعلام دعاوی را مستقیماً در CRM یا نرم‌افزارهای خود فعال نمایند.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Institutional Partnership Modal */}
      {showPartnerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
          onClick={() => setShowPartnerModal(false)}
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-100">
              <h3 className="font-extrabold text-navy-900 text-base sm:text-lg">درخواست همکاری سازمانی</h3>
              <button
                onClick={() => setShowPartnerModal(false)}
                className="w-8 h-8 rounded-lg bg-navy-50 text-navy-500 hover:bg-navy-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePartnershipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1.5">نام سازمان، آژانس یا مؤسسه:</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="مثلاً: شرکت خدمات مسافرتی پرواز آسمان"
                  className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1.5">نوع مجموعه:</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-xs sm:text-sm text-navy-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="آژانس مسافرتی">آژانس مسافرتی و گردشگری (بند الف/ب/پ)</option>
                  <option value="هتل">هتل یا هولدینگ اقامتی</option>
                  <option value="دانشگاه">دانشگاه یا پژوهشکده حقوقی</option>
                  <option value="استارتاپ">استارتاپ یا سامانه رزرو آنلاین</option>
                  <option value="ارگان">نهاد دولتی یا حاکمیتی</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1.5">نام نماینده / رابط سازمانی:</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="نام و سمت سازمانی"
                  className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1.5">شماره تماس مستقیم یا همراه:</label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="0912XXXXXXX یا 021XXXXXXX"
                  className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-navy-600 bg-navy-50 hover:bg-navy-100 transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-glow flex items-center justify-center gap-1.5"
                >
                  <Send size={14} />
                  <span>ارسال درخواست رسمی</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
