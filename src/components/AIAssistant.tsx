import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Bot, User, Scale, FileText, Lightbulb, AlertCircle, ArrowRight, Copy, Check, ChevronDown, Microscope, FilePen, MessageCircle,
  ShieldCheck, Database, Gavel, Trash2, Printer,
  Radio, Cpu, Activity, Maximize2, Minimize2
} from 'lucide-react';
import { quickPrompts, aiModes, type ChatMessage, type AIMode } from '@/data';
import { dataLoaders } from '@/lib/loaders';
import { useToast } from '@/components/Toast';

// Code-split: the printable-report overlay loads only when the user exports
const LegalExportModal = lazy(() => import('@/components/LegalExportModal'));

const modeIcons: Record<string, typeof MessageCircle> = {
  MessageCircle, Microscope, FilePen,
};

const activeScanningLaws = [
  'ماده ۹ دستورالعمل حقوق مسافر هوانوردی',
  'ماده ۳ بخشنامه ۱۴۰۰ استرداد کنسلی هتل',
  'ماده ۷ قانون جامع گردشگری ایران',
  'ماده ۱۴ آیین‌نامه اجرایی مسئولیت تورلیدر',
  'ماده ۵ قانون حمایت از حقوق مصرف‌کنندگان',
  'ماده ۱ بخشنامه استرداد تور در فورس‌ماژور',
];

export default function AIAssistant() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'bot',
      text: 'سلام! من هسته هوشمند حقوق گردشگری ایران هستم. با تغذیه از بانک ۵۰۰+ ماده قانونی مصوب، آیین‌نامه‌ها و آرای داوری، آماده پاسخ‌گویی تخصصی، تحلیل ماده به ماده و تنظیم لوایح دفاعیه رسمی برای شما هستم. لطفاً سوال خود را بفرمایید.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>('simple');
  const [expandedClauses, setExpandedClauses] = useState<Set<number>>(new Set());
  const [copiedMsgId, setCopiedMsgId] = useState<number | null>(null);
  const [copiedFullId, setCopiedFullId] = useState<number | null>(null);
  const [exportMessage, setExportMessage] = useState<ChatMessage | null>(null);
  const [isExpandedFull, setIsExpandedFull] = useState(false);
  const [scannedLawIndex, setScannedLawIndex] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Rotate scanned laws in HUD
  useEffect(() => {
    const timer = setInterval(() => {
      setScannedLawIndex((prev) => (prev + 1) % activeScanningLaws.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll the chat to the latest message ONLY when messages/typing
  // actually change during an interaction — NOT on mount. On mount this
  // scrollIntoView scrolled the whole page to the chat end (~y=2050), which
  // fought the route-change scroll reset right after every navigation back
  // to home (audit Phase 2.4 — scrollY stayed ≈2140).
  const firstChatScrollRun = useRef(true);
  useEffect(() => {
    if (firstChatScrollRun.current) {
      firstChatScrollRun.current = false;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text, mode: aiMode };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Call the real backend AI (RAG with z-ai-web-dev-sdk LLM)
    const { data, error } = await dataLoaders.aiChat(text);
    const modeLabel = aiModes.find((m) => m.id === aiMode)?.label || '';

    const botMsg: ChatMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: data
        ? aiMode === 'deep'
          ? `تحلیل استنادی ماده به ماده توسط هسته RAG تکمیل گردید (${modeLabel}):`
          : aiMode === 'draft'
          ? `پیش‌نویس مستند لایحه حقوقی بر اساس قوانین جاری تنظیم شد:`
          : 'بر اساس بررسی رسمی قوانین و مقررات گردشگری، پاسخ مستند به شرح زیر است:'
        : `خطا در دریافت پاسخ: ${error || 'سرور در دسترس نیست'}`,
      structured: data
        ? {
            answer: data.answer,
            citations: data.citations.map((c) => ({ title: c.title, article: c.article })),
            actions: [],
            clauses: [],
            draftText: '',
            accuracy: 0,
            source: data.source,
          }
        : undefined,
    };
    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
  };

  const toggleClause = (index: number) => {
    setExpandedClauses((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'گفتگو پاکسازی شد. سوال حقوقی جدید خود را مطرح فرمایید.',
      },
    ]);
    showToast('تاریخچه گفتگو پاکسازی شد', 'info');
  };

  const handleCopyFull = (msg: ChatMessage) => {
    if (!msg.structured) return;
    const s = msg.structured;
    const text = `تحلیل حقوقی:\n${s.answer}\n\nاستنادها:\n${s.citations.map((c) => `${c.title} - ${c.article}`).join('\n')}\n\nاقدامات پیشنهادی:\n${s.actions.join('\n')}`;
    navigator.clipboard?.writeText(text);
    setCopiedFullId(msg.id);
    showToast('کل متن تحلیل حقوقی کپی شد', 'success');
    setTimeout(() => setCopiedFullId(null), 2000);
  };

  const handleCopyCitations = (msg: ChatMessage) => {
    if (!msg.structured) return;
    const text = msg.structured.citations.map((c) => `${c.title} - ${c.article}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopiedMsgId(msg.id);
    showToast('رفرنس‌های قانونی کپی شد', 'success');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <section id="ai-assistant" className="py-24 relative overflow-hidden bg-gradient-to-b from-navy-950 via-[#040816] to-navy-950 text-white">
      {/* Background Neural Matrix & Ambient Glows */}
      <div className="absolute inset-0 grid-overlay opacity-30"></div>
      <div className="absolute top-1/4 left-5 w-72 h-72 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-5 w-72 h-72 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className={`relative mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isExpandedFull ? 'max-w-[98%]' : 'max-w-7xl'}`}>
        {/* Hologram Section Header */}
        <div className="text-center mb-12">
          {/* Central 3D Holographic Core */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full border border-dashed border-emerald-400/60 neural-rotate flex items-center justify-center"></div>
            <div className="absolute w-16 h-16 rounded-full border border-dotted border-amber-400/40 neural-rotate-reverse"></div>
            <div className="absolute w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-glow">
              <Scale size={24} className="text-white drop-shadow" />
            </div>
            <span className="absolute -bottom-2 bg-emerald-950/90 text-emerald-300 border border-emerald-400/50 text-[10px] font-mono px-3 py-0.5 rounded-full font-bold">
              NEURAL RAG CORE
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-full px-4 py-1.5 mb-3"
          >
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold">اتاق فرمان هوش مصنوعی حقوق گردشگری</span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            دستیار هوشمند و خودکار <span className="gradient-text">حقوق گردشگری</span>
          </h2>
          <p className="text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            موتور تحلیلگر RAG با پردازش لحظه‌ای متن قوانین، انطباق مفاد قراردادها و تنظیم خودکار لوایح دفاعیه
          </p>
        </div>

        {/* Command Center Studio Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left / Side HUD: Telemetry & Radar (4 Cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Telemetry Card */}
            <div className="cyber-glass rounded-3xl p-5 border border-emerald-500/30 shadow-card relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" />
                  <h3 className="font-bold text-xs text-white">تله‌متری و وضعیت موتور هوش مصنوعی</h3>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  ONLINE
                </span>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-2 sm:p-3">
                  <span className="text-[9px] sm:text-[10px] text-navy-400 block mb-1">دقت استدلال الگوریتم</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">۹۸.۴٪</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-2 sm:p-3">
                  <span className="text-[9px] sm:text-[10px] text-navy-400 block mb-1">سرعت پاسخ‌دهی</span>
                  <span className="text-base sm:text-lg font-black text-amber-400 font-mono">۰.۸s</span>
                </div>
              </div>

              {/* Live Statutory Radar Scanner */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-emerald-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <Cpu size={14} className="text-emerald-400" />
                    رادار اسکن همزمان قوانین:
                  </span>
                  <span className="font-mono text-[9px] text-navy-400">۵۰۰+ سند</span>
                </div>
                <div className="p-2.5 bg-navy-950/80 rounded-xl border border-emerald-400/20 text-xs text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                  <span className="truncate text-[11px] text-emerald-200 font-medium">
                    {activeScanningLaws[scannedLawIndex]}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Cyber Legal Topics */}
            <div className="cyber-glass rounded-3xl p-5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                دسترسی سریع به دعاوی پرتکرار:
              </h4>
              <div className="space-y-1.5">
                {quickPrompts.slice(0, 5).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={typing}
                    className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/40 border border-white/5 text-xs text-navy-200 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">{prompt}</span>
                    <ArrowRight size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Main Conversation Terminal (8 Cols on lg) */}
          <div className="lg:col-span-8">
            <div className="cyber-glass rounded-3xl shadow-float border border-emerald-500/30 overflow-hidden flex flex-col relative">
              {/* Terminal Header */}
              <div className="bg-gradient-to-l from-navy-950 via-navy-900 to-navy-950 px-6 py-4.5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-600 to-navy-900 rounded-2xl flex items-center justify-center shadow-glow border border-emerald-400/40">
                    <Bot size={22} className="text-white" />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-navy-900 animate-pulse"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-white">ترمینال تخصصی داوری و تحلیل هوشمند</h3>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                        v1403
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80 font-mono">
                      CIVIL & TOURISM CODE PARSER • ACTIVE
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setIsExpandedFull(!isExpandedFull)}
                    title={isExpandedFull ? 'نمای استاندارد' : 'نمای تمام‌عرض'}
                    aria-label={isExpandedFull ? 'بازگرداندن به نمای استاندارد' : 'نمایش در حالت تمام‌عرض'}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-navy-300 hover:text-white transition-colors"
                  >
                    {isExpandedFull ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  <button
                    onClick={handleClearChat}
                    title="پاک کردن پیام‌ها"
                    aria-label="پاک کردن تاریخچه گفتگو"
                    className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-navy-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Mode Toggle Bar */}
              <div className="p-3 bg-navy-950/70 border-b border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  {aiModes.map((mode) => {
                    const Icon = modeIcons[mode.icon] || MessageCircle;
                    const isActive = aiMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setAiMode(mode.id)}
                        aria-pressed={isActive}
                        aria-label={`انتخاب حالت ${mode.label}`}
                        className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow border border-emerald-400/40'
                            : 'text-navy-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{mode.label}</span>
                        <span className="sm:hidden">{mode.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="h-[520px] overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-gradient-to-b from-navy-950/80 via-[#070d1e]/90 to-navy-950/95">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft ${
                        msg.sender === 'bot'
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border border-emerald-400/40 shadow-glow'
                          : 'bg-navy-800 text-white border border-white/10'
                      }`}>
                        {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[92%] sm:max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-3xl p-5 ${
                          msg.sender === 'bot'
                            ? 'bg-slate-900/90 border border-emerald-500/30 text-slate-100 shadow-glow backdrop-blur-md'
                            : 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md'
                        }`}>
                          {msg.sender === 'user' && msg.mode && (
                            <span className="inline-block text-[10px] bg-black/30 text-emerald-200 px-2.5 py-0.5 rounded-full mb-2 font-mono">
                              حالت: {aiModes.find((m) => m.id === msg.mode)?.label}
                            </span>
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed font-sans font-medium">
                            {msg.text}
                          </p>

                          {/* Structured Response Box */}
                          {msg.structured && (
                            <div className="mt-5 space-y-4 border-t border-white/10 pt-4">
                              {/* Accuracy badge */}
                              {msg.structured.accuracy && (
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-xl">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    ضریب صحت استدلال: {msg.structured.accuracy}٪
                                  </span>
                                  {msg.structured.source && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-navy-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                                      <Database size={12} className="text-emerald-400" />
                                      مرجع: {msg.structured.source}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Analysis Summary */}
                              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl">
                                <p className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                                  <Lightbulb size={15} className="text-amber-400" />
                                  خلاصه نظریه مشورتی حقوقی:
                                </p>
                                <p className="text-xs text-navy-100 leading-relaxed font-sans">{msg.structured.answer}</p>
                              </div>

                              {/* Deep Clauses */}
                              {msg.structured.clauses && msg.structured.clauses.length > 0 && (
                                <div>
                                  <p className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
                                    <Scale size={15} className="text-emerald-400" />
                                    تطبیق موشکافانه با مواد قانون ({msg.structured.clauses.length} ماده مستند):
                                  </p>
                                  <div className="space-y-2">
                                    {msg.structured.clauses.map((clause, i) => {
                                      const isExpanded = expandedClauses.has(msg.id * 100 + i);
                                      return (
                                        <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                                          <button
                                            onClick={() => toggleClause(msg.id * 100 + i)}
                                            className="w-full flex items-center justify-between p-3.5 bg-white/5 hover:bg-emerald-500/10 transition-colors"
                                          >
                                            <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                                              <Gavel size={14} className="text-emerald-400" />
                                              {clause.article}
                                            </span>
                                            <ChevronDown
                                              size={15}
                                              className={`text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                          </button>
                                          <AnimatePresence>
                                            {isExpanded && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                              >
                                                <div className="p-3.5 space-y-2.5 border-t border-white/10 bg-black/40">
                                                  <div className="bg-white/5 p-3 rounded-xl border-r-2 border-emerald-400">
                                                    <p className="text-[10px] font-bold text-navy-400 mb-1">متن مصوب قانون:</p>
                                                    <p className="text-xs text-navy-100 leading-relaxed font-sans">{clause.text}</p>
                                                  </div>
                                                  <div className="bg-emerald-950/40 p-3 rounded-xl border-r-2 border-amber-400">
                                                    <p className="text-[10px] font-bold text-amber-300 mb-1">تحلیل و تفسیر حقوقی:</p>
                                                    <p className="text-xs text-navy-200 leading-relaxed font-sans">{clause.analysis}</p>
                                                  </div>
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Draft Pleading / Bill */}
                              {msg.structured.draftText && (
                                <div>
                                  <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                                    <FilePen size={15} />
                                    پیش‌نویس لایحه قانونی دفاعیه:
                                  </p>
                                  <div className="bg-black/60 rounded-2xl p-4 border border-amber-400/30 max-h-56 overflow-y-auto">
                                    <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans text-amber-100">{msg.structured.draftText}</pre>
                                  </div>
                                </div>
                              )}

                              {/* Citations */}
                              <div>
                                <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                                  <Scale size={14} className="text-emerald-400" />
                                  استنادها و مستندات قانونی:
                                </p>
                                <div className="space-y-1.5">
                                  {msg.structured.citations.map((cite, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs">
                                      <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-emerald-400" />
                                        <span className="text-navy-200 font-medium">{cite.title}</span>
                                      </div>
                                      <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-400/30">{cite.article}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Action Steps */}
                              <div>
                                <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                                  <AlertCircle size={14} />
                                  اقدامات پیشنهادی و نقشه راه:
                                </p>
                                <ul className="space-y-1.5">
                                  {msg.structured.actions.map((act, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs text-navy-200 bg-white/5 p-2.5 rounded-xl border border-white/5">
                                      <span className="w-4 h-4 bg-amber-400/20 text-amber-300 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                      <span>{act}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2.5 pt-3 border-t border-white/10">
                                <button
                                  onClick={() => setExportMessage(msg)}
                                  aria-label="صدور و چاپ گزارش رسمی"
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:scale-105"
                                >
                                  <Printer size={14} />
                                  صدور و چاپ گزارش رسمی (PDF)
                                </button>

                                <button
                                  onClick={() => handleCopyFull(msg)}
                                  aria-label="کپی کل متن تحلیل حقوقی"
                                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/10"
                                >
                                  {copiedFullId === msg.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                  <span>{copiedFullId === msg.id ? 'کپی شد' : 'کپی کل تحلیل'}</span>
                                </button>

                                <button
                                  onClick={() => handleCopyCitations(msg)}
                                  aria-label="کپی رفرنس‌های قانونی"
                                  className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-navy-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/10"
                                >
                                  {copiedMsgId === msg.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                  <span>{copiedMsgId === msg.id ? 'کپی شد' : 'کپی رفرنس‌ها'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Cyber Audio Waveform Typing State */}
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3.5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <div className="cyber-glass border border-emerald-500/40 rounded-3xl p-4 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                        <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                        <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                        <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                        <span className="soundwave-bar w-1 bg-emerald-400 rounded-full"></span>
                      </div>
                      <span className="text-xs text-emerald-300 font-mono">
                        {aiMode === 'deep' ? 'PARSING_LEGAL_ARTICLES...' : aiMode === 'draft' ? 'SYNTHESIZING_LEGAL_PLEADING...' : 'QUERYING_KNOWLEDGE_BASE...'}
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-navy-950/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                      placeholder="سوال یا اختلاف حقوقی خود را اینجا بنویسید (مثلاً: گم شدن چمدان در پرواز چه میزان خسارت دارد؟)..."
                      aria-label="سوال یا اختلاف حقوقی"
                      className="w-full pl-4 pr-4 py-4 bg-white/5 border border-white/15 rounded-2xl text-sm text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || typing}
                    aria-label="ارسال پیام"
                    className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all shadow-glow hover:scale-105 flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Legal Report Modal */}
      {exportMessage && (
        <Suspense fallback={null}>
          <LegalExportModal
            message={exportMessage}
            onClose={() => setExportMessage(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
