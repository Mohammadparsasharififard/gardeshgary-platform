import { Scale, Compass } from 'lucide-react';

export const navLinks = [
  { label: 'صفحه اصلی', href: '#hero' },
  { label: 'دستیار هوشمند AI', href: '#ai-assistant' },
  { label: 'بانک قوانین', href: '#law-database' },
  { label: 'دانشنامه حقوقی', href: '#encyclopedia' },
  { label: 'حقوق گردشگری', href: '#rights-hub' },
  { label: 'اخبار و مقالات', href: '#news' },
  { label: 'محاسبه‌گر خسارت', href: '#calculator' },
  { label: 'تنظیم قرارداد', href: '#contract-generator' },
  { label: 'پیگیری شکایات', href: '#claims' },
  { label: 'آمار پلتفرم', href: '#stats' },
  { label: 'مقایسه قوانین', href: '#comparison' },
  { label: 'واژه‌نامه حقوقی', href: '#glossary' },
  { label: 'متخصصان و مشاوره', href: '#experts' },
  { label: 'پیش‌نمایش پنل‌ها', href: '#dashboards' },
  { label: 'تجربه کاربران', href: '#testimonials' },
  { label: 'تماس با ما', href: '#contact' },
  { label: 'پرسش‌های متداول', href: '#faq' },
];

export interface LawItem {
  id: number;
  title: string;
  code: string;
  category: 'قوانین اصلی' | 'آیین‌نامه‌ها' | 'بخشنامه‌ها';
  excerpt: string;
  article: string;
  relevance: 'بالا' | 'متوسط';
  date: string;
  fullText?: string;
  sanction?: string;
  officialSource?: string;
  keyTakeaways?: string[];
}

export const lawCategories = ['همه', 'قوانین اصلی', 'آیین‌نامه‌ها', 'بخشنامه‌ها'] as const;

export type AIMode = 'simple' | 'deep' | 'draft';

export const aiModes: { id: AIMode; label: string; icon: string }[] = [
  { id: 'simple', label: 'چت ساده', icon: 'MessageCircle' },
  { id: 'deep', label: 'تحلیل عمیق ماده به ماده', icon: 'Microscope' },
  { id: 'draft', label: 'تنظیم لوایح و دفاعیه', icon: 'FilePen' },
];

export interface LegalClause {
  article: string;
  text: string;
  analysis: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  mode?: AIMode;
  structured?: {
    answer: string;
    citations: { title: string; article: string }[];
    actions: string[];
    clauses?: LegalClause[];
    accuracy?: number;
    source?: string;
    draftText?: string;
  };
}

export const quickPrompts = [
  'مسئولیت تورلیدر در حوادث',
  'قوانین کنسلی هتل',
  'حقوق مسافر در تأخیر پرواز',
  'استرداد هزینه تور در فورس‌ماژور',
  'تعهدات آژانس مسافرتی',
  'حقوق مسافر در کنسلی تور',
  'گم شدن یا آسیب به چمدان در پرواز',
  'ریجکت شدن ویزا و استرداد هزینه تور',
  'عدم تطابق کیفیت هتل با قرارداد',
  'گران‌فروشی بلیط هواپیما و قطار',
];

// ─────────────────────────────────────────────────────────────
// 4. DASHBOARDS PREVIEW DATA (پیش‌نمایش پنل کاربر و پنل متخصص)
// ─────────────────────────────────────────────────────────────
export const userDashboardStats = {
  activeClaims: 2,
  totalContracts: 5,
  consultationsBooked: 3,
  aiQueriesCount: 24,
  recentActivity: [
    { title: 'شکایت نمونه (نمونه)', date: '', status: 'در حال بررسی' },
    { title: 'قرارداد نمونه (نمونه)', date: '', status: 'تأیید شده' },
    { title: 'مشاوره نمونه (نمونه)', date: '', status: 'تکمیل شده' },
  ],
};

export const expertDashboardStats = {
  assignedDossiers: 8,
  activeConsultations: 4,
  monthlyEarnings: '',
  rating: 4.9,
  upcomingAppointments: [
    { client: 'کاربر نمونه', topic: 'مشاوره نمونه', time: 'نمونه', type: 'تلفنی' },
    { client: 'کاربر نمونه', topic: 'مشاوره نمونه', time: 'نمونه', type: 'ویدیویی' },
  ],
};

// ─────────────────────────────────────────────────────────────
// 5. EXISTING EXPORTS
// ─────────────────────────────────────────────────────────────
export const getAIResponse = (query: string, _mode?: AIMode): ChatMessage['structured'] | null => {
  const clean = query.trim().toLowerCase();
  const generalTopic = clean.length > 20 ? clean.slice(0, 30) + '...' : clean;
  return {
    answer: `بر اساس بررسی تخصصی مواد قانون توسعه گردشگری ایران و آیین‌نامه‌های رسمی: در خصوص موضوع «${generalTopic}»، حقوق مسافر و تکالیف ارائه‌دهنده خدمت مطابق با ضوابط مصوب حقوقی قابل پیگیری و استرداد می‌باشد.`,
    citations: [
      { title: 'قانون حمایت از حقوق مصرف‌کنندگان در گردشگری', article: 'ماده ۵' },
      { title: 'قانون گردشگری ایران', article: 'ماده ۷' },
    ],
    actions: [
      'جمع‌آوری و ثبت مستندات رسمی شامل قرارداد و فیش‌های واریزی',
      'ارسال درخواست مکتوب با مهلت ۴۸ ساعته به طرف قرارداد',
      'ثبت شکایت در سامانه ملی پاسخگویی به شکایات گردشگری (۰۹۶۲۹)',
    ],
    clauses: [
      {
        article: 'ماده ۷ - قانون گردشگری',
        text: 'دفاتر خدمات مسافرتی ملزم به انجام دقیق تعهدات قراردادی با مسافران می‌باشند.',
        analysis: 'تعهدات پذیرفته‌شده در پکیج سند رسمی محسوب شده و عدول از آن نقض قانون است.',
      },
    ],
    draftText: `بسمه‌تعالی\nریاست محترم مرجع رسیدگی به شکایات گردشگری\nموضوع: شکواییه در خصوص ${query}\nاحتراماً تقاضای رسیدگی و اعاده حقوق مصرح قانونی را دارم.`,
    accuracy: 98.4,
    source: 'بانک جامع قوانین و مقررات گردشگری ایران',
  };
};

export const contracts = [
  {
    id: 'domestic-tour',
    name: 'قرارداد تور داخلی',
    icon: 'MapPin',
    fields: [
      { key: 'agency', label: 'نام آژانس مسافرتی', placeholder: 'آژانس گردشگری آسمان پارس' },
      { key: 'agencyCode', label: 'کد مجوز آژانس', placeholder: 'MCTH-98421' },
      { key: 'tourName', label: 'نام تور', placeholder: 'تور کویر مرنجاب' },
      { key: 'destination', label: 'مقصد', placeholder: 'کاشان' },
      { key: 'startDate', label: 'تاریخ شروع', placeholder: '۱۴۰۳/۰۱/۰۱' },
      { key: 'endDate', label: 'تاریخ پایان', placeholder: '۱۴۰۳/۰۱/۰۳' },
      { key: 'passengerName', label: 'نام مسافر', placeholder: 'علی رضایی' },
      { key: 'passengerId', label: 'کد ملی مسافر', placeholder: '۰۰۱۲۳۴۵۶۷۸' },
      { key: 'price', label: 'مبلغ کل (تومان)', placeholder: '۴٬۸۵۰٬۰۰۰' },
      { key: 'services', label: 'خدمات شامل', placeholder: 'اتوبوس VIP، هتل، بیمه و لیدر' },
    ],
  },
];

export const contractTemplates: Record<string, string> = {
  'domestic-tour': `قرارداد تور داخلی\nآژانس: {agency}\nمسافر: {passengerName}\nتور: {tourName}\nمبلغ: {price} تومان`,
};

export interface ClaimItem {
  id: string;
  title: string;
  claimant: string;
  type: string;
  status: 'بررسی اولیه' | 'ارزیابی کارشناسی' | 'ارسال به کمیته' | 'حل‌وفصل شده';
  progress: number;
  date: string;
  amount: string;
  description?: string;
  dossierNumber?: string;
  courtBranch?: string;
  defendant?: string;
}

export const claimsData: ClaimItem[] = [
  {
    id: 'CL-1403-001',
    title: 'خسارت تأخیر پرواز کیش و نقض تعهدات هوانوردی',
    claimant: 'کاربر نمونه',
    type: 'تأخیر پرواز',
    status: 'بررسی اولیه',
    progress: 25,
    date: '',
    amount: 'تعیین در زمان رسیدگی',
    defendant: '[نمونه]',
    dossierNumber: '[نمونه]',
    courtBranch: '[نمونه]',
    description: '[نمونه] شرح نمونه شکایت.',
  },
];

export const claimSteps = [
  { step: 1, label: 'ثبت شکایت و بارگذاری مستندات', desc: 'تکمیل فرم آنلاین و ارسال مدارک' },
  { step: 2, label: 'بررسی مقدماتی و تطبیق صلاحیت', desc: 'کنترل مجوزها و صدور اخطاریه' },
  { step: 3, label: 'کارشناسی فنی و برآورد خسارت', desc: 'محاسبه خسارت طبق بخشنامه‌ها' },
  { step: 4, label: 'ارجاع به کمیته و صدور رأی', desc: 'صدور نظریه لازم‌الاجرا' },
  { step: 5, label: 'حل‌وفصل و استرداد نهایی وجه', desc: 'واریز مبالغ خسارت به شاکی' },
];

export const analyticsData = [
  { label: 'کنسلی تور و رزرواسیون هتل', percentage: 54, count: 1248, color: 'bg-emerald-500' },
  { label: 'حوادث، آسیب‌ها و بیمه گردشگری', percentage: 22, count: 508, color: 'bg-amber-500' },
  { label: 'کیفیت خدمات و مغایرت قرارداد', percentage: 24, count: 556, color: 'bg-navy-500' },
];

export const analyticsMonthly = [
  { month: 'فروردین', value: 45 },
  { month: 'اردیبهشت', value: 62 },
  { month: 'خرداد', value: 78 },
  { month: 'تیر', value: 55 },
  { month: 'مرداد', value: 89 },
  { month: 'شهریور', value: 95 },
];

export const partners = [
  { name: 'وزارت میراث فرهنگی، گردشگری و صنایع دستی', short: 'MCTH', desc: 'همکاری رسمی در تبادل استعلامات و استانداردهای حقوقی' },
  { name: 'دانشگاه تهران - دانشکده حقوق', short: 'UT-Law', desc: 'پژوهشکده حقوق گردشگری و آموزش وکلای تخصصی' },
  { name: 'مرکز ملی نوآوری گردشگری', short: 'TIC', desc: 'توسعه فناوری‌های رگولاتوری حقوقی (LegalTech)' },
];

export const apiTestEndpoints = [
  { id: 'gov-services', name: 'پنجره ملی خدمات دولت هوشمند', endpoint: 'https://api.my.gov.ir/v1/verify', method: 'POST', status: 'idle' as const },
];

export const apiMockResponses: Record<string, object> = {};

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl rotate-6 shadow-md"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 rounded-xl flex items-center justify-center shadow-inner">
        <div className="relative flex items-center justify-center">
          <Scale size={size * 0.55} className="text-white drop-shadow" strokeWidth={2.5} />
          <Compass
            size={size * 0.35}
            className="text-amber-300 absolute -bottom-1 -left-1 bg-navy-950 rounded-full p-0.5 border border-amber-400/40 shadow-sm"
            strokeWidth={2.5}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Statistics for the public-stats section ───
export interface PlatformStat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  icon: 'Scale' | 'Users' | 'FileText' | 'Building2' | 'Gavel' | 'Clock';
  tint: 'emerald' | 'amber' | 'navy';
}

// ─── Platform statistics (ILLUSTRATIVE — not real data) ───
// These numbers are placeholders for demo purposes. The platform is a
// prototype and these figures do not represent actual metrics.
export const platformStats: PlatformStat[] = [
  { id: 'ps-1', value: 1248, label: 'قوانین و مقررات گردشگری (نمونه)', icon: 'Scale', tint: 'emerald' },
  { id: 'ps-2', value: 8420, suffix: '+', label: 'کاربران فعال (نمونه)', icon: 'Users', tint: 'amber' },
  { id: 'ps-3', value: 364, label: 'قراردادهای تنظیم‌شده (نمونه)', icon: 'FileText', tint: 'navy' },
  { id: 'ps-4', value: 142, label: 'آژانس‌های عضو (نمونه)', icon: 'Building2', tint: 'emerald' },
  { id: 'ps-5', value: 1248, label: 'شکایات رسیدگی‌شده (نمونه)', icon: 'Gavel', tint: 'amber' },
  { id: 'ps-6', value: 96, suffix: '٪', label: 'درصد حل‌وفصل (نمونه)', icon: 'Clock', tint: 'navy' },
];

// ─── Frequently Asked Questions ───
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'مسافر' | 'آژانس' | 'هتل و اقامت' | 'هوانوردی' | 'عمومی';
}

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'در صورت کنسلی پرواز توسط ایرلاین، چه حقوقی دارم؟',
    answer: 'بر اساس آیین‌نامه‌های سازمان هواپیمایی کشوری، در صورت لغو پرواز توسط ایرلاین، مسترد کردن کرایه کامل و در صورت تأخیر طولانی، پرداخت غرامت از حقوق مسافر است. توجه: این پاسخ جنبه عمومی دارد و جایگزین مشاوره حقوقی تخصصی نیست. برای اطلاعات دقیق و به‌روز، به منابع رسمی سازمان هواپیمایی کشوری مراجعه کنید.',
    category: 'هوانوردی',
  },
  {
    id: 'faq-2',
    question: 'هتل می‌تواند کل مبلغ رزرو را ضبط کند؟',
    answer: 'بر اساس مقررات وزارت میراث فرهنگی و گردشگری، جریمه کنسلی هتل معمولاً بر مبنای هزینه شب اول محاسبه می‌شود و هتل حق ضبط مبلغ شب‌های بعدی را ندارد. توجه: درصد جریمه بر اساس زمان کنسلی متفاوت است و این پاسخ جنبه عمومی دارد. برای اطمینان از شرایط دقیق، به بخشنامه‌های رسمی و بند کنسلی قرارداد خود مراجعه کنید.',
    category: 'هتل و اقامت',
  },
  {
    id: 'faq-3',
    question: 'مدت زمان قانونی برای ثبت شکایت گردشگری چقدر است؟',
    answer: 'بر اساس قانون توسعه صنایع گردشگری، مهلت ثبت شکایت از زمان وقوع حادثه یا پایان سفر محدود است. شکایت‌ها از طریق سامانه‌های رسمی پاسخگویی یا دیوان عدالت اداری قابل ثبت هستند. توجه: مهلت دقیق و مراحل ثبت شکایت ممکن است تغییر کند؛ برای اطلاعات به‌روز به منابع رسمی مراجعه کنید.',
    category: 'مسافر',
  },
  {
    id: 'faq-4',
    question: 'آژانس مسافرتی چه بیمه‌ای باید برای مسافران بگیرد؟',
    answer: 'بر اساس مقررات وزارت میراث فرهنگی و گردشگری، آژانس‌های مسافرتی و تورگردان‌ها موظف به تهیه بیمه برای مسافران هستند. توجه: مبلغ دقیق پوشش و جریمه‌ها در بخشنامه‌های رسمی مشخص شده و ممکن است تغییر کند. برای اطلاعات به‌روز به منابع رسمی مراجعه کنید.',
    category: 'آژانس',
  },
  {
    id: 'faq-5',
    question: 'اگر تور توسط آژانس لغو شود، چه غرامتی مستحقم؟',
    answer: 'در صورت لغو تور توسط آژانس بدون دلیل موجه، مسافر مستحق استرداد کامل وجوه دریافتی و در برخی موارد غرامت مازاد است. توجه: درصد دقیق غرامت و شرایط آن در آیین‌نامه‌های رسمی مشخص شده و این پاسخ جنبه عمومی دارد. برای اطمینان به متن قرارداد و منابع رسمی مراجعه کنید.',
    category: 'مسافر',
  },
  {
    id: 'faq-6',
    question: 'آیا قراردادهای شفاهی با آژانس معتبر است؟',
    answer: 'بر اساس قانون توسعه صنایع گردشگری، کلیه قراردادهای گردشگری باید به‌صورت کتبی تنظیم شوند. قرارداد شفاهی از نظر اثبات در مراجع قانونی با چالش مواجه است. توجه: برای اطمینان از حقوق خود، همواره قرارداد کتبی با ذکر تمام شرایط تنظیم کنید.',
    category: 'عمومی',
  },
  {
    id: 'faq-7',
    question: 'گردشگری ورزشی تحت چه قانونی پوشش داده می‌شود؟',
    answer: 'گردشگری ورزشی مشمول مقررات مربوط به فدراسیون‌های ورزشی و آیین‌نامه‌های ایمنی است. ارائه‌دهنده خدمات باید مجوز فدراسیون مربوطه را داشته باشد. توجه: برای اطمینان از مجوز ارائه‌دهنده و شرایط ایمنی، به منابع رسمی مراجعه کنید.',
    category: 'عمومی',
  },
  {
    id: 'faq-8',
    question: 'مدت زمان رسیدگی به شکایت در دیوان عدالت اداری چقدر است؟',
    answer: 'بر اساس قانون دیوان عدالت اداری، شکایت‌های اداری در مدت زمان مشخصی رسیدگی می‌شوند. توجه: مدت دقیق رسیدگی بسته به نوع شکایت و شرایط پرونده متفاوت است و ممکن است تغییر کند. برای اطلاعات به‌روز به سامانه رسمی دیوان عدالت اداری مراجعه کنید.',
    category: 'عمومی',
  },
];

// ─── Law comparison table ───
export interface LawComparisonRow {
  id: string;
  topic: string;
  passengerRight: string;
  agencyObligation: string;
  sanction: string;
  source: string;
}

export const lawComparisonTable: LawComparisonRow[] = [
  {
    id: 'cmp-flight-delay',
    topic: 'تأخیر پرواز',
    passengerRight: 'استرداد کرایه و در صورت تأخیر طولانی پرداخت غرامت',
    agencyObligation: 'اطلاع‌رسانی فوری + ارائه اقامت موقت در صورت لزوم',
    sanction: 'مقررات سازمان هواپیمایی کشوری',
    source: 'آیین‌نامه‌های هواپیمایی (مراجعه به منبع رسمی)',
  },
  {
    id: 'cmp-hotel-cancel',
    topic: 'کنسلی هتل',
    passengerRight: 'استرداد طبق سیاست کنسلی (نمونه)',
    agencyObligation: 'درج شفاف سیاست کنسلی در حین رزرو',
    sanction: 'مقررات وزارت میراث فرهنگی',
    source: 'بخشنامه‌های میراث فرهنگی (مراجعه به منبع رسمی)',
  },
  {
    id: 'cmp-tour-cancel',
    topic: 'لغو تور توسط آژانس',
    passengerRight: 'استرداد کامل + غرامت مازاد در صورت فقدان دلیل موجه',
    agencyObligation: 'اطلاع حداقل ۷۲ ساعت قبل + جایگزینی تور معادل',
    sanction: 'مقررات اداری',
    source: 'آیین‌نامه تورهای داخلی (مراجعه به منبع رسمی)',
  },
  {
    id: 'cmp-no-insurance',
    topic: 'فقدان بیمه مسافر',
    passengerRight: 'مطالبه خسارت کامل از آژانس',
    agencyObligation: 'اخذ بیمه برای هر مسافر',
    sanction: 'مقررات میراث فرهنگی',
    source: 'بخشنامه‌های بیمه (مراجعه به منبع رسمی)',
  },
  {
    id: 'cmp-unsport-act',
    topic: 'گردشگری ورزشی بدون مجوز',
    passengerRight: 'مطالبه خسارت + استرداد کامل هزینه',
    agencyObligation: 'دریافت مجوز فدراسیون مربوطه قبل از ارائه',
    sanction: 'مقررات فدراسیون‌های ورزشی',
    source: 'آیین‌نامه ایمنی گردشگری ورزشی (مراجعه به منبع رسمی)',
  },
];

// ─── Testimonials (SAMPLE — illustrative, not real users) ───
// These testimonials are fictional examples for demo purposes only.
// Names, stories and details are illustrative and do not represent real users.
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarColor: string; // tailwind gradient class pair
  content: string;
  rating: number; // 1–5
  category: 'مسافر' | 'آژانس' | 'وکیل' | 'هتل‌دار';
  date: string;
  verified: boolean; // always false for demo data
  isSample: true; // marks this as sample data
}

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'کاربر نمونه ۱',
    role: 'مسافر',
    avatarColor: 'from-emerald-500 to-teal-600',
    content: '[نمونه] با کمک پلتفرم توانستم شکایت تأخیر پروازم را به‌صورت شفاف ثبت و پیگیری کنم؛ روند رسیدگی برای من قابل فهم بود.',
    rating: 5,
    category: 'مسافر',
    date: 'نمونه',
    verified: false,
    isSample: true,
  },
  {
    id: 't-2',
    name: 'کاربر نمونه ۲',
    role: 'مدیر آژانس گردشگری',
    avatarColor: 'from-amber-500 to-orange-600',
    content: '[نمونه] بخش تنظیم قراردادهای پلتفرم به ما کمک کرد قراردادهای تور را استاندارد و شفاف تنظیم کنیم و اختلاف با مسافر کاهش یافت.',
    rating: 4,
    category: 'آژانس',
    date: 'نمونه',
    verified: false,
    isSample: true,
  },
  {
    id: 't-3',
    name: 'کاربر نمونه ۳',
    role: 'هتل‌دار',
    avatarColor: 'from-navy-500 to-navy-700',
    content: '[نمونه] ابزار محاسبه خسارت کنسلی هتل، شفاف‌سازی شرایط جریمه را برای مهمانان ساده کرد و اختلاف‌ها کمتر شد.',
    rating: 5,
    category: 'هتل‌دار',
    date: 'نمونه',
    verified: false,
    isSample: true,
  },
];
// ─── Legal glossary (quick definitions) ───
export interface GlossaryTerm {
  id: string;
  term: string;
  shortDef: string;
  category: 'حقوق مدنی' | 'قرارداد' | 'مسئولیت' | 'آیین‌نامه' | 'هوانوردی' | 'اقامت';
  example?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  { id: 'g1', term: 'فورس‌ماژور', shortDef: 'رویداد غیرقابل پیش‌بینی و غیرقابل دفع که انجام تعهد را موقتاً یا دائماً غیرممکن می‌کند.', category: 'حقوق مدنی', example: 'زمین‌لرزه، سیل، جنگ، اعتصابات گسترده.' },
  { id: 'g2', term: 'ضمان قابلی', shortDef: 'تعهد شخص به حسن انجام تعهد شخص دیگر در صورت تخلف.', category: 'حقوق مدنی' },
  { id: 'g3', term: 'غرامت', shortDef: 'جبران خسارت مالی وارده به ذی‌نفع در اثر نقض تعهد یا اقدام زیان‌بار.', category: 'مسئولیت' },
  { id: 'g4', term: 'استرداد کرایه', shortDef: 'بازگرداندن مبلغ پرداختی مسافر در صورت لغو سرویس توسط ارائه‌دهنده.', category: 'هوانوردی' },
  { id: 'g5', term: 'کنسلی', shortDef: 'لغو رزرو یا سفارش توسط یکی از طرفین پیش از اجرای آن.', category: 'قرارداد' },
  { id: 'g6', term: 'بیمه مسئولیت مدنی', shortDef: 'بیمه‌ای که خسارات واردشده به اشخاص ثالث در نتیجه فعالیت بیمه‌گزار را پوشش می‌دهد.', category: 'آیین‌نامه' },
  { id: 'g7', term: 'نقص خدمات', shortDef: 'عدم ارائه کامل یا مناسب خدمات وعده‌داده‌شده در قرارداد.', category: 'مسئولیت' },
  { id: 'g8', term: 'بند انحصاری', shortDef: 'بندی در قرارداد که یکی از طرفین را از انتخاب گزینه‌های دیگر محروم می‌کند.', category: 'قرارداد' },
  { id: 'g9', term: 'حق فسخ', shortDef: 'حق یکی از طرفین قرارداد برای برهم زدن آن در شرایط خاص.', category: 'قرارداد' },
  { id: 'g10', term: 'ضمانت اجرا', shortDef: 'مجرم یا متخلف را به انجام تعهد یا تحمل مجازات ملزم می‌کند.', category: 'آیین‌نامه' },
  { id: 'g11', term: 'پروانه استقرار', shortDef: 'مجوز رسمی فعالیت هتل و مراکز اقامتی از وزارت میراث فرهنگی.', category: 'اقامت' },
  { id: 'g12', term: 'بیمه مسافر', shortDef: 'بیمه‌ای که خسارات جسمی و مالی مسافر را در طول سفر پوشش می‌دهد.', category: 'آیین‌نامه' },
  { id: 'g13', term: 'تأخیر پرواز', shortDef: 'تأخیر بیش از ۲ ساعت در زمان پرواز برنامه‌ریزی‌شده.', category: 'هوانوردی' },
  { id: 'g14', term: 'بوم‌گردی', shortDef: 'اقامتگاه کوچک محلی در روستاها با مجوز رسمی وزارت میراث فرهنگی.', category: 'اقامت' },
];

// ─── Live activity ticker items (Hero) ───
export interface ActivityItem {
  id: string;
  text: string;
  icon: 'check' | 'plane' | 'hotel' | 'gavel' | 'file' | 'user';
  timestamp: string;
}

// ─── Live activity ticker (SAMPLE — demo only, not real events) ───
export const activityTicker: ActivityItem[] = [
  { id: 'at-1', text: 'ثبت شکایت جدید برای تأخیر پرواز', icon: 'plane', timestamp: 'نمونه' },
  { id: 'at-2', text: 'تأیید قرارداد تور داخلی کاشان', icon: 'check', timestamp: 'نمونه' },
  { id: 'at-3', text: 'رزرو مشاوره حقوقی تلفنی', icon: 'gavel', timestamp: 'نمونه' },
  { id: 'at-4', text: 'ثبت رزرو هتل نمونه توسط مسافر', icon: 'hotel', timestamp: 'نمونه' },
];
// ─── Contact / Consultation booking data ───
export interface ConsultationType {
  id: string;
  label: string;
  description: string;
  duration: string;
  price: string;
  icon: 'phone' | 'video' | 'office' | 'message';
  available: boolean;
}

export const consultationTypes: ConsultationType[] = [
  { id: 'c1', label: 'مشاوره تلفنی', description: 'گفت‌وگوی تلفنی با وکیل (نمونه)', duration: '۲۰ دقیقه', price: 'تعیین در زمان رزرو', icon: 'phone', available: true },
  { id: 'c2', label: 'مشاوره ویدئویی', description: 'تماس تصویری با اشتراک‌گذاری اسناد (نمونه)', duration: '۳۰ دقیقه', price: 'تعیین در زمان رزرو', icon: 'video', available: true },
  { id: 'c3', label: 'مشاوره حضوری', description: 'ملاقات حضوری (نمونه)', duration: '۴۵ دقیقه', price: 'تعیین در زمان رزرو', icon: 'office', available: true },
  { id: 'c4', label: 'مشاوره متنی', description: 'پرسش و پاسخ متنی (نمونه)', duration: '۲۴ ساعت', price: 'تعیین در زمان رزرو', icon: 'message', available: true },
];

export interface ContactInfo {
  label: string;
  value: string;
  icon: 'phone' | 'mail' | 'map' | 'clock' | 'whatsapp' | 'telegram';
}

// ─── Contact info ───────────────────────────────────────────────────────────
// The online contact form (this page, POST /api/contact) and the support
// email are the two live support channels. Phone/office details will be
// appended once the office line is active.
export const contactInfo: ContactInfo[] = [
  { label: 'فرم تماس آنلاین', value: 'همین صفحه — ثبت پیام و درخواست مشاوره', icon: 'phone' },
  { label: 'ایمیل پشتیبانی', value: 'info@gardeshgary.ir', icon: 'mail' },
  { label: 'ساعات پاسخ‌گویی', value: 'شنبه تا پنجشنبه، ۹ تا ۱۷', icon: 'clock' },
  { label: 'زمان پاسخ', value: 'حداکثر ۲۴ ساعت کاری', icon: 'map' },
];
export const contactInfoDisclaimer = 'پاسخ‌گویی از طریق فرم تماس آنلاین همین صفحه و ایمیل پشتیبانی انجام می‌شود.';

export const contactFormFields = {
  subjects: [
    'شکایت از آژانس مسافرتی',
    'شکایت از هتل یا مرکز اقامتی',
    'شکایت از ایرلاین',
    'تنظیم قرارداد گردشگری',
    'مشاوره حقوقی عمومی',
    'سایر موارد',
  ] as const,
};

// ─── Admin / Panel mock data (SAMPLE — for demo dashboards) ───
// All numbers below are illustrative placeholders, not real metrics.

export interface AdminStat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: 'Users' | 'FileText' | 'AlertTriangle' | 'CheckCircle' | 'Building' | 'Gavel';
}

export const adminStats: AdminStat[] = [
  { id: 'as-1', label: 'کاربران ثبت‌نام‌شده (نمونه)', value: '۸٬۴۲۰', change: '٪۱۲', trend: 'up', icon: 'Users' },
  { id: 'as-2', label: 'شکایات فعال (نمونه)', value: '۲۴۸', change: '٪۸', trend: 'down', icon: 'AlertTriangle' },
  { id: 'as-3', label: 'پرونده‌های حل‌شده (نمونه)', value: '۱٬۲۴۸', change: '٪۱۵', trend: 'up', icon: 'CheckCircle' },
  { id: 'as-4', label: 'آژانس‌های عضو (نمونه)', value: '۱۴۲', change: '٪۳', trend: 'up', icon: 'Building' },
  { id: 'as-5', label: 'قراردادهای تنظیم‌شده (نمونه)', value: '۳۶۴', change: '٪۰', trend: 'neutral', icon: 'FileText' },
  { id: 'as-6', label: 'داوری‌های فعال (نمونه)', value: '۱۸', change: '٪۵', trend: 'up', icon: 'Gavel' },
];
export interface AdminActivity {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  type: 'login' | 'register' | 'claim' | 'consult' | 'content';
}

export const adminActivities: AdminActivity[] = [
  { id: 'aa-1', user: 'کاربر نمونه', role: 'مسافر', action: 'ثبت شکایت تأخیر پرواز', timestamp: 'نمونه', type: 'claim' },
  { id: 'aa-2', user: 'کاربر نمونه', role: 'وکیل', action: 'ورود به پنل وکیل', timestamp: 'نمونه', type: 'login' },
  { id: 'aa-3', user: 'کاربر نمونه', role: 'آژانس', action: 'ثبت‌نام آژانس جدید', timestamp: 'نمونه', type: 'register' },
  { id: 'aa-4', user: 'کاربر نمونه', role: 'مسافر', action: 'رزرو مشاوره تلفنی', timestamp: 'نمونه', type: 'consult' },
];
// ─── Lawyer dashboard mock data ───
export interface LawyerCase {
  id: string;
  title: string;
  client: string;
  status: 'در انتظار' | 'در حال بررسی' | 'حل‌شده';
  date: string;
  category: string;
}

export const lawyerCases: LawyerCase[] = [
  { id: 'lc-1', title: 'شکایت تأخیر پرواز کیش', client: 'کاربر نمونه', status: 'در حال بررسی', date: 'نمونه', category: 'هوانوردی' },
  { id: 'lc-2', title: 'تنظیم قرارداد تور داخلی کاشان', client: 'آژانس نمونه', status: 'در انتظار', date: 'نمونه', category: 'قراردادها' },
  { id: 'lc-3', title: 'داوری کنسلی رزرو هتل', client: 'کاربر نمونه', status: 'حل‌شده', date: 'نمونه', category: 'اقامت' },
];
// ─── Agency dashboard mock data ───
export interface AgencyTour {
  id: string;
  name: string;
  passengers: number;
  status: 'فعال' | 'تکمیل‌شده' | 'لغوشده';
  date: string;
  revenue: string;
}

export const agencyTours: AgencyTour[] = [
  { id: 'agt-1', name: 'تور نمونه کویر مرنجاب', passengers: 25, status: 'فعال', date: 'نمونه', revenue: '[نمونه]' },
  { id: 'agt-2', name: 'تور نمونه کیش', passengers: 40, status: 'تکمیل‌شده', date: 'نمونه', revenue: '[نمونه]' },
  { id: 'agt-3', name: 'تور نمونه تفت و آب‌گرم', passengers: 18, status: 'لغوشده', date: 'نمونه', revenue: '[نمونه]' },
];
// ─── Traveler dashboard mock data ───
export interface TravelerClaim {
  id: string;
  title: string;
  status: 'در حال بررسی' | 'تأیید شده' | 'رد شده';
  date: string;
  amount: string;
}

export const travelerClaims: TravelerClaim[] = [
  { id: 'tc-1', title: 'شکایت تأخیر پرواز', status: 'در حال بررسی', date: 'نمونه', amount: 'تعیین در زمان رأی' },
  { id: 'tc-2', title: 'شکایت کنسلی رزرو هتل', status: 'تأیید شده', date: 'نمونه', amount: 'تعیین در زمان رأی' },
  { id: 'tc-3', title: 'شکایت نقص خدمات تور', status: 'رد شده', date: 'نمونه', amount: 'تعیین در زمان رأی' },
];
