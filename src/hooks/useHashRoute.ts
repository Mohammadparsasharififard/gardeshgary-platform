import { useState, useEffect, useCallback } from 'react';

/**
 * Platform routes — structured to match the client's requested IA:
 *
 *  ┌─ خانه (home)
 *  ├─ دانش و قوانین (knowledge)
 *  │   ├─ بانک قوانین (laws)
 *  │   ├─ اخبار و مقالات (news)
 *  │   └─ حقوق گردشگری ورزشی (sports-rights)
 *  ├─ خدمات (services)
 *  │   ├─ دستیار هوشمند (ai-assistant)
 *  │   ├─ حقوق گردشگر (traveler-rights)
 *  │   └─ حقوق کسب‌وکار (business-rights)
 *  ├─ متخصصان و مشاوره (experts)
 *  │   └─ مشاوره و رزرو (consultation)
 *  ├─ پنل کاربری (dashboard)
 *
 * Future expansion slots (not yet wired):
 *  - آموزش و رویدادها (academy)
 *  - داوری (arbitration)
 *  - قراردادساز (contract-builder)
 *  - ارزیابی ریسک (risk-assessment)
 *  - پرداخت (payments)
 *  - استان‌ها (provinces)
 */
export type Route =
  | 'home'
  | 'laws'
  | 'news'
  | 'sports-rights'
  | 'ai-assistant'
  | 'traveler-rights'
  | 'business-rights'
  | 'experts'
  | 'consultation'
  | 'dashboard';

// ─── Top-level nav groups (for dropdown menus) ───
export interface NavGroup {
  label: string;
  items: { id: Route; label: string; hash: string; icon: string }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'دانش و قوانین',
    items: [
      { id: 'laws', label: 'بانک قوانین', hash: '#/laws', icon: 'Scale' },
      { id: 'news', label: 'اخبار و مقالات', hash: '#/news', icon: 'Newspaper' },
      { id: 'sports-rights', label: 'حقوق ورزشی', hash: '#/sports-rights', icon: 'Activity' },
    ],
  },
  {
    label: 'خدمات',
    items: [
      { id: 'ai-assistant', label: 'دستیار هوشمند', hash: '#/ai-assistant', icon: 'Sparkles' },
      { id: 'traveler-rights', label: 'حقوق گردشگر', hash: '#/traveler-rights', icon: 'UserCheck' },
      { id: 'business-rights', label: 'حقوق کسب‌وکار', hash: '#/business-rights', icon: 'Building' },
    ],
  },
  {
    label: 'متخصصان',
    items: [
      { id: 'experts', label: 'جستجوی متخصصان', hash: '#/experts', icon: 'Users' },
      { id: 'consultation', label: 'مشاوره و رزرو', hash: '#/consultation', icon: 'MessageCircle' },
    ],
  },
];

// Flat route list (for router lookup)
export const ROUTES: { id: Route; label: string; hash: string; icon: string }[] = [
  { id: 'home', label: 'خانه', hash: '#/', icon: 'Home' },
  ...NAV_GROUPS.flatMap((g) => g.items),
  { id: 'dashboard', label: 'پنل کاربری', hash: '#/dashboard', icon: 'LayoutDashboard' },
];

function readHash(): Route {
  if (typeof window === 'undefined') return 'home';
  const h = window.location.hash.replace(/^#\/?/, '').replace(/\/.*$/, '');
  // Legacy 'encyclopedia' route was merged into 'laws' — old links keep working.
  if (h === 'encyclopedia') return 'laws';
  const match = ROUTES.find((r) => r.id === h);
  return match ? match.id : 'home';
}

export function useHashRoute(): {
  route: Route;
  navigate: (route: Route) => void;
  path: string;
} {
  const [route, setRoute] = useState<Route>(readHash);

  useEffect(() => {
    // The browser's history scroll restoration fights the route-change
    // scrollTo (returning home kept the old scroll position) — take manual
    // control so every hash-route change lands at the top of the page.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Legacy '#/encyclopedia' deep links are merged into '#/laws' — rewrite
    // the URL visibly (init + hashchange) instead of silently aliasing it.
    const rewriteLegacyHash = () => {
      const h = window.location.hash.replace(/^#\/?/, '').replace(/\/.*$/, '');
      if (h === 'encyclopedia') {
        window.location.hash = '#/laws';
        return true;
      }
      return false;
    };

    // Init pass: normalize a legacy hash present at load time.
    rewriteLegacyHash();

    const onHashChange = () => {
      // Rewriting the hash fires another hashchange — let it do the work.
      if (rewriteLegacyHash()) return;
      setRoute(readHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    const r = ROUTES.find((x) => x.id === next);
    if (r) {
      window.location.hash = r.hash;
    }
  }, []);

  return { route, navigate, path: window.location.hash };
}

export default useHashRoute;
