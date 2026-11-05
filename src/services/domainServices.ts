import {
  READ_ROUTES,
  ROUTES,
  type PlanResponse,
  type ProfileResponse,
  type ProfileUpdate,
  type ProgressResponse,
  type ScansResponse,
} from './api';
import type { QueryCache } from './queryCache';
import type { Transport } from './transport';

/** The part of the client cache a service needs to mark routes stale after a write. */
export type Invalidator = Pick<QueryCache, 'invalidate'>;

export class ProfileService {
  constructor(
    private readonly transport: Transport,
    private readonly cache: Invalidator,
  ) {}

  getProfile(): Promise<ProfileResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.profile });
  }

  async updateProfile(update: ProfileUpdate): Promise<ProfileResponse> {
    const profile = await this.transport.request<ProfileResponse>({
      method: 'PATCH',
      route: ROUTES.profile,
      body: update,
    });
    this.cache.invalidate([ROUTES.profile, ROUTES.plan]);
    return profile;
  }

  /** Returns every route to the sample data. */
  async reset(): Promise<void> {
    await this.transport.request<void>({ method: 'POST', route: ROUTES.reset });
    this.cache.invalidate([...READ_ROUTES]);
  }
}

export class PlanService {
  constructor(private readonly transport: Transport) {}

  getPlan(): Promise<PlanResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.plan });
  }
}

export class ScanService {
  constructor(
    private readonly transport: Transport,
    private readonly cache: Invalidator,
  ) {}

  getScans(): Promise<ScansResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.scans });
  }

  getProgress(): Promise<ProgressResponse> {
    return this.transport.request({ method: 'GET', route: ROUTES.progress });
  }

  async completeScan(): Promise<ScansResponse> {
    const scans = await this.transport.request<ScansResponse>({ method: 'POST', route: ROUTES.scans });
    this.cache.invalidate([ROUTES.scans, ROUTES.plan, ROUTES.progress]);
    return scans;
  }
}
