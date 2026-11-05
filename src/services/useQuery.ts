import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import type { QueryCache, QueryState } from './queryCache';

/** Reads `key` from a service's cache, loading it with `load` when nothing has fetched it yet. */
export function useQuery<T>(cache: QueryCache, key: string, load: () => Promise<T>): QueryState<T> {
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  const subscribe = useCallback((listener: () => void) => cache.subscribe(key, listener), [cache, key]);
  const getState = useCallback(() => cache.getState<T>(key), [cache, key]);
  const state = useSyncExternalStore(subscribe, getState, getState);

  useEffect(() => {
    cache.ensure(key, () => loadRef.current());
  }, [cache, key]);

  return state;
}
