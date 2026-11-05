import type { ScanPlan } from '@/data/plan';
import type { DemoProfile, SampleScan, UnlockProgress } from '@/state/demoState';

/** Routes the services request, also used as keys in each service's cache. */
export const ROUTES = {
  profile: '/profile',
  plan: '/plan',
  scans: '/scans',
  reset: '/reset',
} as const;

/** The profile without the period fields, which belong to the plan. */
export type ProfileResponse = Omit<DemoProfile, 'lastPeriodStart' | 'typicalBleedDays'>;

export interface PlanResponse {
  plan: ScanPlan;
  /** Local calendar date in YYYY-MM-DD format. */
  lastPeriodStart: string;
  typicalBleedDays: number;
}

/** Fields `PATCH /plan` can change. Fields left out stay as they are. */
export type PlanUpdate = Partial<Pick<PlanResponse, 'lastPeriodStart' | 'typicalBleedDays'>>;

export interface ScansResponse {
  completedScans: SampleScan[];
  canCompleteScan: boolean;
  chart: UnlockProgress;
  report: UnlockProgress;
}
