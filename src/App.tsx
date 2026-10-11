import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import FloatingAIOrb from '@/components/FloatingAIOrb';
import ScrollProgress from '@/components/ScrollProgress';
import Reveal from '@/components/Reveal';
import BackToTop from '@/components/BackToTop';
import SectionDivider from '@/components/SectionDivider';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import OfflineBanner from '@/components/OfflineBanner';
import SkipToContent from '@/components/SkipToContent';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';
import PerformanceBadge from '@/components/PerformanceBadge';
import SkeletonLoader from '@/components/SkeletonLoader';
import { ToastProvider } from '@/components/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useHashRoute, ROUTES, type Route } from '@/hooks/useHashRoute';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import SmartGuide from '@/components/SmartGuide';

// Heavy sections are code-split per-page so each page loads only what it needs.
const AIAssistant = lazy(() => import('@/components/AIAssistant'));
const EncyclopediaSection = lazy(() => import('@/components/EncyclopediaSection'));
const RightsHubSection = lazy(() => import('@/components/RightsHubSection'));
const NewsArticlesSection = lazy(() => import('@/components/NewsArticlesSection'));
const CompensationCalculator = lazy(() => import('@/components/CompensationCalculator'));
const ContractGenerator = lazy(() => import('@/components/ContractGenerator'));
const ClaimsDashboard = lazy(() => import('@/components/ClaimsDashboard'));
const StatsSection = lazy(() => import('@/components/StatsSection'));
const LawComparisonTable = lazy(() => import('@/components/LawComparisonTable'));
const LegalGlossary = lazy(() => import('@/components/LegalGlossary'));
const LegalExperts = lazy(() => import('@/components/LegalExperts'));
const DashboardsPreviewSection = lazy(() => import('@/components/DashboardsPreviewSection'));
const Partners = lazy(() => import('@/components/Partners'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const FAQAccordion = lazy(() => import('@/components/FAQAccordion'));
const NotificationsPanel = lazy(() => import('@/components/NotificationsPanel'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));
const LawyerDashboard = lazy(() => import('@/components/LawyerDashboard'));
const AgencyDashboard = lazy(() => import('@/components/AgencyDashboard'));
const UserDashboard = lazy(() => import('@/components/UserDashboard'));

function LazyFallback({ variant = 'cards' }: { variant?: 'cards' | 'list' | 'stat' }) {
  return (
    <div className="py-20 px-4">
      <SkeletonLoader variant={variant} count={3} />
    </div>
  );
}

// ─── Breadcrumb for sub-pages ───
function Breadcrumb({ route }: { route: Route }) {
  const label = ROUTES.find((r) => r.id === route)?.label ?? '';
  if (route === 'home') return null;
  return (
    <nav
      aria-label="مسیر صفحه"
      className="bg-white dark:bg-navy-900 border-b border-navy-100 dark:border-navy-800 pt-20 sm:pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs">
        <a href="#/" className="flex items-center gap-1 text-navy-500 dark:text-navy-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <Home size={13} />
          خانه
        </a>
        <ChevronLeft size={13} className="text-navy-300 dark:text-navy-600" />
        <span className="text-navy-900 dark:text-white font-bold">{label}</span>
      </div>
    </nav>
  );
}

// ─── Page header for sub-pages ───
function PageHeader({ route, description }: { route: Route; description: string }) {
  const label = ROUTES.find((r) => r.id === route)?.label ?? '';
  if (route === 'home') return null;
  return (
    <header className="pt-6 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-navy-950 dark:to-navy-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white mb-2"
        >
          {label}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-sm sm:text-base text-navy-500 dark:text-navy-300 max-w-2xl leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </header>
  );
}

// ─── Route renderers ───
function HomePage() {
  return (
    <>
      <Reveal>
        <Hero />
      </Reveal>
      <SectionDivider variant="wave" />
      {/* Smart Guide — let user describe their problem */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mb-2">
              مشکل حقوقی خود را <span className="gradient-text">بنویسید</span>
            </h2>
            <p className="text-sm text-navy-500 dark:text-navy-400 max-w-2xl mx-auto">
              مشکل خود را به زبان خودتان توضیح دهید — سیستم قوانین مرتبط، مطالب و متخصص مناسب را پیشنهاد می‌دهد
            </p>
          </div>
          <Reveal>
            <SmartGuide />
          </Reveal>
        </div>
      </section>
      <SectionDivider variant="wave" />
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <AIAssistant />
        </Suspense>
      </Reveal>
    </>
  );
}

function LawsPage() {
  return (
    <>
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <EncyclopediaSection />
        </Suspense>
      </Reveal>
      <SectionDivider variant="line" label="مقایسه قوانین" />
      <Reveal>
        <Suspense fallback={<LazyFallback variant="list" />}>
          <LawComparisonTable />
        </Suspense>
      </Reveal>
      <SectionDivider variant="line" label="واژه‌نامه حقوقی" />
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <LegalGlossary />
        </Suspense>
      </Reveal>
    </>
  );
}

function NewsPage() {
  return (
    <Reveal>
      <Suspense fallback={<LazyFallback variant="cards" />}>
        <NewsArticlesSection />
      </Suspense>
    </Reveal>
  );
}

function EncyclopediaPage() {
  return (
    <>
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <EncyclopediaSection />
        </Suspense>
      </Reveal>
      <SectionDivider variant="line" label="واژه‌نامه حقوقی" />
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <LegalGlossary />
        </Suspense>
      </Reveal>
    </>
  );
}

function AiAssistantPage() {
  return (
    <Reveal>
      <Suspense fallback={<LazyFallback variant="cards" />}>
        <AIAssistant />
      </Suspense>
    </Reveal>
  );
}

function ExpertsPage() {
  return (
    <Reveal>
      <Suspense fallback={<LazyFallback variant="cards" />}>
        <LegalExperts />
      </Suspense>
    </Reveal>
  );
}

function ConsultationPage() {
  return (
    <>
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <LegalExperts />
        </Suspense>
      </Reveal>
      <SectionDivider variant="line" label="تماس و رزرو" />
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <ContactSection />
        </Suspense>
      </Reveal>
    </>
  );
}

function TravelerRightsPage() {
  return (
    <Reveal>
      <Suspense fallback={<LazyFallback variant="list" />}>
        <RightsHubSection forceTarget="tourist" />
      </Suspense>
    </Reveal>
  );
}

function BusinessRightsPage() {
  return (
    <>
      <Reveal>
        <Suspense fallback={<LazyFallback variant="list" />}>
          <RightsHubSection forceTarget="business" />
        </Suspense>
      </Reveal>
      <SectionDivider variant="line" label="ابزارهای کسب‌وکار" />
      <Reveal>
        <Suspense fallback={<LazyFallback variant="cards" />}>
          <ContractGenerator />
        </Suspense>
      </Reveal>
    </>
  );
}

function SportsRightsPage() {
  return (
    <Reveal>
      <Suspense fallback={<LazyFallback variant="list" />}>
        <RightsHubSection forceTarget="sports" />
      </Suspense>
    </Reveal>
  );
}

// ─── Dashboard page — renders the role-appropriate panel ───
function DashboardPage() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-night-900 rounded-2xl border border-night-100 dark:border-night-800 p-8">
          <h3 className="text-lg font-bold text-night-900 dark:text-white mb-2">برای دسترسی به پنل، وارد شوید</h3>
          <p className="text-sm text-night-500 dark:text-night-400 mb-4">
            برای مشاهده پنل شخصی خود، ابتدا با یکی از نقش‌های کاربر وارد شوید.
          </p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 bg-jade-600 hover:bg-jade-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            بازگشت به خانه
          </a>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<LazyFallback variant="cards" />}>
      {(user.role === 'SUPERADMIN' || user.role === 'ADMIN') && <AdminDashboard />}
      {user.role === 'USER' && <UserDashboard />}
    </Suspense>
  );
}

function App() {
  useTheme();
  const { route } = useHashRoute();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return;
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') return;
      if (typing) return;
      const key = e.key;
      if (key === '?' || (e.shiftKey && key === '/')) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);
  const openNotifications = useCallback(() => setNotificationsOpen(true), []);
  const closeNotifications = useCallback(() => setNotificationsOpen(false), []);

  const pageDescriptions: Record<Route, string> = {
    home: '',
    laws: 'بانک جامع قوانین، آیین‌نامه‌ها و بخشنامه‌های گردشگری ایران — جستجو، دانشنامه، حقوق مسافر، اخبار و مقایسه قوانین',
    news: 'آخرین اخبار و مقالات تخصصی حقوق گردشگری',
    encyclopedia: 'دانشنامه جامع اصطلاحات و مفاهیم حقوق گردشگری',
    'ai-assistant': 'دستیار هوشمند حقوق گردشگری — پرسش و پاسخ با استناد به قوانین',
    experts: 'جستجو و معرفی وکلای متخصص حقوق گردشگری',
    consultation: 'رزرو مشاوره تخصصی با وکلای حقوق گردشگری',
    'traveler-rights': 'حقوق گردشگر — قوانین و مقررات حفاظت از حقوق مسافران',
    'business-rights': 'حقوق کسب‌وکارهای گردشگری — مقررات آژانس‌ها و هتل‌ها',
    'sports-rights': 'حقوق گردشگری ورزشی — مقررات ایمنی و مجوزها',
    dashboard: 'پنل کاربری شخصی',
  };

  return (
    <AuthProvider>
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-navy-100 selection:bg-emerald-500 selection:text-white relative transition-colors duration-300" dir="rtl">
        <SkipToContent />
        <OfflineBanner />
        <div aria-hidden="true" className="noise-overlay" />
        <ScrollProgress />

        <Header
          onOpenShortcuts={openShortcuts}
          onOpenNotifications={openNotifications}
          currentRoute={route}
        />

        <Breadcrumb route={route} />
        <PageHeader route={route} description={pageDescriptions[route]} />

        <main id="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {route === 'home' && <HomePage />}
              {route === 'laws' && <LawsPage />}
              {route === 'news' && <NewsPage />}
              {route === 'encyclopedia' && <EncyclopediaPage />}
              {route === 'ai-assistant' && <AiAssistantPage />}
              {route === 'experts' && <ExpertsPage />}
              {route === 'consultation' && <ConsultationPage />}
              {route === 'traveler-rights' && <TravelerRightsPage />}
              {route === 'business-rights' && <BusinessRightsPage />}
              {route === 'sports-rights' && <SportsRightsPage />}
              {route === 'dashboard' && <DashboardPage />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />

        <FloatingAIOrb />
        <BackToTop showAfter={600} />
        <CookieConsentBanner />
        <PerformanceBadge devOnly />

        {notificationsOpen && (
          <Suspense fallback={null}>
            <NotificationsPanel isOpen={notificationsOpen} onClose={closeNotifications} />
          </Suspense>
        )}

        <KeyboardShortcutsHelp
          isOpen={shortcutsOpen}
          onClose={closeShortcuts}
          onTriggerSearch={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
          }}
          onTriggerBookmarks={() => {
            document.querySelector<HTMLButtonElement>('button[aria-label*="علاقه‌مندی"]')?.click();
          }}
          onTriggerTheme={() => {
            document.querySelector<HTMLButtonElement>('button[aria-label*="حالت"]')?.click();
          }}
          onTriggerFontSize={() => {
            document.querySelector<HTMLButtonElement>('button[aria-label="اندازه متن"]')?.click();
          }}
        />
      </div>
    </ToastProvider>
    </AuthProvider>
  );
}

export default App;
