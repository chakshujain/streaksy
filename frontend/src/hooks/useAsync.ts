'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async () => {
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }
    try {
      const result = await fn();
      if (isMounted.current) setData(result);
    } catch (err: unknown) {
      if (isMounted.current) {
        const e = err as { response?: { data?: { error?: string } }; message?: string };
        setError(e.response?.data?.error || e.message || 'Something went wrong');
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
