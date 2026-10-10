import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ClipboardList, FileText,
  Printer, Download
} from 'lucide-react';
import { type ClaimItem } from '@/data';
import { useToast } from '@/components/Toast';

interface ClaimDossierModalProps {
  claim: ClaimItem | null;
  onClose: () => void;
}

export default function ClaimDossierModal({ claim, onClose }: ClaimDossierModalProps) {
  const { showToast } = useToast();

  if (!claim) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocs = () => {
    showToast('فایل فشرده مستندات پرونده با موفقیت دانلود شد', 'success');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
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
          aria-label={`پرونده شکایت: ${claim.title}`}
          className="relative bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    کد پرونده: {claim.id}
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full">
                    {claim.dossierNumber || 'DOS-1403-882'}
                  </span>
                  <span className="text-[11px] text-navy-300">
                    تاریخ ثبت: {claim.date}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white leading-tight">
                  {claim.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="بستن پرونده"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-navy-800">
            {/* Status & Amount Overview */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-navy-50/70 p-4 rounded-2xl border border-navy-100 text-center">
                <span className="text-xs text-navy-500 block mb-1">وضعیت کنونی:</span>
                <span className="font-extrabold text-emerald-700 text-sm">{claim.status}</span>
              </div>

              <div className="bg-navy-50/70 p-4 rounded-2xl border border-navy-100 text-center">
                <span className="text-xs text-navy-500 block mb-1">مبلغ مورد مطالبه:</span>
                <span className="font-extrabold text-navy-900 text-sm">{claim.amount}</span>
              </div>

              <div className="bg-navy-50/70 p-4 rounded-2xl border border-navy-100 text-center">
                <span className="text-xs text-navy-500 block mb-1">پیشرفت دادرسی:</span>
                <span className="font-extrabold text-amber-600 text-sm">{claim.progress}٪ تکمیل</span>
              </div>
            </div>

            {/* Parties */}
            <div className="p-4 bg-white border border-navy-100 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs py-1 border-b border-navy-50">
                <span className="text-navy-400">شاکی / خواهان:</span>
                <span className="font-bold text-navy-800">{claim.claimant}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-navy-50">
                <span className="text-navy-400">طرف شکایت / خوانده:</span>
                <span className="font-bold text-navy-800">{claim.defendant || 'آژانس خدمات مسافرتی مربوطه'}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-navy-400">مرجع صالح رسیدگی:</span>
                <span className="font-bold text-navy-800">{claim.courtBranch || 'کمیسیون نظارت بر دفاتر مسافرتی'}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 mb-2 flex items-center gap-1.5">
                <ClipboardList size={15} className="text-emerald-600" />
                <span>شرح تفصیلی ادعا و نقض تعهدات:</span>
              </h4>
              <div className="bg-navy-50/60 p-4 rounded-xl border border-navy-100 text-xs text-navy-700 leading-relaxed">
                {claim.description || 'شکایت در راستای عدم رعایت تعهدات مصرح در قرارداد گردشگری و مطالبه کامل خسارات مادی و معنوی وارده به انضمام خسارت تأخیر تادیه.'}
              </div>
            </div>

            {/* Attached Documents */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 mb-2.5 flex items-center gap-1.5">
                <FileText size={15} className="text-emerald-600" />
                <span>مستندات و ضمائم پرونده (۴ سند رسمی):</span>
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { name: 'تصویر قرارداد رسمی پکیج گردشگری', size: '۱.۸ مگابایت' },
                  { name: 'رسید تراکنش و حواله واریز وجه', size: '۶۲۰ کیلوبایت' },
                  { name: 'صورت‌جلسه مکتوب و گواهی تأخیر/کنسلی', size: '۲.۱ مگابایت' },
                  { name: 'گواهی ابلاغ اخطاریه به مشتکی‌عنه', size: '۸۵۰ کیلوبایت' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-navy-100 rounded-xl text-xs">
                    <span className="text-navy-700 font-medium truncate">{doc.name}</span>
                    <span className="text-[10px] text-navy-400 flex-shrink-0 mr-2">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-navy-50/80 border-t border-navy-100 flex items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-white hover:bg-navy-100 text-navy-700 px-4 py-2.5 rounded-xl text-xs font-semibold border border-navy-200 transition-all"
            >
              <Printer size={14} />
              <span>چاپ خلاصه پرونده</span>
            </button>

            <button
              onClick={handleDownloadDocs}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
            >
              <Download size={14} />
              <span>دانلود کامل مستندات</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

