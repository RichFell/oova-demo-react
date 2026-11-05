import { act } from 'react';
import { createRoot } from 'test-renderer';

import { createMockBackend } from './mock';
import { ServicesProvider } from './ServicesProvider';
import type { RouteTable, Transport, TransportRequest } from './transport';

// Test helpers only. App code never imports this file.

/** Serves the mock backend's routes without the mock delay, and records every request. */
export class FakeTransport implements Transport {
  readonly requests: TransportRequest[] = [];

  constructor(private readonly routes: RouteTable = createMockBackend()) {}

  async request<T>(request: TransportRequest): Promise<T> {
    this.requests.push(request);
    const handler = this.routes[request.route]?.[request.method];
    if (!handler) {
      throw new Error(`No fake route for ${request.method} ${request.route}.`);
    }
    return handler(request.body) as T;
  }
}

/** Never answers, so queries stay without data. */
export class PendingTransport implements Transport {
  request<T>(): Promise<T> {
    return new Promise(() => {});
  }
}

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

/** Renders a hook inside `ServicesProvider` with the given transport and lets its requests settle. */
export async function renderWithServices<T>(useHook: () => T, transport: Transport) {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const result = { current: undefined as T };

  function Probe() {
    result.current = useHook();
    return null;
  }

  const root = createRoot();
  await act(async () => {
    root.render(
      <ServicesProvider transport={transport}>
        <Probe />
      </ServicesProvider>,
    );
  });

  return {
    result,
    /** Runs an interaction, then lets the requests it starts settle. */
    act: (callback: () => void) => act(async () => callback()),
    unmount: () => act(() => root.unmount()),
  };
}
