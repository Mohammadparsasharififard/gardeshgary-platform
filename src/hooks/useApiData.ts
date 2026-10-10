import { useEffect, useState, useCallback } from 'react';

/**
 * useApiData — async data loader with error handling and refresh.
 *
 * Usage:
 *   const { data, loading, error, refresh } = useApiData(
 *     () => apiClient.listLawyers(),
 *     { fallback: staticLawyers }
 *   );
 *
 * - On mount, calls the loader and stores the result.
 * - If the loader throws (e.g. backend down), `data` stays as `fallback`.
 * - `refresh` re-runs the loader (e.g. after a mutation).
 */
export function useApiData<T, F>(
  loader: () => Promise<{ data: T | null; error: string | null }>,
  options: { fallback: F; immediate?: boolean } = { fallback: undefined as unknown as F },
) {
  const { fallback, immediate = true } = options;
  const [data, setData] = useState<T | F>(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader();
      if (result.error) {
        setError(result.error);
        // Keep fallback data when API fails
      } else if (result.data !== null) {
        setData(result.data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (immediate) {
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refresh, setData };
}

export default useApiData;
