import { buildTodayViewModel, formatShortDate, formatWeekday } from '@/hooks/useTodayViewModel';
import {
  createInitialDemoState,
  demoReducer,
  selectChartProgress,
  selectCurrentCycleDay,
  selectCurrentPlanDay,
  selectPlan,
  type DemoAction,
} from '@/state/demoState';

function viewModelAfter(...actions: DemoAction[]) {
  const state = actions.reduce(demoReducer, createInitialDemoState());
  const plan = selectPlan(state);
  return buildTodayViewModel({
    plan,
    currentPlanDay: selectCurrentPlanDay(state, plan),
    currentCycleDay: selectCurrentCycleDay(state, plan),
    usualScanTime: state.profile.usualScanTime,
    chartProgress: selectChartProgress(state),
  });
}

describe('formatters', () => {
  it('formats calendar dates without time zone shifts', () => {
    expect(formatShortDate('2026-11-03')).toBe('Nov 3');
    expect(formatWeekday('2026-11-03')).toBe('Tue');
  });
});

describe('buildTodayViewModel', () => {
  it('fills the hero from the initial sample state', () => {
    const model = viewModelAfter();
    expect(model.heroEyebrow).toBe('Nov 3 · Cycle day 1');
    expect(model.heroTitle).toBe('Day 1 of your plan');
    expect(model.heroBody).toBe('Use one E3G and one LH | PdG strip today. Try to scan around 8:00 AM.');
    expect(model.strips).toEqual(['LH | PdG', 'E3G']);
  });

  it('advances the hero after a completed scan', () => {
    const model = viewModelAfter({ type: 'completeScan' });
    expect(model.heroEyebrow).toBe('Nov 4 · Cycle day 2');
    expect(model.heroTitle).toBe('Day 2 of your plan');
  });

  it('keeps plan day separate from cycle day when the last period date changes', () => {
    const model = viewModelAfter({ type: 'setLastPeriodStart', date: '2026-10-30' });
    expect(model.heroEyebrow).toBe('Nov 3 · Cycle day 5');
    expect(model.heroTitle).toBe('Day 1 of your plan');
  });

  it('drops the cycle day when the last period date is after today', () => {
    const model = viewModelAfter({ type: 'setLastPeriodStart', date: '2026-11-10' });
    expect(model.heroEyebrow).toBe('Nov 3');
  });

  it('lists the next five days with both strip tokens', () => {
    const { upcomingDays } = viewModelAfter();
    expect(upcomingDays.map((day) => day.label)).toEqual(['Today', 'Wed', 'Thu', 'Fri', 'Sat']);
    upcomingDays.forEach((day) => expect(day.strips).toEqual(['LH | PdG', 'E3G']));
  });

  it('starts the next five days at the current plan day', () => {
    const { upcomingDays } = viewModelAfter({ type: 'completeScan' });
    expect(upcomingDays[0]).toMatchObject({ date: '2026-11-04', label: 'Today' });
    expect(upcomingDays).toHaveLength(5);
  });

  it('shows remaining chart scans from state', () => {
    expect(viewModelAfter().chart).toEqual({ locked: true, required: 3, completed: 0, remainingLabel: '3 to go' });
    expect(viewModelAfter({ type: 'completeScan' }, { type: 'completeScan' }).chart).toMatchObject({
      locked: true,
      completed: 2,
      remainingLabel: '1 to go',
    });
    const done = { type: 'completeScan' } as const;
    expect(viewModelAfter(done, done, done).chart.locked).toBe(false);
  });
});
