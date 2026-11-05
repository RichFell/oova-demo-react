export interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
}

type Listener = () => void;

interface Entry {
  state: QueryState<unknown>;
  load?: () => Promise<unknown>;
  running?: Promise<void>;
  refetchWhenSettled: boolean;
  /** Bumped by `set`, so a request that started earlier can't overwrite newer data. */
  version: number;
  listeners: Set<Listener>;
}

/** Before the first fetch for a key, a mounted query is about to load it. */
const NOT_FETCHED: QueryState<never> = { data: undefined, isLoading: true, error: undefined };

/** Shared query results by key, so every query with the same key reads one request and one result. */
export class QueryCache {
  private readonly entries = new Map<string, Entry>();

  getState<T>(key: string): QueryState<T> {
    return (this.entries.get(key)?.state ?? NOT_FETCHED) as QueryState<T>;
  }

  subscribe(key: string, listener: Listener): () => void {
    const entry = this.entry(key);
    entry.listeners.add(listener);
    return () => {
      entry.listeners.delete(listener);
    };
  }

  /** Loads the key unless it already has a result or a request running. */
  ensure(key: string, load: () => Promise<unknown>): void {
    const entry = this.entry(key);
    entry.load = load;
    if (entry.running || entry.state !== NOT_FETCHED) {
      return;
    }
    this.fetch(key, entry);
  }

  /**
   * Loads the key before any query mounts, for example at startup. Settles once the key's data is
   * stored, shares a request already running for the key, and settles at once when data is cached.
   */
  prefetch(key: string, load: () => Promise<unknown>): Promise<void> {
    const entry = this.entry(key);
    entry.load = load;
    if (entry.running) {
      return entry.running;
    }
    if (entry.state.data !== undefined) {
      return Promise.resolve();
    }
    return this.fetch(key, entry) ?? Promise.resolve();
  }

  /** Stores data from outside a query, such as a write's response. Mounted queries update without a request. */
  set(key: string, data: unknown): void {
    const entry = this.entry(key);
    entry.version += 1;
    this.update(entry, { data, isLoading: false, error: undefined });
  }

  /** Mounted queries with these keys fetch again. Others fetch when they next mount. */
  invalidate(keys: string[]): void {
    keys.forEach((key) => {
      const entry = this.entries.get(key);
      if (!entry) {
        return;
      }
      if (entry.listeners.size === 0) {
        this.entries.delete(key);
      } else if (entry.running) {
        entry.refetchWhenSettled = true;
      } else {
        this.fetch(key, entry);
      }
    });
  }

  private entry(key: string): Entry {
    let entry = this.entries.get(key);
    if (!entry) {
      entry = { state: NOT_FETCHED, refetchWhenSettled: false, version: 0, listeners: new Set() };
      this.entries.set(key, entry);
    }
    return entry;
  }

  private fetch(key: string, entry: Entry): Promise<void> | undefined {
    const load = entry.load;
    if (!load) {
      return undefined;
    }
    entry.refetchWhenSettled = false;
    const version = entry.version;
    this.update(entry, { ...entry.state, isLoading: true });

    entry.running = load().then(
      (data) => {
        if (entry.version === version) {
          this.update(entry, { data, isLoading: false, error: undefined });
        }
      },
      (error: unknown) => {
        if (entry.version === version) {
          this.update(entry, { data: entry.state.data, isLoading: false, error });
        }
      },
    ).finally(() => {
      entry.running = undefined;
      if (entry.refetchWhenSettled && this.entries.get(key) === entry && entry.listeners.size > 0) {
        this.fetch(key, entry);
      }
    });
    return entry.running;
  }

  private update(entry: Entry, state: QueryState<unknown>): void {
    entry.state = state;
    entry.listeners.forEach((listener) => listener());
  }
}
