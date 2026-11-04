export type StripType = 'lh-pdg' | 'e3g';

/** Only the 30-day schedule is supported. The 15-day option has no confirmed control. */
export type PlanLength = 30;

export interface PlanInput {
  /** Local calendar date in YYYY-MM-DD format. */
  startDate: string;
  lengthDays: PlanLength;
  typicalBleedDays: number;
}

export interface PlanDay {
  dayNumber: number;
  date: string;
  strips: StripType[];
  /** Concept only: Oova's use of bleeding days in scheduling is unconfirmed. */
  expectedPeriodDay: boolean;
}

export interface ScanPlan {
  days: PlanDay[];
  startDate: string;
  endDate: string;
  stripCounts: Record<StripType, number>;
}

const pad = (value: number) => String(value).padStart(2, '0');

function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Builds the demo schedule: both strip types on every day of the plan. */
export function buildPlan({ startDate, lengthDays, typicalBleedDays }: PlanInput): ScanPlan {
  if (lengthDays !== 30) {
    throw new Error(`Unsupported plan length: ${lengthDays}. Only the 30-day plan is supported.`);
  }

  const days = Array.from({ length: lengthDays }, (_, index): PlanDay => ({
    dayNumber: index + 1,
    date: addDays(startDate, index),
    strips: ['lh-pdg', 'e3g'],
    expectedPeriodDay: index < typicalBleedDays,
  }));

  return {
    days,
    startDate,
    endDate: days[days.length - 1].date,
    stripCounts: { 'lh-pdg': lengthDays, e3g: lengthDays },
  };
}
