import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import type { QueryState } from './queryCache';
import { useServices } from './ServicesProvider';

/** Reads `key` from the shared cache, loading it with `load` when nothing has fetched it yet. */
export function useQuery<T>(key: string, load: () => Promise<T>): QueryState<T> {
  const { cache } = useServices();
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
