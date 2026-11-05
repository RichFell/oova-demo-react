import { buildPlanViewModel } from '@/hooks/usePlanViewModel';
import { SCAN_STEP_COUNT, buildManualScanSetup, buildScanSetupHeader } from '@/hooks/useScanSetupViewModel';
import { createInitialDemoState, selectCurrentPlanDay, selectPlan } from '@/state/demoState';

const state = createInitialDemoState();
const plan = selectPlan(state);
const planModel = buildPlanViewModel(plan, plan.startDate);

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
