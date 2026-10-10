import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Check, ChevronLeft, MapPin, Hotel, Users, Eye, Printer, RotateCcw,
  Pen, ShieldCheck, Trash2, Award, Copy, Sparkles, QrCode
} from 'lucide-react';
import { contracts, contractTemplates } from '@/data';
import { useToast } from '@/components/Toast';
import { generateDocumentId } from '@/utils/id';

const iconMap: Record<string, typeof MapPin> = { MapPin, Hotel, Users };

const sampleDemoData: Record<string, Record<string, string>> = {
  'domestic-tour': {
    agency: 'آژانس خدمات مسافرتی و جهانگردی مهرگان پارس',
    agencyCode: 'MCTH-1403-9981',
    tourName: 'تور ویژه ۳ روزه کاشان، ابیانه و کویر مرنجاب',
    destination: 'کاشان و آران و بیدگل',
    startDate: '۱۴۰۳/۰۸/۲۵',
    endDate: '۱۴۰۳/۰۸/۲۸',
    passengerName: 'امیرحسین رضایی',
    passengerId: '۰۰۱۲۳۴۵۶۷۸',
    price: '۴٬۸۵۰٬۰۰۰',
    services: 'اتوبوس VIP ۲۵ نفره، اقامت هتل ۳ ستاره، تمامی وعده‌های غذایی، بیمه کامل و راهنمای رسمی',
  },
  'hotel-reservation': {
    hotelName: 'هتل ۵ ستاره بین‌المللی عباسی اصفهان',
    hotelStar: '۵ ستاره ممتاز',
    guestName: 'سرکار خانم دکتر مهسا احمدی',
    roomType: 'سوئیت صفوی ۲ تخته مشرف به باغ',
    checkIn: '۱۴۰۳/۰۹/۱۰ ساعت ۱۴:۰۰',
    checkOut: '۱۴۰۳/۰۹/۱۳ ساعت ۱۲:۰۰',
    nights: '۳ شب',
    price: '۱۵٬۳۰۰٬۰۰۰',
  },
  'agency-tourleader': {
    agency: 'شرکت خدمات مسافرتی آسمان آبی پایتخت',
    leaderName: 'دکتر بهنام ناصری',
    leaderCode: 'TL-1401-4439',
    tourName: 'تور اکوتوریسم و پیمایش جنگل ابر',
    destination: 'شاهرود، بسطام و علی‌آباد کتول',
    duration: '۴ شب و ۵ روز',
    fee: '۱۶٬۰۰۰٬۰۰۰',
    responsibilities: 'سرپرستی میدانی گروه، توجیه خطرات محیطی، هماهنگی اورژانس و هلال احمر و مستندسازی گشت‌ها',
  },
};

export default function ContractGenerator() {
  const { showToast } = useToast();
  const [selectedContract, setSelectedContract] = useState(contracts[0].id);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSig, setTypedSig] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const currentContract = contracts.find((c) => c.id === selectedContract)!;
  const fieldsPerStep = 4;
  const totalFormSteps = Math.ceil(currentContract.fields.length / fieldsPerStep);
  const totalSteps = totalFormSteps + 1; // +1 for signature step
  const currentFields = currentContract.fields.slice(step * fieldsPerStep, (step + 1) * fieldsPerStep);
  const isSignatureStep = step === totalFormSteps;

  const generatePreview = () => {
    let template = contractTemplates[selectedContract] || '';
    Object.entries(formData).forEach(([key, value]) => {
      template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '....................');
    });
    if (hasSignature) {
      const sigName = signatureMode === 'type' ? typedSig : '[امضای الکترونیکی رسمی ثبت‌شده]';
      template = template.replace(
        /امضای طرفین:[\s\S]*$/s,
        `امضای طرفین:\nطرف اول (مجری): [مهر و امضای دیجیتال تأییدشده]\nطرف دوم (کاربر): ${sigName}\nتاریخ ثبت و صدور: ${new Date().toLocaleDateString('fa-IR')}\nشناسه یکتای سند: ${generateDocumentId()}\n[تأیید شده با گواهی نماد اعتمادسازی پلتفرم ملی حقوق گردشگری]`
      );
    }
    return template;
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const fillDemoData = () => {
    const demo = sampleDemoData[selectedContract];
    if (demo) {
      setFormData(demo);
      showToast('اطلاعات نمونه با موفقیت در فرم بارگذاری شد', 'info');
    }
  };

  const resetForm = () => {
    setFormData({});
    setStep(0);
    setHasSignature(false);
    setTypedSig('');
    clearCanvas();
    showToast('فرم پاکسازی شد', 'info');
  };

  const isStepComplete = isSignatureStep
    ? hasSignature
    : currentFields.every((f) => formData[f.key]?.trim());

  // Canvas drawing
  useEffect(() => {
    if (isSignatureStep && signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isSignatureStep, signatureMode]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
    }
    setHasSignature(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatePreview());
    setCopied(true);
    showToast('متن کامل قرارداد کپی گردید', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generatePreview();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Gharardad-${selectedContract}-${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('فایل قرارداد با موفقیت تولید و دانلود شد', 'success');
  };

  return (
    <section id="contract-generator" className="py-24 aurora-bg relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 mb-4"
          >
            <FileText size={16} />
            <span className="text-sm font-semibold">سامانه صدور قرارداد استاندارد</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">تنظیم و صدور هوشمند قراردادهای گردشگری</h2>
          <p className="text-navy-500 max-w-2xl mx-auto text-base">
            قراردادهای مصوب سازمان گردشگری را مرحله به مرحله تکمیل کنید، امضای دیجیتال ثبت کرده و نسخه رسمی دریافت نمایید
          </p>
        </div>

        {/* Contract Type Selector */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {contracts.map((contract) => {
            const Icon = iconMap[contract.icon] || FileText;
            const isActive = selectedContract === contract.id;
            return (
              <button
                key={contract.id}
                onClick={() => {
                  setSelectedContract(contract.id);
                  setStep(0);
                  setFormData({});
                  setHasSignature(false);
                  setTypedSig('');
                }}
                className={`p-5 rounded-2xl border-2 transition-all text-right group ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-card'
                    : 'border-navy-100 bg-white/90 hover:border-emerald-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isActive ? 'bg-emerald-600 shadow-glow' : 'bg-navy-100 group-hover:bg-emerald-100'
                }`}>
                  <Icon size={24} className={isActive ? 'text-white' : 'text-navy-600 group-hover:text-emerald-700'} />
                </div>
                <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-emerald-800' : 'text-navy-800'}`}>{contract.name}</h3>
                <p className="text-xs text-navy-400">{contract.fields.length} فیلد مصوب + امضای دیجیتال</p>
              </button>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Form */}
          <motion.div
            key={selectedContract + '-form'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass bg-white/90 rounded-3xl shadow-card border border-navy-100 p-6 sm:p-7"
          >
            {/* Top quick action */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-navy-100">
              <span className="text-xs font-bold text-navy-800">فرم اطلاعات قرارداد</span>
              <button
                type="button"
                onClick={fillDemoData}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors font-semibold"
              >
                <Sparkles size={13} />
                تکمیل خودکار اطلاعات نمونه
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-emerald-600 text-white' :
                    i === step ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' :
                    'bg-navy-100 text-navy-400'
                  }`}>
                    {i < step ? <Check size={16} /> : i === totalSteps - 1 ? <Pen size={14} /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full ${i < step ? 'bg-emerald-500' : 'bg-navy-100'}`}></div>
                  )}
                </div>
              ))}
            </div>

            <h3 className="font-bold text-navy-900 mb-1 text-sm">
              {isSignatureStep ? 'مرحله نهایی: امضای دیجیتال طرفین' : `مرحله ${step + 1} از ${totalSteps}`}
            </h3>
            <p className="text-xs text-navy-400 mb-6">
              {isSignatureStep ? 'قرارداد را با رسم یا تایپ امضای الکترونیک تایید نهایی کنید' : 'اطلاعات خواسته‌شده زیر را با دقت تکمیل نمایید'}
            </p>

            {/* Form Fields or Signature Pad */}
            {!isSignatureStep ? (
              <div className="space-y-4">
                {currentFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">{field.label}:</label>
                    <input
                      type="text"
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      aria-label={field.label}
                      className="w-full px-4 py-3 bg-navy-50/70 border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-1 bg-navy-50 rounded-xl p-1 border border-navy-100">
                  <button
                    onClick={() => { setSignatureMode('draw'); clearCanvas(); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      signatureMode === 'draw' ? 'bg-white text-navy-900 shadow-soft' : 'text-navy-500'
                    }`}
                  >
                    <Pen size={14} /> رسم امضا با ماوس / لمس
                  </button>
                  <button
                    onClick={() => { setSignatureMode('type'); setHasSignature(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      signatureMode === 'type' ? 'bg-white text-navy-900 shadow-soft' : 'text-navy-500'
                    }`}
                  >
                    <FileText size={14} /> تایپ امضای دیجیتال
                  </button>
                </div>

                {/* Draw Mode */}
                {signatureMode === 'draw' ? (
                  <div>
                    <div className="relative border-2 border-dashed border-navy-300 rounded-2xl overflow-hidden bg-slate-50">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={180}
                        className="w-full h-44 cursor-crosshair touch-none"
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={stopDraw}
                        aria-label="کادر رسم امضای دیجیتال با ماوس یا لمس"
                        role="img"
                      ></canvas>
                      {!hasSignature && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-xs text-navy-400">در این کادر با ماوس یا انگشت امضا کنید</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={clearCanvas}
                      className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} /> پاک کردن امضا
                    </button>
                  </div>
                ) : (
                  /* Type Mode */
                  <div>
                    <input
                      type="text"
                      value={typedSig}
                      onChange={(e) => { setTypedSig(e.target.value); setHasSignature(e.target.value.trim().length > 0); }}
                      placeholder="نام و نام خانوادگی خود را برای امضا تایپ کنید..."
                      aria-label="نام و نام خانوادگی برای امضای دیجیتال"
                      className="w-full px-4 py-3 bg-navy-50 border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {typedSig && (
                      <div className="mt-3 p-4 bg-white border border-navy-100 rounded-xl text-center shadow-inner">
                        <p className="text-xl text-navy-900 font-bold tracking-wide italic">{typedSig}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Trust Badge */}
                {hasSignature && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4"
                  >
                    <ShieldCheck size={26} className="text-emerald-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-emerald-800">امضای دیجیتال با استاندارد PKI تایید گردید</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">شناسه امنیتی صدور سند با تاریخ امروز ثبت شد</p>
                    </div>
                    <Award size={22} className="text-emerald-500 flex-shrink-0" />
                  </motion.div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-navy-100">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex items-center gap-1 text-xs sm:text-sm text-navy-600 hover:text-navy-900 disabled:opacity-30 transition-all font-semibold"
              >
                <ChevronLeft size={16} />
                مرحله قبل
              </button>

              {step < totalSteps - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepComplete}
                  className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-200 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <span>مرحله بعد</span>
                  <ChevronLeft size={16} className="rotate-180" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-1 text-xs text-navy-500 hover:text-amber-600 transition-all"
                  >
                    <RotateCcw size={14} />
                    شروع دوباره
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!hasSignature}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-navy-200 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-glow"
                  >
                    <Download size={16} />
                    دریافت فایل قرارداد
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Contract Live Preview */}
          <motion.div
            key={selectedContract + '-preview'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass bg-white/90 rounded-3xl shadow-card border border-navy-100 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-emerald-400" />
                <h3 className="font-bold text-sm">پیش‌نمایش زنده سند رسمی</h3>
              </div>
              <div className="flex items-center gap-2">
                {hasSignature && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                    <ShieldCheck size={11} /> امضا شده
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  title="کپی متن قرارداد"
                  aria-label="کپی متن قرارداد"
                  className="text-navy-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={handlePrint}
                  title="چاپ مستقیم سند"
                  aria-label="چاپ مستقیم سند"
                  className="text-navy-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={handleDownload}
                  title="دانلود فایل متنی"
                  aria-label="دانلود فایل متنی قرارداد"
                  className="text-navy-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
              <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 min-h-[500px] relative border border-slate-200">
                {hasSignature && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
                    <QrCode size={12} /> گواهی اصالت سند
                  </div>
                )}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <FileText size={220} className="text-navy-900" />
                </div>
                <pre className="relative whitespace-pre-wrap text-xs text-navy-800 leading-relaxed font-sans">
                  {generatePreview()}
                </pre>
              </div>
            </div>

            <div className="border-t border-navy-100 px-6 py-3.5 glass bg-white flex items-center justify-between">
              <span className="text-xs text-navy-500 font-medium">پایش برخط ماده‌های ۵ گانه بخشنامه</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-emerald-700 font-bold">پیش‌نمایش فعال</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
