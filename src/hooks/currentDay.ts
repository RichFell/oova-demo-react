import { daysBetween, type PlanDay, type ScanPlan } from '@/data/plan';

/**
 * The next plan day to scan. Once no scan can be completed, it holds on the last scanned day.
 * Combines the plan with the scan count, so view models work it out instead of the backend.
 */
export function currentPlanDay(plan: ScanPlan, completedScanCount: number, canCompleteScan: boolean): PlanDay {
  const next = canCompleteScan ? completedScanCount : completedScanCount - 1;
  return plan.days[Math.min(Math.max(next, 0), plan.days.length - 1)];
}

/** Day 1 is the last period start. Null when the plan day is before that date. */
export function currentCycleDay(lastPeriodStart: string, planDay: Pick<PlanDay, 'date'>): number | null {
  const offset = daysBetween(lastPeriodStart, planDay.date);
  return offset >= 0 ? offset + 1 : null;
}
