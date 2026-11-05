import { useState } from 'react';

import type { ScanPlan } from '@/data/plan';
import type { StripType } from '@/components/StripToken';
import { currentPlanDay } from '@/hooks/currentDay';
import { usePlanQuery, useScansQuery } from '@/hooks/useDemoQueries';
import { STRIP_TOKENS, formatShortDate, formatWeekday } from '@/hooks/useTodayViewModel';

const PERIOD_DAY_NOTE = 'This is an expected period day.';

export interface TimelineDay {
  date: string;
  weekday: string;
  dayOfMonth: string;
  strips: StripType[];
  expectedPeriodDay: boolean;
  selected: boolean;
  accessibilityLabel: string;
}

export interface PlanDayDetails {
  eyebrow: string;
  title: string;
  body: string;
}

export interface PlanViewModel {
  title: string;
  subtitle: string;
  days: TimelineDay[];
  showPeriodLegend: boolean;
  details: PlanDayDetails;
}

/** Falls back to the first plan day when `selectedDate` isn't in the plan. */
export function buildPlanViewModel(plan: ScanPlan, selectedDate: string): PlanViewModel {
  const selected = plan.days.find((day) => day.date === selectedDate) ?? plan.days[0];

  const days = plan.days.map((day): TimelineDay => {
    const weekday = formatWeekday(day.date);
    const strips = day.strips.map((strip) => STRIP_TOKENS[strip]);
    const label = `${weekday} ${formatShortDate(day.date)}, Day ${day.dayNumber}: ${strips.join(', ')}`;
    return {
      date: day.date,
      weekday,
      dayOfMonth: String(Number(day.date.slice(8))),
      strips,
      expectedPeriodDay: day.expectedPeriodDay,
      selected: day.date === selected.date,
      accessibilityLabel: day.expectedPeriodDay ? `${label}. ${PERIOD_DAY_NOTE}` : label,
    };
  });

  const body = 'Scan one E3G strip and one LH | PdG strip around your usual time.';

  return {
    title: `Your ${plan.days.length}-day plan`,
    subtitle: `${formatShortDate(plan.startDate)} – ${formatShortDate(plan.endDate)} · Tap a day for details`,
    days,
    showPeriodLegend: plan.days.some((day) => day.expectedPeriodDay),
    details: {
      eyebrow: `Day ${selected.dayNumber} · ${formatShortDate(selected.date)}`,
      title: 'Use both strip types',
      body: selected.expectedPeriodDay ? `${body} ${PERIOD_DAY_NOTE}` : body,
    },
  };
}

// Selection is view state only; plan data always comes from the plan service. Until a day is
// tapped, the current plan day is selected. Null until every query has data.
export function usePlanViewModel() {
  const plan = usePlanQuery();
  const scans = useScansQuery();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  if (!plan || !scans) {
    return null;
  }

  const today = currentPlanDay(plan.plan, scans.completedScans.length, scans.canCompleteScan);
  return {
    ...buildPlanViewModel(plan.plan, selectedDate ?? today.date),
    selectDay: setSelectedDate,
  };
}
