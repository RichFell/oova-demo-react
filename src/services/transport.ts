export type HttpMethod = 'GET' | 'POST' | 'PATCH';

export interface TransportRequest {
  method: HttpMethod;
  route: string;
  body?: unknown;
}

/** Sends requests the way a client talks to an HTTP API. */
export interface Transport {
  request<T>(request: TransportRequest): Promise<T>;
}

export type RouteHandler = (body: unknown) => unknown;

/** Handlers by route, then by method, for example `{ '/profile': { GET: () => profile } }`. */
export type RouteTable = Record<string, Partial<Record<HttpMethod, RouteHandler>>>;

export const MOCK_DELAY_MS = 300;

/**
 * Resolves each request with its route handler after a fixed delay. A `GET` that matches one
 * already running shares its promise; writes always start a new request.
 */
export class MockTransport implements Transport {
  private readonly inFlightGets = new Map<string, Promise<unknown>>();

  constructor(private readonly routes: RouteTable) {}

  request<T>({ method, route, body }: TransportRequest): Promise<T> {
    if (method !== 'GET') {
      return this.send(method, route, body) as Promise<T>;
    }

    const running = this.inFlightGets.get(route);
    if (running) {
      return running as Promise<T>;
    }

    const promise = this.send(method, route, body).finally(() => this.inFlightGets.delete(route));
    this.inFlightGets.set(route, promise);
    return promise as Promise<T>;
  }

  private async send(method: HttpMethod, route: string, body: unknown): Promise<unknown> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const handler = this.routes[route]?.[method];
    if (!handler) {
      throw new Error(`No mock route for ${method} ${route}.`);
    }
    return handler(body);
  }
}
