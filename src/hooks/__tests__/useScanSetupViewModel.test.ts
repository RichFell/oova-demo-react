import { buildPlanViewModel } from '@/hooks/usePlanViewModel';
import {
  SCAN_STEP_COUNT,
  buildManualScanSetup,
  buildScanSetupHeader,
  useScanSetupViewModel,
} from '@/hooks/useScanSetupViewModel';
import { createInitialDemoState, selectCurrentPlanDay, selectPlan } from '@/services/mock/demoState';
import { FakeTransport, PendingTransport, renderWithServices } from '@/services/testing';

const state = createInitialDemoState();
const plan = selectPlan(state);
const planModel = buildPlanViewModel(plan, plan.startDate);

describe('useScanSetupViewModel', () => {
  it("reads the current plan day's strips through the services", async () => {
    const { result } = await renderWithServices(() => useScanSetupViewModel('manual'), new FakeTransport());
    expect(result.current).toMatchObject({
      mode: 'manual',
      manual: { stripsTitle: 'E3G + LH | PdG', strips: ['LH | PdG', 'E3G'] },
    });
  });

  it('switches mode', async () => {
    const { result, act } = await renderWithServices(() => useScanSetupViewModel('manual'), new FakeTransport());
    await act(() => result.current?.setMode('guided'));
    expect(result.current?.mode).toBe('guided');
  });

  it('tells the screen to render nothing until the queries have data', async () => {
    const { result } = await renderWithServices(() => useScanSetupViewModel('guided'), new PendingTransport());
    expect(result.current).toBeNull();
  });
});

describe('scan setup header', () => {
  it('shows the plan title, dates, and full progress in Guided', () => {
    expect(buildScanSetupHeader('guided', planModel)).toEqual({
      title: 'Your 30-day plan',
      subtitle: 'Nov 3 – Dec 2 · Tap a day for details',
      completedSteps: SCAN_STEP_COUNT,
    });
  });

  it('shows the sample step title and first step in Manual', () => {
    expect(buildScanSetupHeader('manual', planModel)).toEqual({
      title: "Get ready for today's scan",
      completedSteps: 1,
    });
  });
});

describe('manual scan setup', () => {
  it("shows the current plan day's strips", () => {
    expect(buildManualScanSetup(selectCurrentPlanDay(state, plan))).toEqual({
      stripsTitle: 'E3G + LH | PdG',
      strips: ['LH | PdG', 'E3G'],
    });
  });

  it('lists only the strips the day uses', () => {
    expect(buildManualScanSetup({ strips: ['e3g'] }).stripsTitle).toBe('E3G');
  });
});
