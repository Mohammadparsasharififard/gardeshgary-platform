import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Bot, X, Send, Scale, ArrowLeft,
  ShieldCheck, ChevronUp
} from 'lucide-react';
import { quickPrompts } from '@/data';
import { dataLoaders } from '@/lib/loaders';
import { useToast } from '@/components/Toast';

export default function FloatingAIOrb() {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskQuick = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setReply(null);
    const { data, error } = await dataLoaders.aiChat(text);
    if (data) {
      setReply(data.answer);
      showToast('پاسخ هوش مصنوعی آماده شد', 'success');
    } else {
      setReply(`خطا در دریافت پاسخ: ${error || 'سرور در دسترس نیست'}`);
      showToast('خطا در ارتباط با دستیار', 'error');
    }
    setLoading(false);
  };

  const handleScrollToAssistant = () => {
    setIsOpen(false);
    const el = document.getElementById('ai-assistant');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Orb Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Pulsing Hint Badge */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-navy-950/90 text-white px-3.5 py-2 rounded-2xl border border-emerald-500/40 shadow-glow backdrop-blur-md cursor-pointer hover:border-emerald-400 transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold group-hover:text-emerald-300 transition-colors">
              دستیار هوشمند حقوقی
            </span>
            <Sparkles size={14} className="text-amber-400 animate-bounce" />
          </motion.div>
        )}

        {/* The Hologram Orb */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-15 h-15 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-navy-950 via-emerald-950 to-navy-900 border-2 border-emerald-400/80 shadow-glow-lg flex items-center justify-center cursor-pointer overflow-hidden group"
          title="دستیار هوشمند حقوق گردشگری"
          aria-label={isOpen ? 'بستن دستیار هوشمند حقوق گردشگری' : 'باز کردن دستیار هوشمند حقوق گردشگری'}
          aria-expanded={isOpen}
        >
          {/* Rotating Holographic Cyber Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-emerald-400/60 neural-rotate"></div>
          <div className="absolute inset-1 rounded-full border border-dotted border-amber-400/40 neural-rotate-reverse"></div>

          {/* Ambient Inner Glow */}
          <div className="absolute inset-2 bg-gradient-to-br from-emerald-500/30 via-teal-600/20 to-transparent rounded-full blur-sm"></div>

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center text-white">
            {isOpen ? (
              <X size={24} className="text-emerald-300" />
            ) : (
              <div className="relative">
                <Bot size={26} className="text-emerald-300 group-hover:scale-110 transition-transform" />
                <Sparkles size={13} className="text-amber-300 absolute -top-1 -right-1 animate-spin-slow" />
              </div>
            )}
          </div>

          {/* Ping Radar */}
          <span className="absolute -inset-1 rounded-full border-2 border-emerald-400/40 animate-ping pointer-events-none"></span>
        </motion.button>
      </div>

      {/* Floating Holographic Quick Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[85vh] bg-gradient-to-b from-navy-950/95 via-navy-900/95 to-navy-950/98 border border-emerald-500/40 rounded-3xl shadow-float backdrop-blur-2xl text-white overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Top Scanning Line */}
            <div className="scanline"></div>

            {/* Panel Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-glow">
                  <Scale size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                    هوش مصنوعی حقوق گردشگری
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h4>
                  <p className="text-[10px] text-emerald-300/80 font-mono">NEURAL_LAW_CORE v1403</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleScrollToAssistant}
                  aria-label="ورود به استودیو کامل دستیار حقوقی"
                  className="text-[11px] text-navy-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>ورود به استودیو کامل</span>
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="بستن دستیار"
                  className="p-1 rounded-lg text-navy-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs max-h-[380px]">
              {/* Status Badge */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-[11px] text-emerald-200">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  موتور تحلیل RAG آماده پاسخ‌گویی
                </span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-300">
                  دقت ۹۸.۴٪
                </span>
              </div>

              {/* Quick Prompt Chips */}
              <div>
                <p className="text-[11px] text-navy-300 mb-2 font-semibold">موضوعات سریع برای پرسش:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.slice(0, 4).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setQuery(p); handleAskQuick(p); }}
                      className="text-[10px] bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 border border-white/10 px-2.5 py-1.5 rounded-xl text-navy-200 hover:text-white transition-all text-right"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Reply or Loading */}
              {loading && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                    <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                    <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                    <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                  </div>
                  <span className="text-xs text-navy-300">در حال جستجو و استنتاج از قوانین...</span>
                </div>
              )}

              {reply && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} /> نظریه هوش مصنوعی حقوقی:
                    </span>
                    <span className="text-[10px] text-navy-400 font-mono">مستند قانونی</span>
                  </div>
                  <p className="text-xs text-navy-100 leading-relaxed font-sans">{reply}</p>
                  <button
                    onClick={handleScrollToAssistant}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
                  >
                    مشاهده تحلیل ماده به ماده و تنظیم لایحه در استودیو AI <ArrowLeft size={10} />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuick(query)}
                  placeholder="سوال حقوقی خود را بپرسید..."
                  aria-label="سوال حقوقی"
                  className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button
                  onClick={() => handleAskQuick(query)}
                  disabled={!query.trim() || loading}
                  aria-label="ارسال سوال حقوقی"
                  className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-glow flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

