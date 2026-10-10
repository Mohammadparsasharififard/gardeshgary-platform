import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Plane, Hotel, Compass, CheckCircle2, Sparkles, Scale, ShieldAlert
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import PrintButton from '@/components/PrintButton';

type CalculatorTab = 'flight' | 'hotel' | 'tour';

export default function CompensationCalculator() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<CalculatorTab>('flight');

  // Flight Delay States
  const [flightDelayHours, setFlightDelayHours] = useState<number>(5.5);
  const [flightTicketPrice, setFlightTicketPrice] = useState<number>(2800000);
  const [isFlightCancelled, setIsFlightCancelled] = useState<boolean>(false);
  const [isOvernight, setIsOvernight] = useState<boolean>(false);

  // Hotel Cancellation States
  const [hotelTotalAmount, setHotelTotalAmount] = useState<number>(6000000);
  const [hotelNights, setHotelNights] = useState<number>(3);
  const [hotelCancelHours, setHotelCancelHours] = useState<number>(36);
  const [hotelForceMajeure, setHotelForceMajeure] = useState<boolean>(false);

  // Tour Cancellation States
  const [tourTotalAmount, setTourTotalAmount] = useState<number>(12000000);
  const [tourCancelDays, setTourCancelDays] = useState<number>(10);
  const [tourForceMajeure, setTourForceMajeure] = useState<boolean>(false);

  // Flight calculations
  const calculateFlight = () => {
    let refundAmount = 0;
    let compensationAmount = 0;
    const obligations: string[] = [];
    let legalRule = '';

    if (isFlightCancelled) {
      refundAmount = flightTicketPrice;
      compensationAmount = Math.round(flightTicketPrice * 0.3);
      obligations.push('استرداد ۱۰۰٪ بهای بلیت بدون هرگونه کسر جریمه');
      obligations.push('پرداخت غرامت نقدی معادل ۳۰٪ قیمت بلیت به مسافر');
      obligations.push('تأمین بلیت پرواز جایگزین در اولین فرصت در صورت تمایل مسافر');
      legalRule = 'ماده ۱۰ دستورالعمل حقوق مسافر در پروازهای داخلی';
    } else if (flightDelayHours < 2) {
      obligations.push('تکلیف قانونی خاصی تعریف نشده است (ارائه اطلاعات پرواز)');
      legalRule = 'ماده ۹ بند ۱ دستورالعمل هوانوردی';
    } else if (flightDelayHours >= 2 && flightDelayHours < 4) {
      obligations.push('پذیرایی مناسب سبک (نوشیدنی و میان‌وعده بسته به ساعت)');
      obligations.push('امکان برقراری تماس تلفنی یا ارسال پیامک رایگان به مقصد');
      legalRule = 'ماده ۹ بند ۲ دستورالعمل هوانوردی';
    } else if (flightDelayHours >= 4 && flightDelayHours < 5) {
      refundAmount = flightTicketPrice; // In case passenger cancels
      obligations.push('پذیرایی کامل با وعده غذایی گرم متناسب با ساعت');
      obligations.push('حق انصراف مسافر از پرواز با استرداد ۱۰۰٪ وجه بلیت بدون جریمه');
      obligations.push('امکان انتقال به پرواز سایر ایرلاین‌ها بدون پرداخت مابه‌التفاوت');
      legalRule = 'ماده ۹ بند ۳ دستورالعمل هوانوردی';
    } else {
      // 5+ hours
      refundAmount = flightTicketPrice;
      compensationAmount = Math.round(flightTicketPrice * 0.3);
      obligations.push('استرداد کامل وجه بلیت در صورت انصراف مسافر');
      obligations.push('پرداخت ۳۰٪ جریمه نقدی علاوه بر استرداد وجه');
      obligations.push('ارائه وعده غذایی کامل و پذیرایی مداوم');
      if (isOvernight || flightDelayHours >= 8) {
        obligations.push('اسکان رایگان در هتل مناسب به همراه ترانسفر فرودگاهی رفت و برگشت');
      }
      legalRule = 'ماده ۹ بند ۴ و تبصره ۲ دستورالعمل حقوق مسافر هوانوردی';
    }

    return {
      refundAmount,
      compensationAmount,
      totalCashback: refundAmount + compensationAmount,
      obligations,
      legalRule,
    };
  };

  // Hotel calculations
  const calculateHotel = () => {
    const oneNightPrice = hotelTotalAmount / Math.max(1, hotelNights);
    let penaltyAmount = 0;
    let penaltyPercent = 0;
    let ruleDesc = '';

    if (hotelForceMajeure) {
      penaltyPercent = 0;
      penaltyAmount = 0;
      ruleDesc = 'شرایط فورس‌ماژور (بیماری حاد/مسدودی راه‌ها): استرداد کامل ۱۰۰٪ بدون هیچ جریمه';
    } else if (hotelCancelHours > 72) {
      penaltyPercent = 0;
      penaltyAmount = 0;
      ruleDesc = 'انصراف بیش از ۷۲ ساعت قبل از ساعت ۱۴ روز ورود: استرداد ۱۰۰٪ بدون هیچ جریمه';
    } else if (hotelCancelHours > 48 && hotelCancelHours <= 72) {
      penaltyPercent = 20;
      penaltyAmount = Math.round(oneNightPrice * 0.2);
      ruleDesc = 'بین ۴۸ تا ۷۲ ساعت قبل: کسر ۲۰٪ هزینه فقط یک شب اقامت';
    } else if (hotelCancelHours > 24 && hotelCancelHours <= 48) {
      penaltyPercent = 50;
      penaltyAmount = Math.round(oneNightPrice * 0.5);
      ruleDesc = 'بین ۲۴ تا ۴۸ ساعت قبل: کسر ۵۰٪ هزینه فقط یک شب اقامت';
    } else {
      penaltyPercent = 100;
      penaltyAmount = Math.round(oneNightPrice);
      ruleDesc = 'کمتر از ۲۴ ساعت قبل: کسر ۱۰۰٪ هزینه شب اول؛ کلیه شب‌های بعدی ۱۰۰٪ مسترد می‌گردند';
    }

    const refundableAmount = Math.max(0, hotelTotalAmount - penaltyAmount);

    return {
      penaltyAmount,
      refundableAmount,
      penaltyPercent,
      ruleDesc,
      oneNightPrice,
      legalRule: 'ماده ۳ بخشنامه شماره ۱۴۰۰/۴۳۹۸ معاونت گردشگری کشور',
    };
  };

  // Tour calculations
  const calculateTour = () => {
    let penaltyPercent = 0;
    let ruleDesc = '';

    if (tourForceMajeure) {
      penaltyPercent = 0;
      ruleDesc = 'شرایط بحرانی و فورس‌ماژور مصوب: استرداد ۱۰۰٪ وجوه بدون کسر هرگونه کارمزد';
    } else if (tourCancelDays > 30) {
      penaltyPercent = 5;
      ruleDesc = 'بیش از ۳۰ روز مانده به حرکت: کسر ۵٪ کارمزد اداری';
    } else if (tourCancelDays >= 15 && tourCancelDays <= 30) {
      penaltyPercent = 15;
      ruleDesc = 'بین ۱۵ تا ۳۰ روز مانده به حرکت: کسر ۱۵٪ کل بهای تور';
    } else if (tourCancelDays >= 7 && tourCancelDays < 15) {
      penaltyPercent = 30;
      ruleDesc = 'بین ۷ تا ۱۴ روز مانده به حرکت: کسر ۳۰٪ کل بهای تور';
    } else if (tourCancelDays >= 3 && tourCancelDays < 7) {
      penaltyPercent = 50;
      ruleDesc = 'بین ۳ تا ۶ روز مانده به حرکت: کسر ۵۰٪ کل بهای تور';
    } else {
      penaltyPercent = 70;
      ruleDesc = 'کمتر از ۷۲ ساعت مانده به آغاز تور: کسر ۷۰٪ بهای تور (مگر بلیت‌های قطعی غیرقابل استرداد)';
    }

    const penaltyAmount = Math.round((tourTotalAmount * penaltyPercent) / 100);
    const refundableAmount = Math.max(0, tourTotalAmount - penaltyAmount);

    return {
      penaltyPercent,
      penaltyAmount,
      refundableAmount,
      ruleDesc,
      legalRule: 'ماده ۱۱ آیین‌نامه اجرایی قانون دفاتر سیاحتی و گردشگری',
    };
  };

  const flightResult = calculateFlight();
  const hotelResult = calculateHotel();
  const tourResult = calculateTour();

  const handleSendToAI = (text: string) => {
    const aiElement = document.getElementById('ai-assistant');
    if (aiElement) {
      aiElement.scrollIntoView({ behavior: 'smooth' });
      showToast(`موضوع «${text}» جهت بررسی حقوقی به دستیار هوشمند ارسال شد`, 'success');
    }
  };

  return (
    <section id="calculator" className="py-24 relative overflow-hidden bg-gradient-to-b from-navy-950/20 via-white/50 to-navy-50/50">
      {/* Decorative background glows */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-300/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-300/15 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 text-emerald-800 rounded-full px-4 py-1.5 mb-4"
          >
            <Calculator size={16} className="text-emerald-600" />
            <span className="text-xs font-bold">سامانه اختصاصی محاسبات حقوقی</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            محاسبه‌گر هوشمند خسارت و استرداد وجه
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            محاسبه دقیق میزان غرامت، سهم جریمه و مبلغ قابل استرداد مطابق آخرین بخشنامه‌ها و مقررات سازمان هواپیمایی و وزارت میراث فرهنگی
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="glass bg-white/85 rounded-3xl shadow-premium border border-white/60 overflow-hidden">
          {/* Top Category Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-navy-100 bg-navy-50/60 p-2 gap-2">
            <button
              onClick={() => setActiveTab('flight')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'flight'
                  ? 'bg-white text-emerald-700 shadow-card border border-emerald-100'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-white/50'
              }`}
            >
              <Plane size={18} className={activeTab === 'flight' ? 'text-emerald-600' : 'text-navy-400'} />
              <span>تأخیر و کنسلی پرواز</span>
            </button>

            <button
              onClick={() => setActiveTab('hotel')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'hotel'
                  ? 'bg-white text-emerald-700 shadow-card border border-emerald-100'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-white/50'
              }`}
            >
              <Hotel size={18} className={activeTab === 'hotel' ? 'text-emerald-600' : 'text-navy-400'} />
              <span>کنسلی هتل و اقامتگاه</span>
            </button>

            <button
              onClick={() => setActiveTab('tour')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'tour'
                  ? 'bg-white text-emerald-700 shadow-card border border-emerald-100'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-white/50'
              }`}
            >
              <Compass size={18} className={activeTab === 'tour' ? 'text-emerald-600' : 'text-navy-400'} />
              <span>کنسلی تور و گشت</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* TAB 1: FLIGHT DELAY CALCULATOR */}
              {activeTab === 'flight' && (
                <motion.div
                  key="flight-calc"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left: Inputs */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-navy-800">میزان تأخیر پرواز:</label>
                        <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                          {flightDelayHours} ساعت
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="14"
                        step="0.5"
                        value={flightDelayHours}
                        disabled={isFlightCancelled}
                        aria-label="ساعت تأخیر پرواز"
                        onChange={(e) => setFlightDelayHours(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-navy-100 rounded-lg disabled:opacity-40"
                      />
                      <div className="flex justify-between text-[11px] text-navy-400 mt-1">
                        <span>۳۰ دقیقه</span>
                        <span>۲ ساعت (پذیرایی)</span>
                        <span>۴ ساعت (حق انصراف)</span>
                        <span>۵+ ساعت (غرامت ۳۰٪)</span>
                        <span>۱۴ ساعت</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-navy-800 mb-2">قیمت هر بلیط پرواز (تومان):</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={flightTicketPrice}
                          onChange={(e) => setFlightTicketPrice(Math.max(0, parseInt(e.target.value) || 0))}
                          aria-label="قیمت هر بلیت پرواز به تومان"
                          className="w-full px-4 py-3 bg-navy-50/70 border border-navy-200 rounded-xl text-navy-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-navy-400">تومان</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {[1500000, 2800000, 4500000, 7000000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFlightTicketPrice(preset)}
                            className="text-xs bg-navy-100/60 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 rounded-lg text-navy-600 transition-colors"
                          >
                            {preset.toLocaleString('fa-IR')} تومان
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <label className="flex items-center gap-3 p-3.5 bg-navy-50/50 hover:bg-emerald-50/40 rounded-xl border border-navy-100 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={isFlightCancelled}
                          onChange={(e) => setIsFlightCancelled(e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded"
                        />
                        <span className="text-xs font-semibold text-navy-800">پرواز به کلی لغو (ابطال) شده است</span>
                      </label>

                      <label className="flex items-center gap-3 p-3.5 bg-navy-50/50 hover:bg-emerald-50/40 rounded-xl border border-navy-100 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={isOvernight}
                          onChange={(e) => setIsOvernight(e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded"
                        />
                        <span className="text-xs font-semibold text-navy-800">تأخیر شبانه / مسافران سرگردان تا بامداد</span>
                      </label>
                    </div>

                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <Scale className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-navy-600 leading-relaxed">
                        <span className="font-bold text-navy-800">مبنای قانونی محاسبه: </span>
                        {flightResult.legalRule} مصوب سازمان هواپیمایی کشوری.
                      </div>
                    </div>
                  </div>

                  {/* Right: Results Card */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-900 text-white p-6 sm:p-7 rounded-3xl shadow-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-amber-400" size={18} />
                        <h4 className="font-extrabold text-sm text-white">نتیجه برآورد حقوق قانونی مسافر</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                        محاسبه زنده
                      </span>
                    </div>

                    {/* Numeric breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">مبلغ استرداد بلیط در صورت انصراف:</span>
                        <span className="font-bold text-white text-sm">
                          {flightResult.refundAmount > 0 ? flightResult.refundAmount.toLocaleString('fa-IR') + ' تومان' : 'فاقد استرداد اجباری'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">غرامت نقدی مازاد (۳۰٪ قیمت بلیط):</span>
                        <span className="font-bold text-amber-400 text-sm">
                          {flightResult.compensationAmount > 0
                            ? `+ ${flightResult.compensationAmount.toLocaleString('fa-IR')} تومان`
                            : '۰ تومان'}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300">مجموع دریافتی بالقوه مسافر:</span>
                        <span className="text-xl font-extrabold text-emerald-400">
                          {flightResult.totalCashback.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    {/* Obligation checklist */}
                    <div className="mb-6">
                      <h5 className="text-xs font-bold text-navy-200 mb-2.5">تعهدات فوری و الزامی ایرلاین در فرودگاه:</h5>
                      <div className="space-y-2">
                        {flightResult.obligations.map((ob, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-navy-200">
                            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{ob}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSendToAI('تأخیر پرواز و مطالبه غرامت ۳۰ درصدی')}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
                      >
                        <Sparkles size={14} />
                        تنظیم لایحه دفاعیه با هوش مصنوعی
                      </button>
                      <div className="flex items-center gap-2">
                        <PrintButton className="flex-1" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: HOTEL CANCELLATION CALCULATOR */}
              {activeTab === 'hotel' && (
                <motion.div
                  key="hotel-calc"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left: Inputs */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-navy-800">
                          زمان باقیمانده تا ساعت ۱۴ روز ورود به هتل:
                        </label>
                        <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                          {hotelCancelHours} ساعت
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="120"
                        step="2"
                        value={hotelCancelHours}
                        disabled={hotelForceMajeure}
                        aria-label="ساعت تا چک‌این هتل"
                        onChange={(e) => setHotelCancelHours(parseInt(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-navy-100 rounded-lg disabled:opacity-40"
                      />
                      <div className="flex justify-between text-[11px] text-navy-400 mt-1">
                        <span>۲ ساعت (کنسلی روز)</span>
                        <span>۲۴ ساعت (۵۰٪ شب اول)</span>
                        <span>۴۸ ساعت (۲۰٪ شب اول)</span>
                        <span>۷۲+ ساعت (بدون جریمه)</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-navy-800 mb-2">کل مبلغ رزرو (تومان):</label>
                        <input
                          type="number"
                          value={hotelTotalAmount}
                          onChange={(e) => setHotelTotalAmount(Math.max(0, parseInt(e.target.value) || 0))}
                          aria-label="کل مبلغ رزرو هتل به تومان"
                          className="w-full px-4 py-3 bg-navy-50/70 border border-navy-200 rounded-xl text-navy-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy-800 mb-2">تعداد شب‌های رزرو:</label>
                        <select
                          value={hotelNights}
                          onChange={(e) => setHotelNights(parseInt(e.target.value))}
                          aria-label="تعداد شب‌های رزرو هتل"
                          className="w-full px-4 py-3 bg-navy-50/70 border border-navy-200 rounded-xl text-navy-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                            <option key={n} value={n}>
                              {n} شب اقامت
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Force Majeure */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hotelForceMajeure}
                          onChange={(e) => setHotelForceMajeure(e.target.checked)}
                          className="w-4 h-4 accent-amber-600 rounded mt-1"
                        />
                        <div>
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <ShieldAlert size={15} className="text-amber-600" />
                            کنسلی به دلیل شرایط فورس‌ماژور (بیماری، مسدودی راه‌ها یا شرایط غیرمترقبه)
                          </span>
                          <p className="text-[11px] text-amber-800/80 mt-1">
                            طبق بخشنامه رسمی سازمان گردشگری، در صورت ارائه گواهی پزشک معتبر یا مسدودی راه پلیس، جریمه صفر است و استرداد ۱۰۰٪ وجه الزامی است.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <Scale className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-navy-600 leading-relaxed">
                        <span className="font-bold text-navy-800">قاعده طلایی بخشنامه ۱۴۰۰: </span>
                        جریمه کنسلی هتل صرفاً و منحصراً بر مبنای هزینه شب اول محاسبه می‌شود و هتل حق ندارد شب‌های بعدی را ضبط کند.
                      </div>
                    </div>
                  </div>

                  {/* Right: Hotel Results Card */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-900 text-white p-6 sm:p-7 rounded-3xl shadow-glow relative overflow-hidden">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                      <div className="flex items-center gap-2">
                        <Hotel className="text-amber-400" size={18} />
                        <h4 className="font-extrabold text-sm text-white">برآورد استرداد وجه هتل</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                        بخشنامه ۱۴۰۰
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">هزینه محاسبه‌شده هر شب:</span>
                        <span className="font-bold text-white text-sm">
                          {Math.round(hotelResult.oneNightPrice).toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">درصد جریمه از شب اول:</span>
                        <span className="font-bold text-red-400 text-sm">
                          {hotelResult.penaltyPercent}٪
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">مبلغ کسرشده جریمه هتل:</span>
                        <span className="font-bold text-red-400 text-sm">
                          {hotelResult.penaltyAmount.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300">مبلغ قطعی قابل استرداد به شما:</span>
                        <span className="text-xl font-extrabold text-emerald-400">
                          {hotelResult.refundableAmount.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                      <p className="text-xs text-navy-200 leading-relaxed">
                        <span className="text-amber-300 font-bold">شرح وضعیت: </span>
                        {hotelResult.ruleDesc}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleSendToAI('استرداد غیرقانونی هزینه هتل و عدم رعایت بخشنامه ۱۴۰۰')}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
                      >
                        <Sparkles size={14} />
                        ارسال به دستیار AI جهت تنظیم شکواییه
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: TOUR CANCELLATION CALCULATOR */}
              {activeTab === 'tour' && (
                <motion.div
                  key="tour-calc"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left: Inputs */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-navy-800">
                          تعداد روزهای باقیمانده تا تاریخ شروع تور:
                        </label>
                        <span className="text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                          {tourCancelDays} روز
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="45"
                        step="1"
                        value={tourCancelDays}
                        disabled={tourForceMajeure}
                        aria-label="روز تا شروع تور"
                        onChange={(e) => setTourCancelDays(parseInt(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-navy-100 rounded-lg disabled:opacity-40"
                      />
                      <div className="flex justify-between text-[11px] text-navy-400 mt-1">
                        <span>۱ روز (۷۰٪ جریمه)</span>
                        <span>۵ روز (۵۰٪)</span>
                        <span>۱۰ روز (۳۰٪)</span>
                        <span>۲۰ روز (۱۵٪)</span>
                        <span>۳۰+ روز (۵٪)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-navy-800 mb-2">مبلغ کل قرارداد تور (تومان):</label>
                      <input
                        type="number"
                        value={tourTotalAmount}
                        onChange={(e) => setTourTotalAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        aria-label="مبلغ کل قرارداد تور به تومان"
                        className="w-full px-4 py-3 bg-navy-50/70 border border-navy-200 rounded-xl text-navy-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Force Majeure */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tourForceMajeure}
                          onChange={(e) => setTourForceMajeure(e.target.checked)}
                          className="w-4 h-4 accent-amber-600 rounded mt-1"
                        />
                        <div>
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <ShieldAlert size={15} className="text-amber-600" />
                            کنسلی به دلیل حوادث غیرمترقبه یا لغو تور توسط خود آژانس
                          </span>
                          <p className="text-[11px] text-amber-800/80 mt-1">
                            در صورت لغو تور توسط آژانس بدون دلیل موجه، مسافر علاوه بر استرداد ۱۰۰٪ وجوه، مستحق دریافت ۲۰٪ غرامت مازاد نیز می‌باشد.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <Scale className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                      <div className="text-xs text-navy-600 leading-relaxed">
                        <span className="font-bold text-navy-800">ضوابط قانونی ابطال: </span>
                        آژانس موظف است حداکثر ظرف ۴۸ ساعت پس از اعلام کنسلی نسبت به تسویه‌حساب مالی اقدام نماید.
                      </div>
                    </div>
                  </div>

                  {/* Right: Tour Results Card */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-900 text-white p-6 sm:p-7 rounded-3xl shadow-glow relative overflow-hidden">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                      <div className="flex items-center gap-2">
                        <Compass className="text-amber-400" size={18} />
                        <h4 className="font-extrabold text-sm text-white">برآورد استرداد وجه تور</h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                        آیین‌نامه بند ب
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">درصد جریمه کسرشده:</span>
                        <span className="font-bold text-red-400 text-sm">
                          {tourResult.penaltyPercent}٪
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-navy-300">مبلغ ریالی جریمه انصراف:</span>
                        <span className="font-bold text-red-400 text-sm">
                          {tourResult.penaltyAmount.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300">مبلغ قابل استرداد به مسافر:</span>
                        <span className="text-xl font-extrabold text-emerald-400">
                          {tourResult.refundableAmount.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                      <p className="text-xs text-navy-200 leading-relaxed">
                        <span className="text-amber-300 font-bold">مقرره قانونی: </span>
                        {tourResult.ruleDesc}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleSendToAI('کنسلی تور و مطالبه استرداد وجه بر اساس جدول زمان‌بندی قانونی')}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
                      >
                        <Sparkles size={14} />
                        تنظیم لایحه استرداد با هوش مصنوعی
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

