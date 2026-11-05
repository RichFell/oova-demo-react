import { MOCK_DELAY_MS, MockTransport, type RouteTable } from '@/services/transport';

function testRoutes() {
  let count = 0;
  const routes = {
    '/count': {
      GET: jest.fn(() => count),
      POST: jest.fn(() => ++count),
      PATCH: jest.fn((body: unknown) => (count = (body as { count: number }).count)),
    },
    '/broken': {
      GET: jest.fn(() => {
        throw new Error('Broken route.');
      }),
    },
  } satisfies RouteTable;
  return routes;
}

describe('MockTransport', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('resolves with the route handler after the fixed delay', async () => {
    const routes = testRoutes();
    const transport = new MockTransport(routes);
    const onResolve = jest.fn();

    transport.request<number>({ method: 'PATCH', route: '/count', body: { count: 7 } }).then(onResolve);
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS - 1);
    expect(routes['/count'].PATCH).not.toHaveBeenCalled();
    expect(onResolve).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    expect(routes['/count'].PATCH).toHaveBeenCalledWith({ count: 7 });
    expect(onResolve).toHaveBeenCalledWith(7);
  });

  it('rejects an unknown method and route with an error naming both', async () => {
    const transport = new MockTransport(testRoutes());
    const missingRoute = transport.request({ method: 'GET', route: '/missing' });
    const missingMethod = transport.request({ method: 'PATCH', route: '/broken' });
    const settled = Promise.allSettled([missingRoute, missingMethod]);

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await expect(missingRoute).rejects.toThrow('GET /missing');
    await expect(missingMethod).rejects.toThrow('PATCH /broken');
    await settled;
  });

  it('shares a running GET for the same route and runs the handler once', async () => {
    const routes = testRoutes();
    const transport = new MockTransport(routes);

    const first = transport.request<number>({ method: 'GET', route: '/count' });
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS / 2);
    const second = transport.request<number>({ method: 'GET', route: '/count' });
    expect(second).toBe(first);

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await expect(Promise.all([first, second])).resolves.toEqual([0, 0]);
    expect(routes['/count'].GET).toHaveBeenCalledTimes(1);
  });

  it('starts a new GET after the previous one resolves', async () => {
    const routes = testRoutes();
    const transport = new MockTransport(routes);

    const first = transport.request({ method: 'GET', route: '/count' });
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await first;

    const second = transport.request({ method: 'GET', route: '/count' });
    expect(second).not.toBe(first);
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await second;
    expect(routes['/count'].GET).toHaveBeenCalledTimes(2);
  });

  it('starts a new GET after the previous one rejects, so it can be retried', async () => {
    const routes = testRoutes();
    const transport = new MockTransport(routes);

    const first = transport.request({ method: 'GET', route: '/broken' });
    const firstSettled = expect(first).rejects.toThrow('Broken route.');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await firstSettled;

    const second = transport.request({ method: 'GET', route: '/broken' });
    expect(second).not.toBe(first);
    const secondSettled = expect(second).rejects.toThrow('Broken route.');
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await secondSettled;
    expect(routes['/broken'].GET).toHaveBeenCalledTimes(2);
  });

  it('never deduplicates POST or PATCH requests', async () => {
    const routes = testRoutes();
    const transport = new MockTransport(routes);

    const posts = [
      transport.request<number>({ method: 'POST', route: '/count' }),
      transport.request<number>({ method: 'POST', route: '/count' }),
    ];
    const patches = [
      transport.request<number>({ method: 'PATCH', route: '/count', body: { count: 10 } }),
      transport.request<number>({ method: 'PATCH', route: '/count', body: { count: 20 } }),
    ];
    expect(posts[1]).not.toBe(posts[0]);
    expect(patches[1]).not.toBe(patches[0]);

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await expect(Promise.all(posts)).resolves.toEqual([1, 2]);
    await expect(Promise.all(patches)).resolves.toEqual([10, 20]);
    expect(routes['/count'].POST).toHaveBeenCalledTimes(2);
    expect(routes['/count'].PATCH).toHaveBeenCalledTimes(2);
  });
});
