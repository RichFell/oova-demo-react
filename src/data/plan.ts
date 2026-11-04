export type StripType = 'lh-pdg' | 'e3g';

/** Only the 30-day schedule is supported. The 15-day option has no confirmed control. */
export type PlanLength = 30;

export interface PlanInput {
  /** Local calendar date in YYYY-MM-DD format. */
  startDate: string;
  lengthDays: PlanLength;
  /** Local calendar date in YYYY-MM-DD format. Moves period markers only, never plan dates. */
  lastPeriodStart: string;
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

const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (value: number) => String(value).padStart(2, '0');

function toUtc(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(toUtc(isoDate) + days * DAY_MS);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Whole calendar days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

/** Builds the demo schedule: both strip types on every day of the plan. */
export function buildPlan({
  startDate,
  lengthDays,
  lastPeriodStart,
  typicalBleedDays,
}: PlanInput): ScanPlan {
  if (lengthDays !== 30) {
    throw new Error(`Unsupported plan length: ${lengthDays}. Only the 30-day plan is supported.`);
  }

  const days = Array.from({ length: lengthDays }, (_, index): PlanDay => {
    const date = addDays(startDate, index);
    const periodOffset = daysBetween(lastPeriodStart, date);

    return {
      dayNumber: index + 1,
      date,
      strips: ['lh-pdg', 'e3g'],
      expectedPeriodDay: periodOffset >= 0 && periodOffset < typicalBleedDays,
    };
  });

  return {
    days,
    startDate,
    endDate: days[days.length - 1].date,
    stripCounts: { 'lh-pdg': lengthDays, e3g: lengthDays },
  };
}
