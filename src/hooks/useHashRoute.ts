import { useState, useEffect, useCallback } from 'react';

/**
 * Platform routes — structured to match the client's requested IA:
 *
 *  ┌─ خانه (home)
 *  ├─ دانش و قوانین (knowledge)
 *  │   ├─ بانک قوانین (laws)
 *  │   ├─ دانشنامه (encyclopedia)
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
  | 'encyclopedia'
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
      { id: 'encyclopedia', label: 'دانشنامه', hash: '#/encyclopedia', icon: 'BookOpen' },
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
    const onHashChange = () => {
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
