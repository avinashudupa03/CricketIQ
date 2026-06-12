import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
}

interface UseApiResult<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
}

export function useApi<T>(
  fetchFn: () => Promise<{ data: T }>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { initialData, autoFetch = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      setData(res.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (err as Error).message
        || 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (autoFetch) refetch();
  }, [autoFetch, refetch]);

  return { data, loading, error, refetch, setData };
}
