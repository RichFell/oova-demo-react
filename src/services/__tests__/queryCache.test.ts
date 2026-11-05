import { QueryCache } from '@/services/queryCache';
import { MOCK_DELAY_MS, MockTransport, type RouteTable } from '@/services/transport';

function setup() {
  let count = 0;
  const routes = {
    '/count': {
      GET: jest.fn(() => count),
      POST: jest.fn(() => ++count),
    },
    '/other': { GET: jest.fn(() => 'other') },
  } satisfies RouteTable;
  const transport = new MockTransport(routes);
  const cache = new QueryCache();
  const load = (route: string) => () => transport.request({ method: 'GET', route });

  /** Mounts a query the way `useQuery` does: subscribe, then ensure. */
  function mount(route: string) {
    const listener = jest.fn();
    const unmount = cache.subscribe(route, listener);
    cache.ensure(route, load(route));
    return { listener, unmount };
  }

  return { routes, transport, cache, mount };
}

describe('QueryCache', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('loads, then returns the data', async () => {
    const { cache, mount } = setup();
    expect(cache.getState('/count')).toEqual({ data: undefined, isLoading: true, error: undefined });

    const { listener } = mount('/count');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: false, error: undefined });
    expect(listener).toHaveBeenCalled();
  });

  it('shares one request and one result between queries with the same key', async () => {
    const { routes, cache, mount } = setup();
    const first = mount('/count');
    const second = mount('/count');

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);
    expect(first.listener).toHaveBeenCalled();
    expect(second.listener).toHaveBeenCalled();
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: false, error: undefined });
  });

  it('serves a later query from the cache without a new request', async () => {
    const { routes, cache, mount } = setup();
    mount('/count');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    const loaded = cache.getState('/count');

    mount('/count');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(cache.getState('/count')).toBe(loaded);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);
  });

  it('returns the error when the load rejects', async () => {
    const { cache, mount } = setup();
    mount('/missing');

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(cache.getState('/missing')).toEqual({
      data: undefined,
      isLoading: false,
      error: new Error('No mock route for GET /missing.'),
    });
  });

  it('fetches mounted queries again when their keys are invalidated', async () => {
    const { routes, transport, cache, mount } = setup();
    mount('/count');
    mount('/other');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);

    const write = transport.request({ method: 'POST', route: '/count' });
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await write;
    cache.invalidate(['/count']);
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: true, error: undefined });

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(cache.getState('/count')).toEqual({ data: 1, isLoading: false, error: undefined });
    expect(routes['/count'].GET).toHaveBeenCalledTimes(2);
    expect(routes['/other'].GET).toHaveBeenCalledTimes(1);
  });

  it('fetches again after a request that was running when its key was invalidated', async () => {
    const { routes, cache, mount } = setup();
    mount('/count');

    cache.invalidate(['/count']);
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(2);
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: false, error: undefined });
  });

  it('fetches an invalidated key that is not mounted when it next mounts', async () => {
    const { routes, cache, mount } = setup();
    const { unmount } = mount('/count');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    unmount();

    cache.invalidate(['/count']);
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);

    mount('/count');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(2);
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: false, error: undefined });
  });

  it('updates mounted queries from set without a request', async () => {
    const { routes, cache, mount } = setup();
    const { listener } = mount('/count');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    listener.mockClear();

    cache.set('/count', 5);
    expect(listener).toHaveBeenCalled();
    expect(cache.getState('/count')).toEqual({ data: 5, isLoading: false, error: undefined });
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);
  });

  it('serves set data to a query that mounts later without a request', () => {
    const { routes, cache, mount } = setup();
    cache.set('/count', 5);
    mount('/count');
    expect(cache.getState('/count')).toEqual({ data: 5, isLoading: false, error: undefined });
    expect(routes['/count'].GET).not.toHaveBeenCalled();
  });

  it('prefetch settles once the data is stored, and a later query reads it without a request', async () => {
    const { routes, transport, cache, mount } = setup();
    const settled = jest.fn();
    cache.prefetch('/count', () => transport.request({ method: 'GET', route: '/count' })).then(settled);

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS - 1);
    expect(settled).not.toHaveBeenCalled();
    expect(cache.getState('/count').data).toBeUndefined();

    await jest.advanceTimersByTimeAsync(1);
    expect(settled).toHaveBeenCalled();
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: false, error: undefined });

    mount('/count');
    expect(cache.getState('/count')).toEqual({ data: 0, isLoading: false, error: undefined });
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);
  });

  it('prefetch shares a request already running for the key', async () => {
    const { routes, transport, cache, mount } = setup();
    mount('/count');
    const first = cache.prefetch('/count', () => transport.request({ method: 'GET', route: '/count' }));
    const second = cache.prefetch('/count', () => transport.request({ method: 'GET', route: '/count' }));

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await Promise.all([first, second]);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);
    expect(cache.getState('/count').data).toBe(0);
  });

  it('prefetch settles at once without a request when the key has data', async () => {
    const { routes, transport, cache } = setup();
    cache.set('/count', 5);
    await cache.prefetch('/count', () => transport.request({ method: 'GET', route: '/count' }));
    expect(routes['/count'].GET).not.toHaveBeenCalled();
    expect(cache.getState('/count').data).toBe(5);
  });

  it('keeps set data when a request that started earlier settles', async () => {
    const { cache, mount } = setup();
    mount('/count');
    cache.set('/count', 5);
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(cache.getState('/count')).toEqual({ data: 5, isLoading: false, error: undefined });
  });
});
