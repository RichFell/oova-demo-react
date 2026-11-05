import { ROUTES, type PlanResponse, type PlanUpdate, type ProfileResponse, type ScansResponse } from './api';
import { QueryCache } from './queryCache';
import type { Transport } from './transport';

/**
 * Each service owns one route and its own cache. A write sets its own route from the response,
 * so no service touches another's cache.
 */
abstract class CachedService {
  readonly cache = new QueryCache();

  protected constructor(
    protected readonly transport: Transport,
    private readonly route: string,
  ) {}

  /** Mounted queries fetch the route again, for example after the backend resets. */
  refresh(): void {
    this.cache.invalidate([this.route]);
  }
}

export class ProfileService extends CachedService {
  constructor(transport: Transport) {
    super(transport, ROUTES.profile);
  }

  getProfile(): Promise<ProfileResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.profile });
  }
}

export class PlanService extends CachedService {
  constructor(transport: Transport) {
    super(transport, ROUTES.plan);
  }

  getPlan(): Promise<PlanResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.plan });
  }

  async updatePlan(update: PlanUpdate): Promise<PlanResponse> {
    const plan = await this.transport.request<PlanResponse>({ method: 'PATCH', route: ROUTES.plan, body: update });
    this.cache.set(ROUTES.plan, plan);
    return plan;
  }
}

export class ScanService extends CachedService {
  constructor(transport: Transport) {
    super(transport, ROUTES.scans);
  }

  getScans(): Promise<ScansResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.scans });
  }

  async completeScan(): Promise<ScansResponse> {
    const scans = await this.transport.request<ScansResponse>({ method: 'POST', route: ROUTES.scans });
    this.cache.set(ROUTES.scans, scans);
    return scans;
  }
}

/** Demo controls. It has no data of its own, so it has no cache. */
export class DemoService {
  constructor(private readonly transport: Transport) {}

  /** Returns the backend to the sample data. Callers refresh the services they show. */
  reset(): Promise<void> {
    return this.transport.request({ method: 'POST', route: ROUTES.reset });
  }
}
