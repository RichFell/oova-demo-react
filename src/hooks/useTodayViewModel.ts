import type { StripType as PlanStripType } from '@/data/plan';
import type { StripType } from '@/components/StripToken';
import { useDemoState, type DemoStateValue } from '@/state/DemoStateProvider';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const UPCOMING_DAY_COUNT = 5;

export const STRIP_TOKENS: Record<PlanStripType, StripType> = {
  'lh-pdg': 'LH | PdG',
  e3g: 'E3G',
};

export interface UpcomingDay {
  date: string;
  label: string;
  strips: StripType[];
}

export interface TodayViewModel {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  strips: StripType[];
  upcomingDays: UpcomingDay[];
  chart: {
    locked: boolean;
    required: number;
    completed: number;
    remainingLabel: string;
  };
}

type TodayState = Pick<DemoStateValue, 'plan' | 'currentPlanDay' | 'currentCycleDay' | 'usualScanTime' | 'chartProgress'>;

// Plan dates are calendar dates, so read them as UTC to avoid time zone shifts.
function parseDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatShortDate(isoDate: string): string {
  const date = parseDate(isoDate);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

export function formatWeekday(isoDate: string): string {
  return WEEKDAYS[parseDate(isoDate).getUTCDay()];
}

export function buildTodayViewModel({
  plan,
  currentPlanDay,
  currentCycleDay,
  usualScanTime,
  chartProgress,
}: TodayState): TodayViewModel {
  const date = formatShortDate(currentPlanDay.date);
  const startIndex = currentPlanDay.dayNumber - 1;

  return {
    heroEyebrow: currentCycleDay === null ? date : `${date} · Cycle day ${currentCycleDay}`,
    heroTitle: `Day ${currentPlanDay.dayNumber} of your plan`,
    heroBody: `Use one E3G and one LH | PdG strip today. Try to scan around ${usualScanTime}.`,
    strips: currentPlanDay.strips.map((strip) => STRIP_TOKENS[strip]),
    upcomingDays: plan.days.slice(startIndex, startIndex + UPCOMING_DAY_COUNT).map((day, index) => ({
      date: day.date,
      label: index === 0 ? 'Today' : formatWeekday(day.date),
      strips: day.strips.map((strip) => STRIP_TOKENS[strip]),
    })),
    chart: {
      locked: !chartProgress.unlocked,
      required: chartProgress.required,
      completed: chartProgress.completed,
      remainingLabel: `${chartProgress.remaining} to go`,
    },
  };
}

export function useTodayViewModel(): TodayViewModel {
  const state = useDemoState();
  return buildTodayViewModel(state);
}
