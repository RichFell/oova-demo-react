import { sampleHormoneScans, sampleProfile, unlockRules } from '@/data/sample';

import {
  createInitialDemoState,
  demoReducer,
  selectCanCompleteScan,
  selectChartProgress,
  selectCompletedScans,
  selectCurrentCycleDay,
  selectCurrentPlanDay,
  selectPlan,
  selectReportProgress,
  type DemoAction,
  type DemoState,
} from '../demoState';

const apply = (actions: DemoAction[], state = createInitialDemoState()): DemoState =>
  actions.reduce(demoReducer, state);

const scans = (count: number): DemoAction[] =>
  Array.from({ length: count }, () => ({ type: 'completeScan' }));

const periodDayNumbers = (state: DemoState) =>
  selectPlan(state)
    .days.filter((day) => day.expectedPeriodDay)
    .map((day) => day.dayNumber);

describe('initial demo state', () => {
  it('starts from the sample profile, plan, and usual scan time with no scans', () => {
    const state = createInitialDemoState();
    const plan = selectPlan(state);

    expect(state.profile).toEqual(sampleProfile);
    expect(state.profile.usualScanTime).toBe('8:00 AM');
    expect(plan.startDate).toBe('2026-11-03');
    expect(plan.endDate).toBe('2026-12-02');
    expect(selectCompletedScans(state)).toEqual([]);
    expect(selectCurrentPlanDay(state).dayNumber).toBe(1);
    expect(selectCurrentCycleDay(state)).toBe(1);
  });
});

describe('period edits', () => {
  it('moves period markers when the last period date changes, without changing plan dates', () => {
    const initial = createInitialDemoState();
    const edited = apply([{ type: 'setLastPeriodStart', date: '2026-11-06' }], initial);

    expect(periodDayNumbers(initial)).toEqual([1, 2, 3, 4, 5]);
    expect(periodDayNumbers(edited)).toEqual([4, 5, 6, 7, 8]);
    expect(selectPlan(edited).days.map((day) => day.date)).toEqual(
      selectPlan(initial).days.map((day) => day.date),
    );
  });

  it('updates period markers when typical bleeding days change, without changing plan dates', () => {
    const initial = createInitialDemoState();
    const edited = apply([{ type: 'setTypicalBleedDays', days: 3 }], initial);

    expect(periodDayNumbers(edited)).toEqual([1, 2, 3]);
    expect(selectPlan(edited).days.map(({ date, strips }) => ({ date, strips }))).toEqual(
      selectPlan(initial).days.map(({ date, strips }) => ({ date, strips })),
    );
  });

  it('ignores invalid dates and bleeding days', () => {
    const initial = createInitialDemoState();

    expect(apply([{ type: 'setLastPeriodStart', date: 'Nov 6' }], initial)).toBe(initial);
    expect(apply([{ type: 'setTypicalBleedDays', days: 0 }], initial)).toBe(initial);
    expect(apply([{ type: 'setTypicalBleedDays', days: 2.5 }], initial)).toBe(initial);
  });

  it('exposes the current cycle day from the last period date', () => {
    expect(selectCurrentCycleDay(apply(scans(2)))).toBe(3);
    expect(
      selectCurrentCycleDay(apply([{ type: 'setLastPeriodStart', date: '2026-10-30' }])),
    ).toBe(5);
    expect(
      selectCurrentCycleDay(apply([{ type: 'setLastPeriodStart', date: '2026-11-04' }])),
    ).toBeNull();
  });
});

describe('completeScan', () => {
  it('advances by one sample day per scan', () => {
    const state = apply(scans(2));

    expect(selectCompletedScans(state)).toEqual(sampleHormoneScans.slice(0, 2));
    expect(selectCurrentPlanDay(state)).toMatchObject({ dayNumber: 3, date: '2026-11-05' });
  });

  it('stops at the available sample data', () => {
    const available = sampleHormoneScans.length;
    const full = apply(scans(available));

    expect(selectCanCompleteScan(apply(scans(available - 1)))).toBe(true);
    expect(selectCanCompleteScan(full)).toBe(false);
    expect(demoReducer(full, { type: 'completeScan' })).toBe(full);
    expect(selectCompletedScans(apply(scans(available + 3)))).toHaveLength(available);
    expect(selectCurrentPlanDay(full).date).toBe(sampleHormoneScans[available - 1].date);
  });
});

describe('reset', () => {
  it('returns to the initial sample state', () => {
    const edited = apply([
      ...scans(4),
      { type: 'setLastPeriodStart', date: '2026-11-10' },
      { type: 'setTypicalBleedDays', days: 7 },
    ]);

    expect(demoReducer(edited, { type: 'reset' })).toEqual(createInitialDemoState());
  });
});

describe('unlock progress', () => {
  it('unlocks the chart after the chart scan count', () => {
    expect(selectChartProgress(createInitialDemoState())).toEqual({
      required: unlockRules.chartScans,
      completed: 0,
      remaining: 3,
      unlocked: false,
    });
    expect(selectChartProgress(apply(scans(unlockRules.chartScans - 1)))).toMatchObject({
      remaining: 1,
      unlocked: false,
    });
    expect(selectChartProgress(apply(scans(unlockRules.chartScans)))).toMatchObject({
      remaining: 0,
      unlocked: true,
    });
  });

  it('unlocks the report after the report scan count and caps progress', () => {
    expect(selectReportProgress(apply(scans(unlockRules.chartScans)))).toMatchObject({
      required: unlockRules.reportScans,
      completed: 3,
      remaining: 1,
      unlocked: false,
    });
    expect(selectReportProgress(apply(scans(6)))).toEqual({
      required: unlockRules.reportScans,
      completed: unlockRules.reportScans,
      remaining: 0,
      unlocked: true,
    });
  });
});
