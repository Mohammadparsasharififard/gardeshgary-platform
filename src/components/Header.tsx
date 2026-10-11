import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, LogIn, UserCheck, LogOut, Search, Bookmark, HelpCircle, Bell, ChevronDown } from 'lucide-react';
import { type LawItem } from '@/data';
import { BrandLogo } from '@/components/BrandLogo';
import { useToast } from '@/components/Toast';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNotifications } from '@/hooks/useNotifications';
import { useHashRoute, NAV_GROUPS, ROUTES, type Route } from '@/hooks/useHashRoute';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ThemeToggle';
import FontSizeControl from '@/components/FontSizeControl';

// Heavy overlays are code-split: their chunks load only when first opened
const AuthModal = lazy(() => import('@/components/AuthModal'));
const GlobalSearchModal = lazy(() => import('@/components/GlobalSearchModal'));
const LawDetailModal = lazy(() => import('@/components/LawDetailModal'));
const BookmarksPanel = lazy(() => import('@/components/BookmarksPanel'));

export default function Header({ onOpenShortcuts, onOpenNotifications, currentRoute }: { onOpenShortcuts?: () => void; onOpenNotifications?: () => void; currentRoute?: Route }) {
  const { showToast } = useToast();
  const { count } = useBookmarks();
  const { unreadCount } = useNotifications();
  const { navigate } = useHashRoute();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showBookmarksPanel, setShowBookmarksPanel] = useState(false);
  const [selectedLawModal, setSelectedLawModal] = useState<LawItem | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // On sub-pages (non-home), always treat the header as "scrolled" so it has a
  // solid background and never overlaps the page's content when the user
  // scrolls back to the top. On the home page, keep the transparent-when-at-top
  // behavior so the hero looks immersive.
  const isHome = currentRoute === 'home';

  // Home sits over the dark hero: when scrolled there, swap the light glass bar
  // for the dark one (.glass-nav-dark) and keep the white "over-hero" text
  // variants. Sub-pages keep the exact current (light glass + dark text) look.
  const homeScrolled = isHome && scrolled;
  const whiteText = !scrolled || isHome;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openDropdown]);

  const handleLogout = () => {
    logout();
    showToast('با موفقیت از حساب کاربری خارج شدید', 'info');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? `${homeScrolled ? 'glass-nav-dark' : 'glass-nav'} shadow-premium py-2`
            : 'bg-transparent py-3.5'
        }`}
      >
        {/* Top accent line when scrolled */}
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <a href="#/" className="flex items-center gap-3 group" aria-label="پلتفرم ملی حقوق گردشگری — خانه">
              <motion.div whileHover={{ scale: 1.05, rotate: 3 }} transition={{ type: 'spring', stiffness: 300 }}>
                <BrandLogo size={42} withText={false} />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className={`text-base font-extrabold leading-tight transition-colors duration-300 ${whiteText ? 'text-white' : 'text-navy-900 dark:text-white'}`}>
                  پلتفرم ملی حقوق گردشگری
                </h1>
                <p className={`text-[10px] leading-tight font-medium transition-colors duration-300 ${whiteText ? 'text-emerald-300' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  مرجع تخصصی حقوقی گردشگری ایران
                </p>
              </div>
            </a>

            {/* Desktop Nav — grouped dropdowns (2xl+) */}
            <nav className="hidden 2xl:flex items-center gap-1" aria-label="ناوبری اصلی" ref={dropdownRef}>
              {/* Home button */}
              <button
                type="button"
                onClick={() => navigate('home')}
                aria-current={currentRoute === 'home' ? 'page' : undefined}
                className={`relative px-3 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  !whiteText
                    ? 'text-navy-700 dark:text-navy-200 hover:bg-jade-50/50 dark:hover:bg-navy-800'
                    : currentRoute === 'home'
                      ? 'text-white bg-white/20 font-extrabold'
                      : 'text-white/90 hover:bg-white/10'
                }`}
              >
                خانه
              </button>

              {/* Dropdown groups */}
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === group.label}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      !whiteText
                        ? 'text-navy-700 dark:text-navy-200 hover:bg-jade-50/50 dark:hover:bg-navy-800'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {group.label}
                    <ChevronDown size={13} className={`transition-transform ${openDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === group.label && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-700 shadow-premium p-1.5 z-50"
                      >
                        {group.items.map((item) => {
                          const isActive = currentRoute === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => { navigate(item.id); setOpenDropdown(null); }}
                              aria-current={isActive ? 'page' : undefined}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-right ${
                                isActive
                                  ? 'bg-jade-50 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300'
                                  : 'text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-800'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Dashboard */}
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                aria-current={currentRoute === 'dashboard' ? 'page' : undefined}
                className={`relative px-3 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  !whiteText
                    ? currentRoute === 'dashboard'
                      ? 'text-jade-700 dark:text-jade-300 bg-jade-50/90 dark:bg-jade-900/40 font-extrabold'
                      : 'text-navy-700 dark:text-navy-200 hover:bg-jade-50/50 dark:hover:bg-navy-800'
                    : currentRoute === 'dashboard'
                      ? 'text-white bg-white/20 font-extrabold'
                      : 'text-white/90 hover:bg-white/10'
                }`}
              >
                پنل کاربری
              </button>
            </nav>

            {/* CTA / Right side controls */}
            <div className="flex items-center gap-1.5">
              {/* Search Button Trigger */}
              <button
                onClick={() => setShowSearchModal(true)}
                aria-label="جستجوی هوشمند (میانبر: Ctrl و K)"
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs shrink-0 transition-all ${
                  !whiteText
                    ? 'bg-navy-50 dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-700 border border-navy-200 dark:border-navy-700'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                }`}
                title="جستجوی هوشمند (Ctrl+K)"
              >
                <Search size={15} />
                <span className="hidden xl:inline font-semibold">جستجو...</span>
              </button>

              {/* Theme toggle */}
              <ThemeToggle variant="icon" scrolled={!whiteText} />

              {/* Font-size control — only on md+ */}
              <div className="hidden md:block">
                <FontSizeControl scrolled={!whiteText} />
              </div>

              {/* Keyboard shortcuts help — only on md+ */}
              <button
                type="button"
                onClick={() => onOpenShortcuts?.()}
                aria-label="راهنمای میانبرهای صفحه‌کلید (میانبر: ?)"
                title="راهنمای میانبرها (؟)"
                className={`hidden md:flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  !whiteText
                    ? 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700 border border-navy-200 dark:border-navy-700'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                }`}
              >
                <HelpCircle size={16} />
              </button>

              {/* Notifications button with unread badge */}
              <button
                onClick={() => onOpenNotifications?.()}
                aria-label={`اعلان‌ها — ${unreadCount.toLocaleString('fa-IR')} مورد خوانده‌نشده`}
                className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all border ${
                  !whiteText
                    ? 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300 border-navy-200 dark:border-navy-700'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/15'
                }`}
                title="اعلان‌های شما"
              >
                <Bell size={16} className={unreadCount > 0 ? 'animate-bob' : ''} />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      key={unreadCount}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-navy-900 shadow-glow-amber"
                    >
                      {unreadCount.toLocaleString('fa-IR')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Bookmarks button with live count badge */}
              <button
                onClick={() => setShowBookmarksPanel(true)}
                aria-label={`علاقه‌مندی‌ها — ${count} مورد ذخیره‌شده`}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs shrink-0 transition-all border ${
                  !whiteText
                    ? 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-700 hover:text-emerald-700 dark:hover:text-emerald-300 border-navy-200 dark:border-navy-700'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/15'
                }`}
                title="علاقه‌مندی‌های شما"
              >
                <Bookmark size={15} className={count > 0 ? 'fill-current' : ''} />
                <span className="hidden md:inline font-semibold">علاقه‌مندی</span>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-glow-amber"
                    >
                      {count.toLocaleString('fa-IR')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                    <UserCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="خروج از حساب"
                    className="p-2 rounded-xl text-navy-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  {/* Full button — sm and up */}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="relative hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 shadow-glow hover:scale-105 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <LogIn size={16} className="group-hover:scale-110 transition-transform relative" />
                    <span className="relative">ورود / ثبت‌نام اعضا</span>
                  </button>
                  {/* Compact icon-only button — visible on mobile (<640px) so
                      login stays reachable without opening the hamburger */}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    aria-label="ورود و ثبت‌نام"
                    title="ورود / ثبت‌نام"
                    className="relative flex sm:hidden items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 transition-all duration-200 shadow-glow"
                  >
                    <LogIn size={16} />
                  </button>
                </>
              )}

              <button
                className="2xl:hidden p-2 rounded-xl transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'بستن منوی ناوبری' : 'باز کردن منوی ناوبری'}
                aria-expanded={mobileOpen}
              >
                {whiteText ? <Menu className="text-white" /> : <Menu className="text-navy-900 dark:text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="2xl:hidden overflow-hidden glass-nav border-t border-navy-100 dark:border-navy-800 max-h-[85vh] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-1">
                {ROUTES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { navigate(r.id); setMobileOpen(false); }}
                    className={`w-full text-right block px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      currentRoute === r.id
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'text-navy-700 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-800 hover:text-emerald-700 dark:hover:text-emerald-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}

                <button
                  onClick={() => { setMobileOpen(false); setShowBookmarksPanel(true); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-navy-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark size={15} />
                    علاقه‌مندی‌های من
                  </span>
                  {count > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {count.toLocaleString('fa-IR')}
                    </span>
                  )}
                </button>

                {/* Theme toggle row in mobile drawer */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-navy-700 dark:text-navy-200">
                  <span>حالت نمایش</span>
                  <ThemeToggle variant="menu" scrolled={true} />
                </div>

                {/* Font size + shortcuts row in mobile drawer */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-navy-700 dark:text-navy-200">
                  <span>اندازه متن</span>
                  <FontSizeControl scrolled={true} />
                </div>
                <button
                  onClick={() => { setMobileOpen(false); onOpenShortcuts?.(); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-navy-700 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={15} />
                    راهنمای میانبرهای صفحه‌کلید
                  </span>
                  <kbd className="kbd">؟</kbd>
                </button>

                <button
                  onClick={() => { setMobileOpen(false); onOpenNotifications?.(); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-navy-700 dark:text-navy-200 hover:bg-emerald-50 dark:hover:bg-navy-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bell size={15} />
                    اعلان‌ها
                  </span>
                  {unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount.toLocaleString('fa-IR')}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="pt-3 border-t border-navy-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">{user.name}</span>
                    <button onClick={handleLogout} className="text-xs text-red-600 font-bold">خروج</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); setShowAuthModal(true); }}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-glow"
                  >
                    <LogIn size={16} />
                    ورود / ثبت‌نام
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth Modal — mounted only while open so its chunk stays out of the initial bundle */}
      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={() => {}}
          />
        </Suspense>
      )}

      {/* Global Search Modal */}
      {showSearchModal && (
        <Suspense fallback={null}>
          <GlobalSearchModal
            isOpen={showSearchModal}
            onClose={() => setShowSearchModal(false)}
            onSelectLaw={(law) => setSelectedLawModal(law)}
          />
        </Suspense>
      )}

      {/* Bookmarks Panel */}
      {showBookmarksPanel && (
        <Suspense fallback={null}>
          <BookmarksPanel
            isOpen={showBookmarksPanel}
            onClose={() => setShowBookmarksPanel(false)}
            onOpenLaw={(law) => setSelectedLawModal(law)}
          />
        </Suspense>
      )}

      {/* Law Detail Modal from Global Search / Bookmarks */}
      {selectedLawModal && (
        <Suspense fallback={null}>
          <LawDetailModal
            law={selectedLawModal}
            onClose={() => setSelectedLawModal(null)}
          />
        </Suspense>
      )}
    </>
  );
}
