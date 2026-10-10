import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from '@/components/Toast';

export interface BookmarkItem {
  /** Accepts LawItem.id (number) or any string id — coerced to string for storage */
  id: string | number;
  title: string;
  excerpt: string;
  article?: string;
  category?: string;
  code?: string;
  savedAt: number;
}

const STORAGE_KEY = 'gardeshgary.bookmarks.v1';

/**
 * useBookmarks — persistent collection of saved laws / legal items.
 *
 * Cross-component: any component can call this hook and operate on the same
 * shared list (backed by localStorage + the cross-tab `storage` event).
 *
 * Returns the list, toggle helper, count, has(id) check, and clear().
 */
export function useBookmarks() {
  const [items, setItems] = useLocalStorage<BookmarkItem[]>(STORAGE_KEY, []);
  const { showToast } = useToast();

  const has = useCallback(
    (id: string | number) => items.some((it) => String(it.id) === String(id)),
    [items],
  );

  const toggle = useCallback(
    (item: Omit<BookmarkItem, 'savedAt'>) => {
      const key = String(item.id);
      setItems((prev) => {
        if (prev.some((it) => String(it.id) === key)) {
          showToast('از علاقه‌مندی‌ها حذف شد', 'info');
          return prev.filter((it) => String(it.id) !== key);
        }
        showToast('به علاقه‌مندی‌ها اضافه شد', 'success');
        return [{ ...item, id: key, savedAt: Date.now() }, ...prev];
      });
    },
    [setItems, showToast],
  );

  const remove = useCallback(
    (id: string | number) => {
      const key = String(id);
      setItems((prev) => prev.filter((it) => String(it.id) !== key));
    },
    [setItems],
  );

  const clear = useCallback(() => {
    setItems([]);
    showToast('فهرست علاقه‌مندی‌ها پاک شد', 'info');
  }, [setItems, showToast]);

  const count = items.length;
  const sorted = useMemo(
    () => [...items].sort((a, b) => b.savedAt - a.savedAt),
    [items],
  );

  return { items: sorted, count, has, toggle, remove, clear };
}

export default useBookmarks;
