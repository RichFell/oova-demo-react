import {
  buildPlanAnswersViewModel,
  stepLastPeriodStart,
  stepTypicalBleedDays,
} from '@/hooks/usePlanAnswersViewModel';
import { buildTodayViewModel } from '@/hooks/useTodayViewModel';
import {
  createInitialDemoState,
  demoReducer,
  selectChartProgress,
  selectCurrentCycleDay,
  selectCurrentPlanDay,
  selectPlan,
  type DemoAction,
} from '@/state/demoState';

function stateAfter(...actions: DemoAction[]) {
  return actions.reduce(demoReducer, createInitialDemoState());
}

function answersAfter(editing: boolean, ...actions: DemoAction[]) {
  const state = stateAfter(...actions);
  const plan = selectPlan(state);
  return buildPlanAnswersViewModel({
    profile: state.profile,
    plan,
    today: selectCurrentPlanDay(state, plan).date,
    editing,
  });
}

function todayAfter(...actions: DemoAction[]) {
  const state = stateAfter(...actions);
  const plan = selectPlan(state);
  return buildTodayViewModel({
    plan,
    currentPlanDay: selectCurrentPlanDay(state, plan),
    currentCycleDay: selectCurrentCycleDay(state, plan),
    usualScanTime: state.profile.usualScanTime,
    chartProgress: selectChartProgress(state),
  });
}

const periodDates = (...actions: DemoAction[]) =>
  selectPlan(stateAfter(...actions))
    .days.filter((day) => day.expectedPeriodDay)
    .map((day) => day.date);

describe('buildPlanAnswersViewModel', () => {
  it('shows the four answers from state', () => {
    expect(answersAfter(false)).toMatchObject({
      healthJourney: 'Hormone Optimization',
      regularCycles: 'No',
      lastPeriodStarted: 'Nov 3, 2026',
      typicalBleeding: '5 days',
    });
  });

  it('switches the action from Edit to Done while editing', () => {
    expect(answersAfter(false)).toMatchObject({ editing: false, actionLabel: 'Edit' });
    expect(answersAfter(true)).toMatchObject({ editing: true, actionLabel: 'Done', lastPeriodStarted: 'Nov 3' });
  });

  it('shows strip counts from the plan', () => {
    expect(answersAfter(false).strips).toEqual([
      { type: 'LH | PdG', count: '30 strips' },
      { type: 'E3G', count: '30 strips' },
    ]);
  });

  it('limits the last period date to today and 14 days back', () => {
    expect(answersAfter(true).lastPeriodStepper).toEqual({ canDecrease: true, canIncrease: false });
    expect(answersAfter(true, { type: 'setLastPeriodStart', date: '2026-10-20' }).lastPeriodStepper).toEqual({
      canDecrease: false,
      canIncrease: true,
    });
  });

  it('limits typical bleeding to 1 through 10 days', () => {
    expect(answersAfter(true, { type: 'setTypicalBleedDays', days: 1 })).toMatchObject({
      typicalBleeding: '1 day',
      bleedingStepper: { canDecrease: false, canIncrease: true },
    });
    expect(answersAfter(true, { type: 'setTypicalBleedDays', days: 10 })).toMatchObject({
      typicalBleeding: '10 days',
      bleedingStepper: { canDecrease: true, canIncrease: false },
    });
  });
});

describe('answer steppers', () => {
  it('moves the last period date back up to 14 days and never past today', () => {
    expect(stepLastPeriodStart('2026-11-03', -1, '2026-11-03')).toBe('2026-11-02');
    expect(stepLastPeriodStart('2026-10-21', -1, '2026-11-03')).toBe('2026-10-20');
    expect(stepLastPeriodStart('2026-10-20', -1, '2026-11-03')).toBeNull();
    expect(stepLastPeriodStart('2026-11-02', 1, '2026-11-03')).toBe('2026-11-03');
    expect(stepLastPeriodStart('2026-11-03', 1, '2026-11-03')).toBeNull();
  });

  it('changes typical bleeding between 1 and 10 days', () => {
    expect(stepTypicalBleedDays(2, -1)).toBe(1);
    expect(stepTypicalBleedDays(1, -1)).toBeNull();
    expect(stepTypicalBleedDays(9, 1)).toBe(10);
    expect(stepTypicalBleedDays(10, 1)).toBeNull();
  });
});

describe('editing answers', () => {
  const initialPlan = selectPlan(stateAfter());

  it('moves period markers and the Today cycle day, but not plan dates or strip counts', () => {
    const moved: DemoAction = { type: 'setLastPeriodStart', date: '2026-11-01' };
    const plan = selectPlan(stateAfter(moved));

    expect(periodDates(moved)).toEqual(['2026-11-03', '2026-11-04', '2026-11-05']);
    expect(todayAfter().heroEyebrow).toBe('Nov 3 · Cycle day 1');
    expect(todayAfter(moved).heroEyebrow).toBe('Nov 3 · Cycle day 3');
    expect(plan.days.map((day) => day.date)).toEqual(initialPlan.days.map((day) => day.date));
    expect(plan.stripCounts).toEqual(initialPlan.stripCounts);
    expect(answersAfter(false, moved).strips).toEqual(answersAfter(false).strips);
  });

  it('changes only period markers when typical bleeding changes', () => {
    const changed: DemoAction = { type: 'setTypicalBleedDays', days: 2 };
    const plan = selectPlan(stateAfter(changed));

    expect(periodDates(changed)).toEqual(['2026-11-03', '2026-11-04']);
    expect(todayAfter(changed)).toEqual(todayAfter());
    expect(plan.days.map((day) => day.date)).toEqual(initialPlan.days.map((day) => day.date));
    expect(plan.stripCounts).toEqual(initialPlan.stripCounts);
  });
});
