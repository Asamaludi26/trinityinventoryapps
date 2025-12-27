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
 */
export function useSafeAsync<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    setError(null);

    asyncFn()
      .then((result) => {
        if (isMountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMountedRef.current = false;
    };
  }, deps);

  return { data, loading, error };
}


