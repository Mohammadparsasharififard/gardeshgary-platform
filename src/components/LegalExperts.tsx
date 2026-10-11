import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Calendar, MapPin, Award, Briefcase, X, MessageSquare, Search, CheckCircle2,
  AlertTriangle, RefreshCw, Home
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { dataLoaders } from '@/lib/loaders';
import { useAuth } from '@/hooks/useAuth';

// Card shape the UI renders (mapped from the backend Lawyer model).
interface Expert {
  id: number;
  name: string;
  specialty: string;
  badges: string[];
  rating: number;
  reviews: number;
  experience: string;
  city: string;
  avatar: string;
  bio: string;
}

// Filter tabs for the directory (badge-based).
const EXPERT_FILTERS = [
  'همه',
  'متخصص قراردادهای اقامتی',
  'حقوق بین‌الملل گردشگری',
  'حقوق مصرف‌کننده',
  'متخصص بیمه مسافرتی',
  'متخصص حقوق هواپیمایی',
];

export default function LegalExperts() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [filter, setFilter] = useState('همه');
  const [search, setSearch] = useState('');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedTime, setSelectedTime] = useState('شنبه ۱۰:۰۰');
  const [consultType, setConsultType] = useState<"IN_PERSON" | "PHONE" | "VIDEO">('PHONE');
  const [consultDesc, setConsultDesc] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load real lawyers from the backend (no static fallback — the directory
  // shows ONLY what the API returns, with clean empty/error states).
  const loadExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await dataLoaders.loadLawyers({ verified: true });
    if (loadError) {
      setError(loadError);
      setExperts([]);
    } else {
      // Map backend Lawyer type to the Expert shape the UI expects
      setExperts(
        (data || []).map((l) => ({
          id: Number(l.id.slice(-6).replace(/\D/g, '').slice(0, 6)) || 0,
          name: l.name,
          specialty: l.specialty,
          badges: l.badges,
          rating: l.rating,
          reviews: l.reviews,
          experience: l.experience,
          city: l.city,
          avatar: l.avatar || l.name.slice(0, 2),
          bio: l.bio,
        })),
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadExperts();
  }, [loadExperts]);

  const filtered = useMemo(() => {
    return experts.filter((e) => {
      const matchFilter = filter === 'همه' || e.badges.some((b) => b.includes(filter) || filter.includes(b));
      const matchSearch =
        search === '' ||
        e.name.includes(search) ||
        e.specialty.includes(search) ||
        e.city.includes(search);
      return matchFilter && matchSearch;
    });
  }, [filter, search, experts]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('برای رزرو مشاوره ابتدا وارد شوید', 'info');
      return;
    }
    if (!selectedExpert) return;

    // Convert selectedTime (e.g. "شنبه ۱۰:۰۰") to ISO — we use a simple
    // mapping: today + 2 days at the selected hour.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const hour = parseInt(selectedTime.match(/\d+/)?.[0] || '10', 10);
    tomorrow.setHours(hour, 0, 0, 0);

    setSubmitting(true);
    try {
      // Find the backend lawyer id from the experts array — we stored the id
      // as a Number above, but we need the string id. We kept the full list
      // in state by using the same `experts` array. To get the string id, we
      // reload from the backend.
      const { data: backendLawyers } = await dataLoaders.loadLawyers({ verified: true });
      const backendExpert = backendLawyers?.find((l) => l.name === selectedExpert.name);
      if (!backendExpert) {
        throw new Error('متخصص یافت نشد');
      }
      const { data, error } = await dataLoaders.createBooking({
        lawyerId: backendExpert.id,
        topic: consultDesc || `مشاوره ${selectedExpert.specialty}`,
        description: consultDesc,
        scheduledAt: tomorrow.toISOString(),
        durationMin: 60,
        type: consultType,
      });
      if (error) throw new Error(error);
      if (data) {
        setAppointmentCode(data.voucherCode);
        setBookingConfirmed(true);
        showToast(`نوبت مشاوره با ${selectedExpert.name} با کد ${data.voucherCode} با موفقیت رزرو گردید`, 'success');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطا در ثبت رزرو';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedExpert(null);
    setBookingConfirmed(false);
    setConsultDesc('');
    setAppointmentCode('');
  };

  const handleStartChatWithExpert = (expertName: string) => {
    const aiElement = document.getElementById('ai-assistant');
    if (aiElement) {
      aiElement.scrollIntoView({ behavior: 'smooth' });
      showToast(`جهت طرح سوال حقوقی مرتبط با تخصص ${expertName} به دستیار متصل شدید`, 'info');
    }
  };

  return (
    <section id="experts" className="py-24 aurora-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/15 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 rounded-full px-4 py-1.5 mb-4"
          >
            <Briefcase size={16} />
            <span className="text-sm font-semibold">شبکه وکلای تخصصی</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-3">جستجوی متخصصان حقوق گردشگری</h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-base">
            ارتباط مستقیم با وکلای پایه یک دادگستری و داوران مجرب در حوزه حقوق اقامتگاه، پرواز و تورهای گردشگری
          </p>
        </div>

        {/* Search Bar + Filter Tabs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در نام وکیل، شهر (تهران، اصفهان، شیراز...) یا تخصص..."
              aria-label="جستجوی وکیل، شهر یا تخصص"
              className="w-full pr-11 pl-4 py-3 bg-white/90 border border-navy-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {EXPERT_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-navy-900 text-white shadow-soft'
                  : 'bg-white/90 text-navy-600 hover:bg-navy-100 border border-navy-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Experts Grid — real API data only */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16" aria-live="polite">
            <span className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></span>
            <p className="text-sm text-navy-500 dark:text-navy-400">در حال بارگذاری متخصصان...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-8">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={26} className="text-red-500" />
            </div>
            <h4 className="text-base font-bold text-navy-800 dark:text-white mb-1.5">خطا در بارگذاری متخصصان</h4>
            <p className="text-sm text-navy-500 dark:text-navy-400 mb-5 leading-relaxed">{error}</p>
            <button
              onClick={() => void loadExperts()}
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 dark:bg-white dark:text-night-900 dark:hover:bg-night-100 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw size={14} />
              تلاش مجدد
            </button>
          </div>
        ) : experts.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-8">
            <div className="w-14 h-14 rounded-full bg-navy-50 dark:bg-night-800 border-2 border-dashed border-navy-200 dark:border-night-700 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={26} className="text-navy-300 dark:text-navy-600" />
            </div>
            <h4 className="text-base font-bold text-navy-800 dark:text-white mb-1.5">متخصصی ثبت نشده است</h4>
            <p className="text-sm text-navy-500 dark:text-navy-400 mb-5 leading-relaxed">هنوز وکیل متخصص حقوق گردشگری در پلتفرم ثبت نشده است.</p>
            <a
              href="#/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-glow"
            >
              <Home size={14} />
              بازگشت به خانه
            </a>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((expert) => (
              <motion.div
                key={expert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -6 }}
                className="group relative glass-card bg-white/90 rounded-3xl shadow-card border border-white/60 hover:shadow-premium hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Avatar + Rating */}
                  <div className="flex items-start justify-between mb-4 p-6 pb-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 bg-gradient-to-br from-navy-800 to-navy-950 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-soft">
                        {expert.avatar}
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-navy-900 text-sm sm:text-base">{expert.name}</h3>
                        <p className="text-xs text-navy-400 mt-0.5">{expert.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-xl">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-800">{expert.rating}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {expert.bio && (
                    <p className="px-6 text-xs text-navy-600 line-clamp-2 my-2 leading-relaxed">
                      {expert.bio}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4 px-6 pt-1">
                    {expert.badges.map((badge) => (
                      <span key={badge} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-lg">
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Info stats */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-navy-50 px-6">
                    <div className="flex items-center justify-between text-xs text-navy-600">
                      <span className="flex items-center gap-1.5">
                        <Award size={14} className="text-emerald-600" /> {expert.reviews} نظر موکلین
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-emerald-600" /> {expert.experience} سابقه
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-600" /> {expert.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 px-6 pb-6 pt-1">
                  <button
                    onClick={() => { setSelectedExpert(expert); setBookingConfirmed(false); }}
                    aria-label={`رزرو وقت مشاوره با ${expert.name}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
                  >
                    <Calendar size={15} />
                    رزرو وقت مشاوره
                  </button>
                  <button
                    onClick={() => handleStartChatWithExpert(expert.name)}
                    title="مشاوره با دستیار هوشمند پیرامون پرونده"
                    aria-label={`مشاوره با دستیار هوشمند پیرامون پرونده ${expert.name}`}
                    className="flex items-center justify-center w-11 h-11 bg-navy-50 hover:bg-navy-100 text-navy-700 rounded-xl transition-all border border-navy-100"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-navy-500 dark:text-navy-400 max-w-md mx-auto leading-relaxed">
                  متخصصی مطابق جستجو یا دسته‌بندی انتخابی شما یافت نشد.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedExpert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
          onClick={handleCloseModal}
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`رزرو مشاوره`}
            className="bg-white dark:bg-night-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center text-white font-extrabold text-base">
                  {selectedExpert.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{selectedExpert.name}</h3>
                  <p className="text-emerald-300 text-xs">{selectedExpert.specialty} • {selectedExpert.city}</p>
                </div>
              </div>
              <button onClick={handleCloseModal} aria-label="بستن پنجره رزرو مشاوره" className="text-navy-300 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!bookingConfirmed ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-2">انتخاب بازه زمانی مشاوره:</label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
                      {['شنبه ۱۰:۰۰', 'شنبه ۱۴:۰۰', 'یکشنبه ۱۱:۰۰', 'یکشنبه ۱۶:۰۰', 'دوشنبه ۱۰:۰۰', 'دوشنبه ۱۴:۰۰'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-2.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                            selectedTime === time
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                              : 'border-navy-100 text-navy-600 hover:bg-navy-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">نوع مشاوره مورد نظر:</label>
                    <select
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value)}
                      aria-label="نوع مشاوره مورد نظر"
                      className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-xs sm:text-sm text-navy-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="تلفنی">مشاوره تلفنی مستقیم (۳۰ دقیقه)</option>
                      <option value="ویدیویی">جلسه تصویری آنلاین و بررسی اسناد (۴۵ دقیقه)</option>
                      <option value="حضوری">مشاوره حضوری در دفتر وکالت (۱ ساعت)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">خلاصه پرونده یا سوال حقوقی:</label>
                    <textarea
                      rows={3}
                      value={consultDesc}
                      onChange={(e) => setConsultDesc(e.target.value)}
                      placeholder="موضوع شکایت یا اختلاف خود را به صورت کوتاه شرح دهید..."
                      aria-label="خلاصه پرونده یا سوال حقوقی"
                      className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
                  >
                    تأیید و دریافت برگه رزرو
                  </button>
                </form>
              ) : (
                /* Confirmed Voucher Slip */
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-navy-900">نوبت مشاوره با موفقیت ثبت شد</h4>
                    <p className="text-xs text-navy-500 mt-1">پیامک حاوی لینک جلسه و شماره تماس به زودی ارسال می‌شود</p>
                  </div>

                  <div className="bg-navy-50 p-4 rounded-2xl border border-navy-200 text-right space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-navy-400">کد رهگیری نوبت:</span>
                      <span className="font-mono font-bold text-emerald-700">{appointmentCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-400">مشاور پرونده:</span>
                      <span className="font-bold text-navy-800">{selectedExpert.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-400">زمان هماهنگ‌شده:</span>
                      <span className="font-bold text-navy-800">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-400">نوع جلسه:</span>
                      <span className="font-bold text-navy-800">{consultType}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    بستن
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
