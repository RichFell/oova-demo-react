import { currentCycleDay, currentPlanDay } from '@/hooks/currentDay';
import {
  createInitialDemoState,
  demoReducer,
  selectCanCompleteScan,
  selectCompletedScans,
  selectCurrentCycleDay,
  selectCurrentPlanDay,
  selectPlan,
  type DemoAction,
  type DemoState,
} from '@/services/mock/demoState';

const plan = selectPlan(createInitialDemoState());

describe('currentPlanDay', () => {
  it('is the next day to scan', () => {
    expect(currentPlanDay(plan, 0, true)).toMatchObject({ dayNumber: 1, date: '2026-11-03' });
    expect(currentPlanDay(plan, 2, true)).toMatchObject({ dayNumber: 3, date: '2026-11-05' });
  });

  it('holds on the last scanned day once no scan can be completed', () => {
    expect(currentPlanDay(plan, 8, false)).toMatchObject({ dayNumber: 8, date: '2026-11-10' });
  });

  it('stays inside the plan', () => {
    expect(currentPlanDay(plan, 0, false).dayNumber).toBe(1);
    expect(currentPlanDay(plan, 40, true).dayNumber).toBe(30);
  });

  it('matches the demo state for every scan count, including past the sample data', () => {
    let state: DemoState = createInitialDemoState();
    for (let attempt = 0; attempt <= 10; attempt += 1) {
      const scans = selectCompletedScans(state).length;
      expect(currentPlanDay(plan, scans, selectCanCompleteScan(state))).toEqual(selectCurrentPlanDay(state));
      state = demoReducer(state, { type: 'completeScan' });
    }
  });
});

describe('currentCycleDay', () => {
  it('counts the last period start as day 1', () => {
    expect(currentCycleDay('2026-11-03', { date: '2026-11-03' })).toBe(1);
    expect(currentCycleDay('2026-11-03', { date: '2026-11-05' })).toBe(3);
    expect(currentCycleDay('2026-10-30', { date: '2026-11-03' })).toBe(5);
  });

  it('is null when the plan day is before the last period start', () => {
    expect(currentCycleDay('2026-11-04', { date: '2026-11-03' })).toBeNull();
  });

  it('matches the demo state after period edits and scans', () => {
    const cases: DemoAction[][] = [
      [],
      [{ type: 'completeScan' }, { type: 'completeScan' }],
      [{ type: 'setLastPeriodStart', date: '2026-10-30' }],
      [{ type: 'setLastPeriodStart', date: '2026-11-10' }],
    ];
    cases.forEach((actions) => {
      const state = actions.reduce(demoReducer, createInitialDemoState());
      const planDay = currentPlanDay(selectPlan(state), state.completedScanCount, selectCanCompleteScan(state));
      expect(currentCycleDay(state.profile.lastPeriodStart, planDay)).toBe(selectCurrentCycleDay(state));
    });
  });
});
