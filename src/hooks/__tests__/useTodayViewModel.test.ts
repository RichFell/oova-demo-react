import { currentCycleDay, currentPlanDay } from '@/hooks/currentDay';
import { buildTodayViewModel, formatShortDate, formatWeekday, useTodayViewModel } from '@/hooks/useTodayViewModel';
import {
  createInitialDemoState,
  demoReducer,
  selectCanCompleteScan,
  selectChartProgress,
  selectPlan,
  type DemoAction,
} from '@/services/mock/demoState';
import { useServices } from '@/services/ServicesProvider';
import { FakeTransport, PendingTransport, renderWithServices } from '@/services/testing';

function viewModelAfter(...actions: DemoAction[]) {
  const state = actions.reduce(demoReducer, createInitialDemoState());
  const plan = selectPlan(state);
  const planDay = currentPlanDay(plan, state.completedScanCount, selectCanCompleteScan(state));
  return buildTodayViewModel({
    plan,
    currentPlanDay: planDay,
    currentCycleDay: currentCycleDay(state.profile.lastPeriodStart, planDay),
    usualScanTime: state.profile.usualScanTime,
    chartProgress: selectChartProgress(state),
  });
}

describe('useTodayViewModel', () => {
  it('reads the profile, plan, and scans through the services', async () => {
    const transport = new FakeTransport();
    const { result } = await renderWithServices(useTodayViewModel, transport);
    expect(result.current).toEqual(viewModelAfter());
    expect(transport.requests.map(({ method, route }) => `${method} ${route}`).sort()).toEqual([
      'GET /plan',
      'GET /profile',
      'GET /scans',
    ]);
  });

  it('advances from the scan service write without another read', async () => {
    const transport = new FakeTransport();
    const { result, act } = await renderWithServices(
      () => ({ services: useServices(), model: useTodayViewModel() }),
      transport,
    );
    await act(() => {
      void result.current.services.scans.completeScan();
    });
    expect(result.current.model).toEqual(viewModelAfter({ type: 'completeScan' }));
    expect(transport.requests.filter(({ route }) => route === '/scans').map(({ method }) => method)).toEqual([
      'GET',
      'POST',
    ]);
  });

  it('tells the screen to render nothing until the queries have data', async () => {
    const { result } = await renderWithServices(useTodayViewModel, new PendingTransport());
    expect(result.current).toBeNull();
  });
});

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
