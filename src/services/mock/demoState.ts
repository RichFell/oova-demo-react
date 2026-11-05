import { buildPlan, daysBetween, type PlanDay, type ScanPlan } from '@/data/plan';
import { samplePlanInput, sampleHormoneScans, sampleProfile, unlockRules } from '@/data/sample';

/** All values are fictional demo data, kept in memory only. */
export interface DemoProfile {
  healthJourney: string;
  regularCycles: boolean;
  /** Local calendar date in YYYY-MM-DD format. */
  lastPeriodStart: string;
  typicalBleedDays: number;
  usualScanTime: string;
}

export type SampleScan = (typeof sampleHormoneScans)[number];

export interface DemoState {
  profile: DemoProfile;
  /** Number of sample days scanned, from 0 up to the available sample data. */
  completedScanCount: number;
}

export type DemoAction =
  | { type: 'setLastPeriodStart'; date: string }
  | { type: 'setTypicalBleedDays'; days: number }
  | { type: 'completeScan' }
  | { type: 'reset' };

export interface UnlockProgress {
  required: number;
  completed: number;
  remaining: number;
  unlocked: boolean;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function createInitialDemoState(): DemoState {
  return {
    profile: { ...sampleProfile },
    completedScanCount: 0,
  };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'setLastPeriodStart':
      if (!ISO_DATE.test(action.date)) {
        return state;
      }
      return { ...state, profile: { ...state.profile, lastPeriodStart: action.date } };
    case 'setTypicalBleedDays':
      if (!Number.isInteger(action.days) || action.days < 1) {
        return state;
      }
      return { ...state, profile: { ...state.profile, typicalBleedDays: action.days } };
    case 'completeScan':
      if (!selectCanCompleteScan(state)) {
        return state;
      }
      return { ...state, completedScanCount: state.completedScanCount + 1 };
    case 'reset':
      return createInitialDemoState();
  }
}

/** Plan dates come from the fixed sample plan. The profile only moves period markers. */
export function selectPlan(state: DemoState): ScanPlan {
  return buildPlan({
    ...samplePlanInput,
    lastPeriodStart: state.profile.lastPeriodStart,
    typicalBleedDays: state.profile.typicalBleedDays,
  });
}

export function selectCompletedScans(state: DemoState): SampleScan[] {
  return sampleHormoneScans.slice(0, state.completedScanCount);
}

export function selectCanCompleteScan(state: DemoState): boolean {
  return state.completedScanCount < sampleHormoneScans.length;
}

/** The next day to scan, held on the last sample day once all sample data is used. */
export function selectCurrentPlanDay(state: DemoState, plan: ScanPlan = selectPlan(state)): PlanDay {
  const index = Math.min(state.completedScanCount, sampleHormoneScans.length - 1);
  return plan.days[index];
}

/** Day 1 is the last period start. Null when the current day is before that date. */
export function selectCurrentCycleDay(
  state: DemoState,
  plan: ScanPlan = selectPlan(state),
): number | null {
  const offset = daysBetween(state.profile.lastPeriodStart, selectCurrentPlanDay(state, plan).date);
  return offset >= 0 ? offset + 1 : null;
}

function unlockProgress(completedScanCount: number, required: number): UnlockProgress {
  const completed = Math.min(completedScanCount, required);
  return {
    required,
    completed,
    remaining: required - completed,
    unlocked: completed >= required,
  };
}

export function selectChartProgress(state: DemoState): UnlockProgress {
  return unlockProgress(state.completedScanCount, unlockRules.chartScans);
}

export function selectReportProgress(state: DemoState): UnlockProgress {
  return unlockProgress(state.completedScanCount, unlockRules.reportScans);
}
