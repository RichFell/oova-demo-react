import { currentCycleDay, currentPlanDay } from '@/hooks/currentDay';
import {
  buildPlanAnswersViewModel,
  stepLastPeriodStart,
  stepTypicalBleedDays,
  usePlanAnswersViewModel,
} from '@/hooks/usePlanAnswersViewModel';
import { usePlanViewModel } from '@/hooks/usePlanViewModel';
import { buildTodayViewModel } from '@/hooks/useTodayViewModel';
import {
  createInitialDemoState,
  demoReducer,
  selectCanCompleteScan,
  selectChartProgress,
  selectPlan,
  type DemoAction,
} from '@/services/mock/demoState';
import { FakeTransport, PendingTransport, renderWithServices } from '@/services/testing';

function stateAfter(...actions: DemoAction[]) {
  return actions.reduce(demoReducer, createInitialDemoState());
}

function planDayAfter(...actions: DemoAction[]) {
  const state = stateAfter(...actions);
  return currentPlanDay(selectPlan(state), state.completedScanCount, selectCanCompleteScan(state));
}

function answersAfter(editing: boolean, ...actions: DemoAction[]) {
  const state = stateAfter(...actions);
  const { lastPeriodStart, typicalBleedDays } = state.profile;
  return buildPlanAnswersViewModel({
    profile: state.profile,
    plan: { plan: selectPlan(state), lastPeriodStart, typicalBleedDays },
    today: planDayAfter(...actions).date,
    editing,
  });
}

function todayAfter(...actions: DemoAction[]) {
  const state = stateAfter(...actions);
  const planDay = planDayAfter(...actions);
  return buildTodayViewModel({
    plan: selectPlan(state),
    currentPlanDay: planDay,
    currentCycleDay: currentCycleDay(state.profile.lastPeriodStart, planDay),
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
    const planStart = '2026-11-03';
    expect(stepLastPeriodStart('2026-11-03', -1, '2026-11-03', planStart)).toBe('2026-11-02');
    expect(stepLastPeriodStart('2026-10-21', -1, '2026-11-03', planStart)).toBe('2026-10-20');
    expect(stepLastPeriodStart('2026-10-20', -1, '2026-11-03', planStart)).toBeNull();
    expect(stepLastPeriodStart('2026-11-02', 1, '2026-11-03', planStart)).toBe('2026-11-03');
    expect(stepLastPeriodStart('2026-11-03', 1, '2026-11-03', planStart)).toBeNull();
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

describe('usePlanAnswersViewModel', () => {
  const usePlanScreen = () => ({ answers: usePlanAnswersViewModel(), timeline: usePlanViewModel() });
  const timelinePeriodDates = (timeline: ReturnType<typeof usePlanViewModel>) =>
    timeline?.days.filter((day) => day.expectedPeriodDay).map((day) => day.date);
  const planRequests = (transport: FakeTransport) =>
    transport.requests.filter(({ route }) => route === '/plan');

  it('reads the answers through the profile, plan, and scan services', async () => {
    const { result } = await renderWithServices(usePlanAnswersViewModel, new FakeTransport());
    expect(result.current).toMatchObject(answersAfter(false));
  });

  it('saves a moved last period date with updatePlan and updates the timeline from the response', async () => {
    const transport = new FakeTransport();
    const { result, act } = await renderWithServices(usePlanScreen, transport);
    expect(timelinePeriodDates(result.current.timeline)).toEqual(periodDates());

    await act(() => result.current.answers?.decreaseLastPeriod());
    expect(planRequests(transport)).toEqual([
      { method: 'GET', route: '/plan' },
      { method: 'PATCH', route: '/plan', body: { lastPeriodStart: '2026-11-02' } },
    ]);
    const moved: DemoAction = { type: 'setLastPeriodStart', date: '2026-11-02' };
    expect(result.current.answers).toMatchObject({ lastPeriodStarted: 'Nov 2, 2026' });
    expect(timelinePeriodDates(result.current.timeline)).toEqual(periodDates(moved));
  });

  it('saves typical bleeding with updatePlan and updates the timeline from the response', async () => {
    const transport = new FakeTransport();
    const { result, act } = await renderWithServices(usePlanScreen, transport);

    await act(() => result.current.answers?.decreaseBleeding());
    expect(planRequests(transport)).toEqual([
      { method: 'GET', route: '/plan' },
      { method: 'PATCH', route: '/plan', body: { typicalBleedDays: 4 } },
    ]);
    expect(result.current.answers).toMatchObject({ typicalBleeding: '4 days' });
    expect(timelinePeriodDates(result.current.timeline)).toEqual(
      periodDates({ type: 'setTypicalBleedDays', days: 4 }),
    );
  });

  it('sends nothing when a step would leave the allowed range', async () => {
    const transport = new FakeTransport();
    const { result, act } = await renderWithServices(usePlanAnswersViewModel, transport);
    await act(() => result.current?.increaseLastPeriod());
    expect(planRequests(transport)).toEqual([{ method: 'GET', route: '/plan' }]);
  });

  it('tells the screen to render nothing until the queries have data', async () => {
    const { result } = await renderWithServices(usePlanAnswersViewModel, new PendingTransport());
    expect(result.current).toBeNull();
  });
});
