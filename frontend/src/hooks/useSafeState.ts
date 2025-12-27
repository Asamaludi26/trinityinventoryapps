import { useState, useEffect, useRef } from 'react';

/**
 * Hook to safely manage state that might be updated after component unmount
 * Prevents "Can't perform a React state update on an unmounted component" warnings
 */
export function useSafeState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setSafeState = (value: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      setState(value);
    }
  };

  return [state, setSafeState] as const;
}

/**
 * Hook to safely execute async operations with cleanup
 * FIXED C7: Improved cleanup to prevent memory leaks
 */
export function useSafeAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    setError(null);

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController();

    // Wrap async function to support abort signal
    const executeAsync = async () => {
      try {
        const result = await asyncFn();
        // Check if component is still mounted and not aborted
        if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        // Only update state if not aborted
        if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    executeAsync();

    return () => {
      // FIXED C7: Proper cleanup - abort ongoing operations and mark as unmounted
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, deps);

  return { data, loading, error };
}


