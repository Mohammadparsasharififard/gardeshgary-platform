import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BookOpen, Scale, AlertTriangle, FileCheck, Copy, Sparkles, Check, Calendar, Landmark
} from 'lucide-react';
import { useState } from 'react';
import { type LawItem } from '@/data';
import { useToast } from '@/components/Toast';
import BookmarkButton from '@/components/BookmarkButton';

interface LawDetailModalProps {
  law: LawItem | null;
  onClose: () => void;
  onAskAI?: (lawTitle: string) => void;
}

export default function LawDetailModal({ law, onClose, onAskAI }: LawDetailModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!law) return null;

  const handleCopy = () => {
    const textToCopy = `${law.title} (${law.article} - ${law.code})\n\nمتن قانون:\n${law.fullText || law.excerpt}\n\nمنبع: ${law.officialSource || 'بانک قوانین حقوق گردشگری'}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    showToast('متن و استناد قانونی کپی شد', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAI = () => {
    onClose();
    if (onAskAI) {
      onAskAI(law.title);
    } else {
      const el = document.getElementById('ai-assistant');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`جزئیات قانون: ${law.title}`}
          className="relative bg-white rounded-3xl shadow-2xl border border-navy-100 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          dir="rtl"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-l from-navy-950 via-navy-900 to-navy-800 p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      {law.category}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      {law.article}
                    </span>
                    <span className="text-[11px] text-navy-300 flex items-center gap-1">
                      <Calendar size={12} /> {law.date}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                    {law.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="بستن جزئیات قانون"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-navy-200 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-navy-800 leading-relaxed">
            {/* Full Law Article */}
            <div className="bg-navy-50/70 rounded-2xl p-5 border border-navy-100">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-700 mb-2.5">
                <Scale size={16} className="text-emerald-600" />
                <span>متن رسمی مصوب ماده قانونی:</span>
              </div>
              <p className="text-navy-900 leading-relaxed font-sans text-sm sm:text-base bg-white p-4 rounded-xl border border-navy-100 shadow-sm">
                «{law.fullText || law.excerpt}»
              </p>
            </div>

            {/* Key Takeaways */}
            {law.keyTakeaways && law.keyTakeaways.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-navy-700 mb-3 flex items-center gap-2">
                  <FileCheck size={16} className="text-emerald-600" />
                  <span>نکات کلیدی و آثار اجرایی برای مسافر و آژانس:</span>
                </h4>
                <div className="space-y-2">
                  {law.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-navy-700 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/60">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sanction / Penalties */}
            {law.sanction && (
              <div className="p-4 bg-red-50/60 border border-red-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-red-800 mb-1.5">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span>ضمانت اجرای تخلف و مجازات‌های قانونی:</span>
                </div>
                <p className="text-xs text-red-900 leading-relaxed">
                  {law.sanction}
                </p>
              </div>
            )}

            {/* Official Source */}
            {law.officialSource && (
              <div className="flex items-center gap-2 text-xs text-navy-500 bg-white border border-navy-100 p-3 rounded-xl">
                <Landmark size={15} className="text-navy-400 flex-shrink-0" />
                <span>مرجع و منبع رسمی: <strong className="text-navy-700">{law.officialSource}</strong></span>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-navy-50/80 border-t border-navy-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-white hover:bg-navy-100 text-navy-700 px-4 py-2.5 rounded-xl text-xs font-semibold border border-navy-200 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'کپی گردید' : 'کپی متن قانون'}</span>
              </button>
              <BookmarkButton law={law} size="md" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAskAI}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-[1.02]"
              >
                <Sparkles size={14} />
                <span>تحلیل هوشمند این قانون در AI</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

