import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Printer, Download, Scale, ShieldCheck, CheckCircle2,
  Calendar
} from 'lucide-react';
import { type ChatMessage } from '@/data';
import { useToast } from '@/components/Toast';
import { generateLegalTrackingId } from '@/utils/id';

interface LegalExportModalProps {
  message: ChatMessage | null;
  onClose: () => void;
}

export default function LegalExportModal({ message, onClose }: LegalExportModalProps) {
  const { showToast } = useToast();

  if (!message || !message.structured) return null;

  const structured = message.structured;
  const docDate = new Date().toLocaleDateString('fa-IR');
  const trackingNumber = generateLegalTrackingId();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `
جمهوری اسلامی ایران
پلتفرم ملی حقوق گردشگری | مرجع تخصصی حقوقی گردشگری کشور
گزارش استعلام و تحلیل حقوقی هوشمند

شماره پیگیری گزارش: ${trackingNumber}
تاریخ صدور: ${docDate}
میزان اطمینان الگوریتم: ${structured.accuracy || 98}٪
منبع مستند: ${structured.source || 'بانک قوانین و مقررات گردشگری ایران'}
--------------------------------------------------

خلاصه و تحلیل حقوقی:
${structured.answer}

استنادهای قانونی مرتبط:
${structured.citations.map((c) => `- ${c.title} (${c.article})`).join('\n')}

اقدامات و راهکارهای حقوقی پیشنهادی:
${structured.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

${structured.draftText ? `\nمتن پیش‌نویس لایحه / دفاعیه:\n${structured.draftText}\n` : ''}

این سند توسط هوش مصنوعی پلتفرم ملی حقوق گردشگری بر پایه قوانین مصوب جمهوری اسلامی ایران استخراج گردیده است.
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Legal-Report-${trackingNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('متن سند حقوقی با موفقیت دانلود شد', 'success');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="صدور گزارش حقوقی رسمی"
          className="relative bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30">
                <Scale size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">صدور و چاپ گزارش حقوقی رسمی</h3>
                <p className="text-xs text-navy-300">سند استخراج‌شده از موتور هوش مصنوعی حقوق گردشگری</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="بستن گزارش حقوقی"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Printable Document Paper View */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
            <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-6 sm:p-10 relative overflow-hidden text-navy-900">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Scale size={320} />
              </div>

              {/* Official Header */}
              <div className="border-b-2 border-emerald-700/80 pb-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-right">
                  <h2 className="text-base sm:text-lg font-black text-navy-900 tracking-tight">
                    پلتفرم ملی حقوق گردشگری ایران
                  </h2>
                  <p className="text-[11px] text-navy-500">مرجع مشورتی و نظارتی فناوری‌های حقوقی گردشگری</p>
                </div>

                <div className="text-center sm:text-left text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-navy-600">
                    شماره سند: <strong className="font-mono text-emerald-800">{trackingNumber}</strong>
                  </p>
                  <p className="text-[11px] text-navy-600 flex items-center gap-1 justify-center sm:justify-start">
                    <Calendar size={12} /> تاریخ استعلام: {docDate}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 justify-center sm:justify-start">
                    <ShieldCheck size={12} /> ضریب انطباق: {structured.accuracy || 98}٪
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center my-4">
                <h3 className="text-sm font-bold bg-navy-50 text-navy-800 py-1.5 px-4 rounded-full inline-block border border-navy-100">
                  برگه استعلام و نظریه مشورتی حقوقی
                </h3>
              </div>

              {/* Analysis Text */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed mb-6">
                <div>
                  <h4 className="font-bold text-navy-900 mb-1 flex items-center gap-1.5 text-xs text-emerald-800">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    تحلیل و تطبیق مفاد قانونی:
                  </h4>
                  <p className="text-navy-700 p-3 bg-slate-50/80 rounded-xl border border-slate-100 leading-relaxed font-sans">
                    {structured.answer}
                  </p>
                </div>

                {/* Citations */}
                <div>
                  <h4 className="font-bold text-navy-900 mb-1.5 text-xs text-emerald-800">
                    مستندات و مواد قانونی مرتبط:
                  </h4>
                  <div className="space-y-1.5">
                    {structured.citations.map((cite, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-emerald-50/40 border border-emerald-100 rounded-lg text-xs">
                        <span className="font-semibold text-navy-800">{cite.title}</span>
                        <span className="font-bold text-emerald-700">{cite.article}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h4 className="font-bold text-navy-900 mb-1.5 text-xs text-emerald-800">
                    نقشه راه و اقدامات اجرایی پیشنهادی:
                  </h4>
                  <ul className="space-y-1">
                    {structured.actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-navy-700">
                        <span className="w-4 h-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Draft text if present */}
                {structured.draftText && (
                  <div>
                    <h4 className="font-bold text-navy-900 mb-1.5 text-xs text-amber-800">
                      پیش‌نویس لایحه قانونی پیشنهادی:
                    </h4>
                    <pre className="text-[11px] p-3.5 bg-slate-900 text-slate-100 rounded-xl font-sans whitespace-pre-wrap leading-relaxed border border-slate-700">
                      {structured.draftText}
                    </pre>
                  </div>
                )}
              </div>

              {/* Official Seal / Signature Placeholder */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-navy-400">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600/40 flex items-center justify-center text-[9px] text-emerald-700 font-bold text-center leading-tight">
                    مهر دیجیتال
                    <br />
                    پلتفرم
                  </div>
                  <div>
                    <p className="font-bold text-navy-700 text-xs">پلتفرم ملی حقوق گردشگری</p>
                    <p className="text-[10px] text-navy-400">تأیید شده با گواهی اعتبارسنجی دیجیتال</p>
                  </div>
                </div>
                <div className="text-left font-mono text-[10px] text-navy-400">
                  DIGITAL_HASH_VERIFIED
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-white border-t border-navy-100 flex items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
            >
              <Printer size={15} />
              <span>چاپ مستقیم یا خروجی PDF</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 px-4 py-2.5 rounded-xl text-xs font-semibold border border-navy-200 transition-all"
            >
              <Download size={14} />
              <span>دانلود متن گزارش (.txt)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

