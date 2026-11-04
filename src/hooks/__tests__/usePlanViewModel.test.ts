import { buildPlanViewModel } from '@/hooks/usePlanViewModel';
import { createInitialDemoState, demoReducer, selectPlan, type DemoAction } from '@/state/demoState';

function planAfter(...actions: DemoAction[]) {
  return selectPlan(actions.reduce(demoReducer, createInitialDemoState()));
}

describe('buildPlanViewModel', () => {
  const plan = planAfter();

  it('shows the plan length and dates in the header', () => {
    const model = buildPlanViewModel(plan, plan.startDate);
    expect(model.title).toBe('Your 30-day plan');
    expect(model.subtitle).toBe('Nov 3 – Dec 2 · Tap a day for details');
  });

  it('lists every plan day with both strip tokens', () => {
    const { days } = buildPlanViewModel(plan, plan.startDate);
    expect(days).toHaveLength(30);
    expect(days[0]).toMatchObject({ date: '2026-11-03', weekday: 'Tue', dayOfMonth: '3' });
    expect(days[29]).toMatchObject({ date: '2026-12-02', weekday: 'Wed', dayOfMonth: '2' });
    days.forEach((day) => expect(day.strips).toEqual(['LH | PdG', 'E3G']));
  });

  it('marks exactly one selected day and updates the details card', () => {
    const first = buildPlanViewModel(plan, '2026-11-03');
    expect(first.days.filter((day) => day.selected).map((day) => day.date)).toEqual(['2026-11-03']);
    expect(first.details).toEqual({
      eyebrow: 'Day 1 · Nov 3',
      title: 'Use both strip types',
      body: 'Scan one E3G strip and one LH | PdG strip around your usual time. This is an expected period day.',
    });

    const later = buildPlanViewModel(plan, '2026-11-10');
    expect(later.days.filter((day) => day.selected).map((day) => day.date)).toEqual(['2026-11-10']);
    expect(later.details).toEqual({
      eyebrow: 'Day 8 · Nov 10',
      title: 'Use both strip types',
      body: 'Scan one E3G strip and one LH | PdG strip around your usual time.',
    });
  });

  it('falls back to the first day for a date outside the plan', () => {
    const model = buildPlanViewModel(plan, '2027-01-01');
    expect(model.days[0].selected).toBe(true);
    expect(model.details.eyebrow).toBe('Day 1 · Nov 3');
  });

  it('flags expected period days from state and shows the legend', () => {
    const model = buildPlanViewModel(plan, plan.startDate);
    expect(model.showPeriodLegend).toBe(true);
    expect(model.days.filter((day) => day.expectedPeriodDay).map((day) => day.date)).toEqual([
      '2026-11-03',
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
      '2026-11-07',
    ]);
    expect(model.days[0].accessibilityLabel).toBe(
      'Tue Nov 3, Day 1: LH | PdG, E3G. This is an expected period day.',
    );
    expect(model.days[5].accessibilityLabel).toBe('Sun Nov 8, Day 6: LH | PdG, E3G');
  });

  it('moves period markers without changing plan days when the last period changes', () => {
    const moved = buildPlanViewModel(planAfter({ type: 'setLastPeriodStart', date: '2026-11-20' }), plan.startDate);
    expect(moved.title).toBe('Your 30-day plan');
    expect(moved.days[0].date).toBe('2026-11-03');
    expect(moved.days.filter((day) => day.expectedPeriodDay).map((day) => day.date)[0]).toBe('2026-11-20');
  });

  it('hides the legend when no plan day is an expected period day', () => {
    const model = buildPlanViewModel(planAfter({ type: 'setLastPeriodStart', date: '2027-02-01' }), plan.startDate);
    expect(model.showPeriodLegend).toBe(false);
  });
});
