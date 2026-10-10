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

export const lawDatabase: LawItem[] = [
  {
    id: 1,
    title: 'قانون توسعه صنایع گردشگری',
    code: 'مصوب ۱۳۸۰',
    category: 'قوانین اصلی',
    excerpt: 'تشویق سرمایه‌گذاری در بخش گردشگری و تسهیل صدور مجوز برای تأسیس واحدهای اقامتی و بومگردی',
    article: 'ماده ۱',
    relevance: 'بالا',
    date: '۱۳۸۰/۰۴/۲۶',
    officialSource: 'روزنامه رسمی شماره ۱۶۴۵۰ - مجلس شورای اسلامی',
    fullText: 'به منظور توسعه صنعت ایرانگردی و جهانگردی، دولت مکلف است با اعمال سیاست‌های حمایتی مالی، گمرکی و تسهیلاتی، زمینه جذب سرمایه‌گذاری بخش خصوصی و خارجی را در احداث هتل‌ها، مراکز اقامتی و بومگردی فراهم آورد. هرگونه عوارض غیرقانونی بر این واحدها ممنوع است.',
    sanction: 'لغو مجوز مدیران خاطی و جریمه نقدی معادل ۲ برابر خسارت وارده به سرمایه‌گذار',
    keyTakeaways: [
      'معافیت‌های مالیاتی ۵۰ درصدی برای تأسیسات گردشگری دارای مجوز رسمی',
      'تعرفه ترجیحی گاز و برق برای هتل‌ها و اقامتگاه‌های بومگردی',
      'تسهیل دریافت تسهیلات بانکی با نرخ سود مصوب شورای پول و اعتبار',
    ],
  },
  {
    id: 2,
    title: 'قانون گردشگری ایران',
    code: 'مصوب ۱۳۹۱',
    category: 'قوانین اصلی',
    excerpt: 'مقررات جامع برای تأسیس و فعالیت آژانس‌های مسافرتی، راهنمایان تور و تعهدات قراردادی در برابر مسافر',
    article: 'ماده ۷',
    relevance: 'بالا',
    date: '۱۳۹۱/۰۶/۱۰',
    officialSource: 'قانون اصلاح ماده ۷ قانون توسعه گردشگری - مصوب مجلس',
    fullText: 'دفاتر خدمات مسافرتی و گردشگری (بند الف، ب و پ) مکلف به رعایت کامل مفاد قراردادهای منعقده با مسافران و ارائه خدمات مطابق با استانداردهای اعلامی وزارت متبوع می‌باشند. هرگونه عدول از تعهدات موجب مسئولیت مدنی و انتظامی خواهد بود.',
    sanction: 'تعلیق فعالیت از ۱ تا ۶ ماه در بار اول، و لغو دائم پروانه فعالیت در صورت تکرار تخلف',
    keyTakeaways: [
      'الزام ثبت قرارداد کتبی رسمی با مهر و امضای مجاز آژانس',
      'ممنوعیت اضافه دریافت بیش از نرخ مصوب تور و خدمات قید شده',
      'الزام تحویل نسخه اصلی قرارداد و بیمه‌نامه به مسافر قبل از سفر',
    ],
  },
  {
    id: 3,
    title: 'قانون مسئولیت تورلیدر در حوادث',
    code: 'آیین‌نامه اجرایی ۱۳۹۲',
    category: 'آیین‌نامه‌ها',
    excerpt: 'تعیین حدود مسئولیت حقوقی و کیفری تورلیدر در قبال حوادث، گم‌شدگی و آسیب‌های جانی مسافران',
    article: 'ماده ۱۴',
    relevance: 'متوسط',
    date: '۱۳۹۲/۰۳/۱۵',
    officialSource: 'آیین‌نامه راهنمایان گردشگری - مصوب هیئت وزیران',
    fullText: 'راهنمای تور مکلف است دستورالعمل‌های فنی و ایمنی مصوب را اجرا کرده و مسافران را در خصوص خطرات احتمالی مسیر توجیه نماید. در صورت قصور، تقصیر یا عدم رعایت احتیاط، تورلیدر ضامن خسارات وارده بر مسافر خواهد بود.',
    sanction: 'ابطال کارت تورلیدری، معرفی به مراجع قضایی کیفری و جبران کامل دیه و خسارات',
    keyTakeaways: [
      'عدم مسئولیت در حوادث ناشی از تخلف عمدی و انفرادی مسافر پس از هشدار رسمی',
      'الزام هماهنگی با پلیس راه و هلال‌احمر در تورهای طبیعت‌گردی و کویری',
      'وجوب همراه داشتن جعبه کمک‌های اولیه و دستگاه‌های موقعیت‌یاب ارتباطی',
    ],
  },
  {
    id: 4,
    title: 'قوانین کنسلی هتل و اقامتگاه',
    code: 'بخشنامه ۱۴۰۰',
    category: 'بخشنامه‌ها',
    excerpt: 'دستورالعمل استرداد وجه و کسر خسارت ناشی از انصراف مسافر از رزرواسیون واحدهای اقامتی کشور',
    article: 'ماده ۳',
    relevance: 'بالا',
    date: '۱۴۰۰/۱۱/۲۰',
    officialSource: 'بخشنامه معاونت گردشگری وزارت میراث فرهنگی و گردشگری',
    fullText: 'در صورت انصراف مهمان از رزرو قطعی اتاق، نحوه محاسبه جریمه به شرح زیر است: بیش از ۷۲ ساعت تا ساعت ۱۴ روز ورود بدون جریمه؛ بین ۴۸ تا ۷۲ ساعت معادل ۲۰٪ هزینه یک شب؛ بین ۲۴ تا ۴۸ ساعت معادل ۵۰٪ هزینه یک شب؛ کمتر از ۲۴ ساعت معادل ۱۰۰٪ هزینه شب اول اقامت.',
    sanction: 'جریمه نقدی هتل متخلف و بازگرداندن اجباری وجه با سود روزشمار قانونی',
    keyTakeaways: [
      'محاسبه جریمه صرفاً بر مبنای هزینه شب اول است نه تمام مدت اقامت',
      'در صورت لغو رزرو به علت وضعیت آب‌وهوایی بحرانی مسدودی راه، استرداد ۱۰۰٪ بدون جریمه الزامی است',
      'هتل‌ها مجاز به وضع قوانین سخت‌گیرانه‌تر از بخشنامه رسمی نیستند',
    ],
  },
  {
    id: 5,
    title: 'حقوق مسافر در تأخیر و کنسلی پرواز',
    code: 'مقررات هوانوردی',
    category: 'آیین‌نامه‌ها',
    excerpt: 'آیین‌نامه حقوق مسافر در پروازهای داخلی: پذیرایی، اسکان هتل، پرواز جایگزین و پرداخت غرامت نقدی',
    article: 'ماده ۹',
    relevance: 'بالا',
    date: '۱۳۹۸/۰۵/۰۸',
    officialSource: 'دستورالعمل حقوق مسافر در پروازهای داخلی - سازمان هواپیمایی کشوری',
    fullText: 'در صورت تأخیر پرواز بیش از ۲ ساعت، ایرلاین موظف به پذیرایی اولیه و برقراری ارتباط رایگان است. تأخیر بیش از ۴ ساعت شامل وعده غذایی گرم و امکان انصراف بدون جریمه با استرداد وجه کامل می‌باشد. تأخیر بیش از ۵ ساعت مستلزم جبران خسارت ۳۰ درصدی علاوه بر استرداد وجه است.',
    sanction: 'جریمه شرکت هواپیمایی و کسر سهمیه پروازی ایرلاین توسط سازمان هواپیمایی کشوری',
    keyTakeaways: [
      'در تأخیرهای شبانه (بیش از ۸ ساعت)، ایرلاین مکلف به اسکان رایگان در هتل مناسب است',
      'انتقال به پرواز سایر شرکت‌های هواپیمایی بدون دریافت مابه‌التفاوت در صورت درخواست مسافر',
      'پرداخت خسارت تأخیر ظرف حداکثر ۷ روز کاری به حساب مسافر',
    ],
  },
];

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
// 1. DANESHNAMEH / ENCYCLOPEDIA DATA (دانشنامه حقوق گردشگری)
// ─────────────────────────────────────────────────────────────
export interface EncyclopediaTerm {
  id: string;
  term: string;
  category: 'اصطلاحات عمومی' | 'قراردادها' | 'مسئولیت مدنی' | 'هوانوردی و اقامت' | 'گردشگری ورزشی';
  shortDef: string;
  fullDef: string;
  lawRef: string;
  keyPoints: string[];
}

export const encyclopediaTerms: EncyclopediaTerm[] = [
  {
    id: 'enc-1',
    term: 'فورس‌ماژور (قوه قاهره)',
    category: 'اصطلاحات عمومی',
    shortDef: 'حوادث غیرقابل پیش‌بینی و غیرقابل اجتناب مانند زلزله، سیل، اپیدمی یا مسدودی قانونی راه‌ها که اجرای تعهد را غیرممکن می‌سازد.',
    fullDef: 'مطابق مواد ۲۲۷ و ۲۲۹ قانون مدنی و بخشنامه‌های وزارت میراث فرهنگی، فورس‌ماژور به حوادث خارجی، غیرقابل پیش‌بینی و غیرقابل دفع گفته می‌شود که موجب لغو سفر می‌گردد. در این وضعیت هیچ‌یک از طرفین خسارت کسر نمی‌کنند و وجوه پرداختی باید مسترد گردد.',
    lawRef: 'مواد ۲۲۷ و ۲۲۹ قانون مدنی ایران - بخشنامه فورس‌ماژور ۱۳۹۹',
    keyPoints: [
      'استرداد ۱۰۰٪ مبالغ به مسافر بدون جریمه',
      'بار اثبات غیرقابل برگشت بودن هزینه‌ها بر عهده آژانس است',
      'اختیار تغییر تاریخ سفر با توافق طرفین',
    ],
  },
  {
    id: 'enc-2',
    term: 'مسئولیت تضامنی در تور',
    category: 'مسئولیت مدنی',
    shortDef: 'مسئولیت مشترک آژانس مسافرتی، کارگزار و تورلیدر در جبران کامل خسارت وارده به مسافر.',
    fullDef: 'بر اساس ماده ۷ قانون گردشگری و قانون حمایت از حقوق مصرف‌کنندگان، چنانچه در پکیج گردشگری آسیبی به مسافر وارد شود یا خدمتی ناقص ارائه گردد، آژانس مجری و تمامی عناصر زنجیره خدمت مسئولیت تضامنی دارند و مسافر می‌تواند برای کل خسارت به آژانس مراجعه کند.',
    lawRef: 'ماده ۷ قانون گردشگری - ماده ۵ قانون حمایت از حقوق مصرف‌کنندگان',
    keyPoints: [
      'امکان مطالبه کل خسارت از آژانس مجری اصلی',
      'رجوع بعدی آژانس به تامین‌کننده خاطی (هتل/ایرلاین)',
      'عدم اعتبار شروط سلب مسئولیت یک‌جانبه در قرارداد',
    ],
  },
  {
    id: 'enc-3',
    term: 'پکیج گردشگری (Tour Package)',
    category: 'قراردادها',
    shortDef: 'مجموعه ترکیبی از حداقل دو خدمت (حمل‌ونقل، اقامت، گشت، تغذیه) که به قیمت کل فروخته می‌شود.',
    fullDef: 'پکیج گردشگری شامل ترکیبی پیش‌طراحی‌شده از خدمات مسافرتی است که تحت یک قرارداد واحد توسط دفاتر بند ب عرضه می‌شود. مجری مکلف به انجام کامل تمام اجزای وعده‌داده‌شده در پکیج است.',
    lawRef: 'آیین‌نامه اجرایی قانون دفاتر خدمات سیاحتی و جهانگردی',
    keyPoints: [
      'الزام به ثبت جزئیات تمام خدمات در قرارداد کتبی',
      'ممنوعیت تغییر ارکان پکیج بدون موافقت کتبی مسافر',
      'شمول بیمه مسئولیت مدنی بر کل اجزای پکیج',
    ],
  },
  {
    id: 'enc-4',
    term: 'حق برداشت مخصوص (SDR) بار',
    category: 'هوانوردی و اقامت',
    shortDef: 'واحد محاسبه بین‌المللی صندوق بین‌المللی پول جهت تعیین سقف غرامت مفقودی چمدان در کنوانسیون مونترال.',
    fullDef: 'در پروازهای بین‌المللی، میزان مسئولیت شرکت‌های هواپیمایی در مفقودی، خسارت یا تأخیر بار بر اساس SDR محاسبه می‌شود. سقف مسئولیت در کنوانسیون مونترال ۱٬۲۸۸ SDR برای هر مسافر تعیین شده است.',
    lawRef: 'کنوانسیون بین‌المللی مونترال ۱۹۹۹ - ماده ۲۲',
    keyPoints: [
      'لزوم تنظیم فرم PIR در فرودگاه قبل از خروج',
      'ارزیابی جبران خسارت بر اساس وزن یا فاکتور رسمی',
      'مهلت ۲۱ روزه برای اعلام مفقودی قطعی بار',
    ],
  },
  {
    id: 'enc-5',
    term: 'بیمه مسئولیت مدنی تورهای ورزشی و ماجراجویانه',
    category: 'گردشگری ورزشی',
    shortDef: 'پوشش بیمه‌ای الزامی برای پوشش هزینه‌های پزشکی، نجات، جستجو و دیه در تورهای طبیعت‌گردی ورزشی.',
    fullDef: 'در تورهای گردشگری ورزشی (کوهنوردی، غواصی، رالی، رفتینگ و صخره‌نوردی)، مجری و لیدر مکلف به اخذ بیمه‌نامه مسئولیت مدنی با کلوزهای اختصاصی حوادث ورزشی و پوشش هلی‌برن نجات هستند.',
    lawRef: 'دستورالعمل نظارت بر تورهای طبیعت‌گردی ورزشی - مصوب ۱۳۹۶',
    keyPoints: [
      'الزام ذکر نام دقیق فعالیت ورزشی در کلوزهای بیمه‌نامه',
      'همراه داشتن مربی / لیدر دارای مدرک فدراسیون مربوطه',
      'اخذ رضایت‌نامه آگاهانه و فرم سلامت از مسافران',
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. NEWS & ARTICLES DATA (اخبار و مقالات تخصصی)
// ─────────────────────────────────────────────────────────────
export interface NewsArticle {
  id: string;
  title: string;
  category: 'اخبار رسمی' | 'بخشنامه‌های جدید' | 'مقالات حقوقی' | 'یادداشت وکلا';
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  author: string;
  imageBg: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'دستورالعمل جدید استرداد هزینه‌های کنسلی پرواز و هتل در سال ۱۴۰۳ ابلاغ شد',
    category: 'بخشنامه‌های جدید',
    date: '',
    readTime: '۴ دقیقه',
    excerpt: 'سازمان هواپیمایی کشوری و وزارت میراث فرهنگی طی بخشنامه‌ای مشترک، جدول جرایم ابطال را شفاف‌سازی کردند.',
    content: 'بر اساس این دستورالعمل جدید، کلیه سامانه‌های فروش آنلاین بلیط و رزرواسیون هتل مکلفند نرخ‌های جریمه کنسلی را به صورت کاملاً شفاف پیش از پرداخت به خریدار نمایش دهند. هرگونه کسر جریمه بیش از سقف‌های مصوب قانونی تخلف تعزیراتی محرز محسوب می‌شود...',
    author: 'دفتر نظارت بر حقوق مصرف‌کنندگان گردشگری',
    imageBg: 'from-emerald-900 to-navy-950',
  },
  {
    id: 'news-2',
    title: 'بررسی مسئولیت حقوقی آژانس‌های گردشگری در تورهای طبیعت‌گردی و کویر',
    category: 'مقالات حقوقی',
    date: '',
    readTime: '۷ دقیقه',
    excerpt: 'تحلیل دقیق آرای قضایی صادرشده در خصوص حوادث کویرمرنجاب و لزوم همراه داشتن تجهیزات موقعیت‌یاب.',
    content: 'در این مقاله تخصصی، ابعاد حقوقی مسئولیت تضامنی آژانس مجری و تورلیدر در مواجهه با خطرات محیطی، مسدودی مسیر و حوادث رانندگی اتوبوس‌های دربستی بررسی شده است...',
    author: '[نمونه]',
    imageBg: 'from-amber-900 to-navy-950',
  },
  {
    id: 'news-3',
    title: 'حقوق مسافران در صورت لغو یک‌طرفه پروازهای چارتر توسط ایرلاین‌ها',
    category: 'اخبار رسمی',
    date: '',
    readTime: '۵ دقیقه',
    excerpt: 'سازمان هواپیمایی کشوری: پروازهای چارتر تابع همان قوانین پروازهای سیستمی در پرداخت غرامت هستند.',
    content: 'بر خلاف ادعای برخی دفاتر فروش، لغو پرواز چارتر بیش از ۲۴ ساعت قبل توسط ایرلاین یا چارتونامه‌دار، حق مسافر برای دریافت ۳۰٪ غرامت نقدی علاوه بر استرداد وجه کامل بلیط را سلب نمی‌کند...',
    author: 'روابط عمومی سازمان هواپیمایی کشوری',
    imageBg: 'from-blue-900 to-navy-950',
  },
];

// ─────────────────────────────────────────────────────────────
// 3. RIGHTS HUB DATA (حقوق گردشگر، کسب‌وکار، گردشگری ورزشی)
// ─────────────────────────────────────────────────────────────
export interface RightsGuide {
  id: string;
  title: string;
  target: 'tourist' | 'business' | 'sports';
  iconName: string;
  summary: string;
  details: string[];
  lawCitations: string[];
}

export const rightsGuides: RightsGuide[] = [
  // Tourist Rights
  {
    id: 'rt-1',
    title: 'حقوق مسافر در تأخیر و ابطال پروازهای داخلی',
    target: 'tourist',
    iconName: 'Plane',
    summary: 'در تأخیرهای بالای ۲ ساعت پذیرایی، بالای ۴ ساعت حق انصراف کامل و بالای ۵ ساعت پرداخت ۳۰٪ غرامت نقدی الزامی است.',
    details: [
      'دریافت گواهی مکتوب تأخیر از مسئول ایستگاه فرودگاهی',
      'استرداد ۱۰۰٪ وجه بلیط بدون کسر جریمه در تأخیر بالای ۴ ساعت',
      'اسکان رایگان در هتل مناسب در تأخیرهای شبانه (بالای ۸ ساعت)',
    ],
    lawCitations: ['دستورالعمل حقوق مسافر هوانوردی کشوری - ماده ۹'],
  },
  {
    id: 'rt-2',
    title: 'حقوق مهمان در کنسلی و مغایرت خدمات هتل',
    target: 'tourist',
    iconName: 'Hotel',
    summary: 'جریمه انصراف تا ۷۲ ساعت قبل صفر است و کسر جریمه صرفاً بر مبنای هزینه شب اول محاسبه می‌شود.',
    details: [
      'عدم جواز هتل در کسر هزینه شب‌های دوم به بعد در صورت کنسلی',
      'الزام به جابجایی مهمان به هتل هم‌رده در صورت عدم ارائه اتاق رزروشده',
      'استرداد کامل وجه بدون جریمه در شرایط فورس‌ماژور با ارائه مستند',
    ],
    lawCitations: ['بخشنامه کنسلی هتل‌ها مصوب ۱۴۰۰ - ماده ۳'],
  },
  {
    id: 'rt-3',
    title: 'حقوق مسافر در لغو تور و تغییر برنامه توسط آژانس',
    target: 'tourist',
    iconName: 'Shield',
    summary: 'در صورت لغو تور از سوی آژانس پیش از شروع سفر، استرداد کامل به‌علاوه جبران خسارت معقول الزامی است.',
    details: [
      'الزام اعلام رسمی لغو حداقل ۴۸ ساعت پیش از شروع تور',
      'پرداخت ۱۰ تا ۳۰ درصد مبلغ تور به‌عنوان خسارت قراردادی',
      'حق انتخاب مسافر بین استرداد وجه یا جایگزینی تور هم‌ارزش',
    ],
    lawCitations: ['قانون گردشگری ایران - ماده ۷ و آیین‌نامه اجرایی آن'],
  },
  {
    id: 'rt-4',
    title: 'بیمه مسافرتی و جبران خسارت جسمی در حوادث تور',
    target: 'tourist',
    iconName: 'Shield',
    summary: 'الزام اخذ بیمه‌نامه مسئولیت مدنی برای هر مسافر پیش از صدور بلیط و قرارداد تور.',
    details: [
      'حداقل پوشش مالی ۵۰۰ میلیون ریال برای هر مسافر',
      'پوشش هزینه نجات و انتقال اضطراری به مراکز درمانی',
      'مسئولیت تضامنی آژانس و بیمه‌گر در تأخیر جبران خسارت',
    ],
    lawCitations: ['بخشنامه بیمه مسئولیت گردشگری - بیمه مرکزی ایران'],
  },

  // Business Rights (کسب‌وکارها)
  {
    id: 'rb-1',
    title: 'معافیت‌های مالیاتی و حقوقی آژانس‌ها و اقامتگاه‌ها',
    target: 'business',
    iconName: 'Building',
    summary: 'معافیت ۵۰ درصدی مالیات بر درآمد برای تمامی تاسیسات گردشگری دارای مجوز رسمی از وزارت میراث فرهنگی.',
    details: [
      'شمول تعرفه ترجیحی گاز، برق و آب برای هتل‌ها و بومگردی‌ها',
      'عدم امکان وضع عوارض شهرداری غیرقانونی بر دفاتر مسافرتی',
      'تسهیلات کم‌بهره ساخت و تجهیز تأسیسات اقامتی و گردشگری',
    ],
    lawCitations: ['قانون توسعه صنایع ایرانگردی و جهانگردی - ماده ۱۳'],
  },
  {
    id: 'rb-2',
    title: 'ضوابط قانونی صدور ووچر و صیانت از ضمانت‌نامه‌ها',
    target: 'business',
    iconName: 'Shield',
    summary: 'قواعد حمایت از دفاتر مسافرتی در برابر ضبط غیرقانونی ضمانت‌نامه‌های بانکی نزد مراجع دولتی.',
    details: [
      'مهلت رسیدگی به تخلفات قبل از هرگونه اقدام روی ضمانت‌نامه',
      'شرایط قانونی فسخ قراردادهای کارگزاری پروازهای چارتر',
      'حمایت‌های حقوقی در برابر عدم تسویه‌حساب تامین‌کنندگان خارجی',
    ],
    lawCitations: ['آیین‌نامه نظارت بر دفاتر خدمات سیاحتی و جهانگردی'],
  },
  {
    id: 'rb-3',
    title: 'الزامات قرارداد رسمی آژانس با مسافر',
    target: 'business',
    iconName: 'Building',
    summary: 'الزام تنظیم قرارداد کتبی با مهر و امضای مجاز آژانس و تحویل نسخه به مسافر پیش از سفر.',
    details: [
      'ذکر دقیق خدمات، هزینه‌ها و تعرفه‌ها در قرارداد',
      'الزام تحویل بیمه‌نامه و بلیط/ووچر به مسافر پیش از حرکت',
      'مسئولیت انتظامی آژانس در صورت عدول از تعهدات',
    ],
    lawCitations: ['قانون گردشگری - ماده ۷ و آیین‌نامه راهنمایان گردشگری'],
  },

  // Sports Tourism Rights (گردشگری ورزشی)
  {
    id: 'rs-1',
    title: 'حقوق و مسئولیت‌ها در تورهای کوهنوردی، غواصی و رفتینگ',
    target: 'sports',
    iconName: 'Compass',
    summary: 'الزام به همراه داشتن راهنمای دارای کارت فدراسیون ورزشی و اخذ بیمه‌نامه حوادث با کلوز ورزشی.',
    details: [
      'تکلیف اخذ فرم رضایت‌آگاهانه و سابقه پزشکی قبل از ثبت‌نام',
      'تأمین تجهیزات ایمنی استاندارد (جلیقه نجات، کلاه ایمنی، طناب نجات)',
      'مسئولیت مدنی لیدر در صورت صعود در شرایط هشدار قرمز هواشناسی',
    ],
    lawCitations: ['دستورالعمل ساماندهی تورهای طبیعت‌گردی ورزشی مصوب ۱۳۹۶'],
  },
  {
    id: 'rs-2',
    title: 'ضوابط برگزاری تورهای رالی، سافاری و کویرنوردی',
    target: 'sports',
    iconName: 'Flag',
    summary: 'الزامات قانونی ورود به مناطق تحت حفاظت، معاینه فنی خودروهای ۲ دیفرانسیل و مجوزهای نیروی انتظامی.',
    details: [
      'اخذ مجوز تردد گروهی از دریگابانی و پلیس راهور استان',
      'تجهیز ناوگان به سامانه موقعیت‌یاب ماهواره‌ای و بی‌سیم ارتباطی',
      'مسئولیت لیدر در حفاظت از پوشش گیاهی و محیط زیست منطقه',
    ],
    lawCitations: ['دستورالعمل مشترک سازمان راهداری و فدراسیون اتومبیلرانی'],
  },
  {
    id: 'rs-3',
    title: 'بیمه و مسئولیت مدنی در ورزش‌های پرخطر (پاراگلایدر، پارکور)',
    target: 'sports',
    iconName: 'Shield',
    summary: 'الزام اخذ بیمه‌نامه تخصصی با پوشش کامل خسارت جسمی برای شرکت‌کنندگان و اشخاص ثالث.',
    details: [
      'حداقل پوشش ۱ میلیارد ریال برای خسارت جسمی و معلولیت',
      'الزام ارائه گواهی سلامت و عدم مصرف داروی ممنوعه',
      'مسئولیت تضامنی برگزارکننده و مدرس در حوادث آموزشی',
    ],
    lawCitations: ['آیین‌نامه ایمنی ورزش‌های ماجراجویانه - فدراسیون ورزش‌های مردمی'],
  },
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

// ─── Legal experts directory (SAMPLE — for demo only, not real lawyers) ───
// Names, bios and stats below are clearly fictional sample data for demo
// purposes. They do not represent real lawyers or real law practices.
export interface Expert {
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

export const experts: Expert[] = [
  {
    id: 1,
    name: 'وکیل نمونه ۱',
    specialty: 'حقوق بین‌الملل گردشگری (نمونه)',
    badges: ['متخصص قراردادهای اقامتی', 'حقوق بین‌الملل گردشگری'],
    rating: 4.9,
    reviews: 127,
    experience: '۱۲ سال',
    city: 'تهران',
    avatar: 'و۱',
    bio: '[نمونه] وکیل تخصصی دعاوی آژانس‌های بین‌المللی مسافرتی و قراردادهای اقامتی — پروفایل نمایشی، اطلاعات واقعی نیست.',
  },
  {
    id: 2,
    name: 'وکیل نمونه ۲',
    specialty: 'قراردادهای گردشگری و تور (نمونه)',
    badges: ['حقوق مصرف‌کننده', 'متخصص حقوق هواپیمایی'],
    rating: 4.8,
    reviews: 98,
    experience: '۹ سال',
    city: 'اصفهان',
    avatar: 'و۲',
    bio: '[نمونه] مشاور حقوقی صنفی دفاتر خدمات مسافرتی و تنظیم قراردادهای تور — پروفایل نمایشی.',
  },
  {
    id: 3,
    name: 'وکیل نمونه ۳',
    specialty: 'حقوق هوانوردی و بیمه مسافر (نمونه)',
    badges: ['متخصص بیمه مسافرتی', 'متخصص حقوق هواپیمایی'],
    rating: 4.7,
    reviews: 84,
    experience: '۷ سال',
    city: 'شیراز',
    avatar: 'و۳',
    bio: '[نمونه] متخصص دعاوی تأخیر و لغو پرواز و پوشش بیمه مسافر — پروفایل نمایشی.',
  },
];

export const expertFilters = [
  'همه',
  'متخصص قراردادهای اقامتی',
  'حقوق بین‌الملل گردشگری',
  'حقوق مصرف‌کننده',
  'متخصص بیمه مسافرتی',
  'متخصص حقوق هواپیمایی',
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
  { id: 'at-3', text: 'رزرو مشاوره حقوقی با وکیل نمونه', icon: 'gavel', timestamp: 'نمونه' },
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
