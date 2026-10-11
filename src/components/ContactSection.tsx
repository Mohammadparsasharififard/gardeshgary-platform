import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Video, Building2, MessageCircle, Mail, MapPin, Clock,
  Send, CheckCircle2, AlertCircle, Sparkles, User, ChevronDown,
} from 'lucide-react';
import {
  consultationTypes, contactInfo, contactFormFields, type ConsultationType,
} from '@/data';
import { useContactForm } from '@/hooks/useContactForm';
import { dataLoaders } from '@/lib/loaders';
import { useToast } from '@/components/Toast';

const CONSULTATION_ICONS: Record<ConsultationType['icon'], typeof Phone> = {
  phone: Phone,
  video: Video,
  office: Building2,
  message: MessageCircle,
};

const CONTACT_ICONS = {
  phone: Phone, mail: Mail, map: MapPin, clock: Clock, whatsapp: MessageCircle, telegram: Send,
};

const FIELD_LABEL: Record<keyof ReturnType<typeof useContactForm>['values'], string> = {
  name: 'نام و نام خانوادگی',
  phone: 'شماره تماس',
  email: 'ایمیل (اختیاری)',
  subject: 'موضوع',
  message: 'متن پیام',
  consultationType: 'نوع مشاوره',
  preferredTime: 'زمان پیشنهادی (اختیاری)',
};

export default function ContactSection() {
  const { showToast } = useToast();
  const form = useContactForm();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate first
    const ok = await form.submit(async () => {
      // Send to the backend
      const { data, error } = await dataLoaders.submitContact({
        name: form.values.name,
        phone: form.values.phone,
        email: form.values.email,
        subject: form.values.subject,
        message: form.values.message,
        consultationType: form.values.consultationType,
        preferredTime: form.values.preferredTime,
      });
      if (error) throw new Error(error);
      if (data) {
        showToast('درخواست مشاوره شما ثبت شد! به‌زودی با شما تماس می‌گیریم.', 'success');
      }
    });
    if (!ok) {
      showToast('لطفاً خطاهای فرم را برطرف کنید', 'error');
    }
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-b from-emerald-50/20 via-white to-slate-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 transition-colors duration-300"
    >
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-amber-500/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>تماس و رزرو مشاوره</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-3">
            با ما در تماس
            <span className="gradient-text"> باشید</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            برای دریافت مشاوره تخصصی حقوقی، رزرو وقت و اطلاع از خدمات پلتفرم با ما در ارتباط باشید
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: Contact info + consultation types */}
          <div className="space-y-6">
            {/* Contact info cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {contactInfo.map((info, i) => {
                const Icon = CONTACT_ICONS[info.icon];
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800 shadow-card hover:shadow-premium hover:border-emerald-200 dark:hover:border-emerald-700/50 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wide mb-0.5">{info.label}</p>
                      <p className="text-sm font-bold text-navy-900 dark:text-white break-words leading-snug" dir="auto">{info.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Consultation types */}
            <div>
              <h3 className="text-sm font-bold text-navy-700 dark:text-navy-200 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                انواع مشاوره
              </h3>
              <div className="space-y-2">
                {consultationTypes.map((c, i) => {
                  const Icon = CONSULTATION_ICONS[c.icon];
                  const selected = form.values.consultationType === c.id;
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => form.handleChange('consultationType', c.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-right ${
                        selected
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 shadow-premium'
                          : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800 hover:border-emerald-200 dark:hover:border-emerald-700/50'
                      }`}
                      aria-pressed={selected}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        selected ? 'bg-emerald-600 text-white' : 'bg-navy-50 dark:bg-navy-800 text-navy-500 dark:text-navy-300'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-navy-900 dark:text-white">{c.label}</span>
                          {selected && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-navy-500 dark:text-navy-400 leading-snug">{c.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-left">
                        <p className="text-[10px] text-navy-400 dark:text-navy-500">{c.duration}</p>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{c.price}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {form.touched.consultationType && form.errors.consultationType && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {form.errors.consultationType}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-premium p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-emerald-500/40" />

            <AnimatePresence mode="wait">
              {form.submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h3 className="text-lg font-extrabold text-navy-900 dark:text-white mb-2">درخواست شما ثبت شد!</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-300 max-w-xs leading-relaxed mb-6">
                    کارشناسان ما در اولین فرصت با شما تماس خواهند گرفت. میانگین زمان پاسخ ۲۴ ساعت است.
                  </p>
                  <button
                    onClick={() => form.reset()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow transition-colors"
                  >
                    ثبت درخواست جدید
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                >
                  <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1 flex items-center gap-2">
                    <User size={16} className="text-emerald-600 dark:text-emerald-400" />
                    فرم درخواست مشاوره
                  </h3>

                  {/* Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FieldInput
                      label={FIELD_LABEL.name}
                      name="name"
                      value={form.values.name}
                      onChange={(v) => form.handleChange('name', v)}
                      onBlur={() => form.handleBlur('name')}
                      error={form.touched.name ? form.errors.name : undefined}
                      focused={focusedField === 'name'}
                      onFocus={() => setFocusedField('name')}
                      onBlurField={() => setFocusedField(null)}
                      placeholder="مثلاً: محمد رضایی"
                      dir="rtl"
                    />
                    <FieldInput
                      label={FIELD_LABEL.phone}
                      name="phone"
                      value={form.values.phone}
                      onChange={(v) => form.handleChange('phone', v)}
                      onBlur={() => form.handleBlur('phone')}
                      error={form.touched.phone ? form.errors.phone : undefined}
                      focused={focusedField === 'phone'}
                      onFocus={() => setFocusedField('phone')}
                      onBlurField={() => setFocusedField(null)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      dir="ltr"
                    />
                  </div>

                  {/* Email */}
                  <FieldInput
                    label={FIELD_LABEL.email}
                    name="email"
                    value={form.values.email}
                    onChange={(v) => form.handleChange('email', v)}
                    onBlur={() => form.handleBlur('email')}
                    error={form.touched.email ? form.errors.email : undefined}
                    focused={focusedField === 'email'}
                    onFocus={() => setFocusedField('email')}
                    onBlurField={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    dir="ltr"
                  />

                  {/* Subject (select) */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-navy-700 dark:text-navy-200 mb-1.5">
                      {FIELD_LABEL.subject}
                    </label>
                    <div className="relative">
                      <select
                        id="contact-subject"
                        value={form.values.subject}
                        onChange={(e) => form.handleChange('subject', e.target.value)}
                        onBlur={() => form.handleBlur('subject')}
                        className={`w-full appearance-none px-4 py-2.5 bg-white dark:bg-navy-800 border rounded-xl text-sm text-navy-900 dark:text-navy-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                          form.touched.subject && form.errors.subject
                            ? 'border-red-400 dark:border-red-700'
                            : 'border-navy-200 dark:border-navy-700'
                        }`}
                      >
                        <option value="">انتخاب موضوع...</option>
                        {contactFormFields.subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
                    </div>
                    {form.touched.subject && form.errors.subject && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> {form.errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-navy-700 dark:text-navy-200 mb-1.5">
                      {FIELD_LABEL.message}
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.values.message}
                      onChange={(e) => form.handleChange('message', e.target.value)}
                      onBlur={() => form.handleBlur('message')}
                      rows={4}
                      placeholder="شرح مختصر موضوع خود را وارد کنید..."
                      className={`w-full px-4 py-2.5 bg-white dark:bg-navy-800 border rounded-xl text-sm text-navy-900 dark:text-navy-100 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none ${
                        form.touched.message && form.errors.message
                          ? 'border-red-400 dark:border-red-700'
                          : 'border-navy-200 dark:border-navy-700'
                      }`}
                    />
                    {form.touched.message && form.errors.message && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} /> {form.errors.message}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-navy-400 dark:text-navy-500">
                      {form.values.message.length.toLocaleString('fa-IR')} نویسه
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={form.submitting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-glow hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden sheen"
                  >
                    {form.submitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        ارسال درخواست
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-navy-400 dark:text-navy-500 leading-relaxed">
                    با ارسال این فرم، درخواست شما نزد کارشناسان پلتفرم ثبت می‌شود و از طریق راه‌های انتخابی شما پاسخ داده خواهد شد.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Field input sub-component ───
function FieldInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  focused,
  onFocus,
  onBlurField,
  placeholder,
  dir,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  focused: boolean;
  onFocus: () => void;
  onBlurField: () => void;
  placeholder: string;
  dir: 'rtl' | 'ltr';
}) {
  return (
    <div>
      <label htmlFor={`contact-${name}`} className="block text-xs font-bold text-navy-700 dark:text-navy-200 mb-1.5">
        {label}
      </label>
      <input
        id={`contact-${name}`}
        type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => { onBlur(); onBlurField(); }}
        onFocus={onFocus}
        placeholder={placeholder}
        dir={dir}
        aria-invalid={!!error}
        aria-describedby={error ? `contact-${name}-error` : undefined}
        className={`w-full px-4 py-2.5 bg-white dark:bg-navy-800 border rounded-xl text-sm text-navy-900 dark:text-navy-100 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
          error ? 'border-red-400 dark:border-red-700' : 'border-navy-200 dark:border-navy-700'
        }`}
      />
      {error && (
        <p id={`contact-${name}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
