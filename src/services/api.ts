import type { PlanDay, ScanPlan } from '@/data/plan';
import type { DemoProfile, SampleScan, UnlockProgress } from '@/state/demoState';

/** Routes the services request, also used as client cache keys. */
export const ROUTES = {
  profile: '/profile',
  plan: '/plan',
  scans: '/scans',
  progress: '/progress',
  reset: '/reset',
} as const;

/** Every route with a `GET` response. */
export const READ_ROUTES = [ROUTES.profile, ROUTES.plan, ROUTES.scans, ROUTES.progress];

export type ProfileResponse = DemoProfile;

/** Fields `PATCH /profile` can change. Fields left out stay as they are. */
export type ProfileUpdate = Partial<Pick<DemoProfile, 'lastPeriodStart' | 'typicalBleedDays'>>;

export interface PlanResponse {
  plan: ScanPlan;
  currentPlanDay: PlanDay;
  /** Null when the current plan day is before the last period start. */
  currentCycleDay: number | null;
}

export interface ScansResponse {
  completedScans: SampleScan[];
  canCompleteScan: boolean;
}

export interface ProgressResponse {
  chart: UnlockProgress;
  report: UnlockProgress;
}
