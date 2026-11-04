import { buildPlan, type PlanInput } from '../plan';

const input: PlanInput = {
  startDate: '2026-11-03',
  lengthDays: 30,
  typicalBleedDays: 5,
};

describe('buildPlan', () => {
  it('builds 30 consecutive days from the start date', () => {
    const plan = buildPlan(input);

    expect(plan.days).toHaveLength(30);
    expect(plan.startDate).toBe('2026-11-03');
    expect(plan.days[0]).toMatchObject({ dayNumber: 1, date: '2026-11-03' });
    expect(plan.days[29]).toMatchObject({ dayNumber: 30, date: '2026-12-02' });
    expect(plan.endDate).toBe('2026-12-02');
  });

  it('crosses month and year boundaries', () => {
    const plan = buildPlan({ ...input, startDate: '2026-12-20' });

    expect(plan.days[11].date).toBe('2026-12-31');
    expect(plan.days[12].date).toBe('2027-01-01');
    expect(plan.endDate).toBe('2027-01-18');
  });

  it('handles leap days', () => {
    const plan = buildPlan({ ...input, startDate: '2028-02-28' });

    expect(plan.days[1].date).toBe('2028-02-29');
    expect(plan.days[2].date).toBe('2028-03-01');
  });

  it('schedules both strip types every day', () => {
    const plan = buildPlan(input);

    plan.days.forEach((day) => expect(day.strips).toEqual(['lh-pdg', 'e3g']));
    expect(plan.stripCounts).toEqual({ 'lh-pdg': 30, e3g: 30 });
  });

  it('marks expected period days from the start for the typical bleeding days', () => {
    const plan = buildPlan(input);
    const periodDays = plan.days.filter((day) => day.expectedPeriodDay).map((day) => day.dayNumber);

    expect(periodDays).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not change the scan schedule when bleeding days change', () => {
    const short = buildPlan({ ...input, typicalBleedDays: 3 });
    const long = buildPlan({ ...input, typicalBleedDays: 7 });

    expect(short.days.filter((day) => day.expectedPeriodDay)).toHaveLength(3);
    expect(long.days.filter((day) => day.expectedPeriodDay)).toHaveLength(7);
    expect(short.days.map(({ date, strips }) => ({ date, strips }))).toEqual(
      long.days.map(({ date, strips }) => ({ date, strips })),
    );
    expect(short.stripCounts).toEqual(long.stripCounts);
  });

  it('rejects plan lengths other than 30 days', () => {
    expect(() => buildPlan({ ...input, lengthDays: 15 as PlanInput['lengthDays'] })).toThrow(
      'Only the 30-day plan is supported',
    );
  });
});
