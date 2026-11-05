import { useState } from 'react';

import type { StripType } from '@/components/StripToken';
import { addDays } from '@/data/plan';
import { currentPlanDay } from '@/hooks/currentDay';
import { usePlanQuery, useProfileQuery, useScansQuery } from '@/hooks/useDemoQueries';
import { STRIP_TOKENS, formatShortDate } from '@/hooks/useTodayViewModel';
import type { PlanResponse, ProfileResponse } from '@/services/api';
import { useServices } from '@/services/ServicesProvider';

/**
 * The last period date can move back this many days from the sample answer, which is the
 * plan's start date.
 */
export const LAST_PERIOD_MAX_DAYS_BACK = 14;
export const TYPICAL_BLEED_DAYS_MIN = 1;
export const TYPICAL_BLEED_DAYS_MAX = 10;

export interface AnswerStepper {
  canDecrease: boolean;
  canIncrease: boolean;
}

export interface PlanAnswersViewModel {
  editing: boolean;
  actionLabel: string;
  healthJourney: string;
  regularCycles: string;
  lastPeriodStarted: string;
  typicalBleeding: string;
  lastPeriodStepper: AnswerStepper;
  bleedingStepper: AnswerStepper;
  strips: { type: StripType; count: string }[];
}

interface PlanAnswersState {
  profile: Pick<ProfileResponse, 'healthJourney' | 'regularCycles'>;
  plan: PlanResponse;
  /** The demo's current date: the plan day being scanned. */
  today: string;
  editing: boolean;
}

export function earliestLastPeriodStart(planStartDate: string): string {
  return addDays(planStartDate, -LAST_PERIOD_MAX_DAYS_BACK);
}

/** The moved date, or null when it would leave the allowed range. */
export function stepLastPeriodStart(
  current: string,
  days: number,
  today: string,
  planStartDate: string,
): string | null {
  const next = addDays(current, days);
  return next >= earliestLastPeriodStart(planStartDate) && next <= today ? next : null;
}

/** The changed day count, or null when it would leave the allowed range. */
export function stepTypicalBleedDays(current: number, days: number): number | null {
  const next = current + days;
  return next >= TYPICAL_BLEED_DAYS_MIN && next <= TYPICAL_BLEED_DAYS_MAX ? next : null;
}

function formatLongDate(isoDate: string): string {
  return `${formatShortDate(isoDate)}, ${isoDate.slice(0, 4)}`;
}

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

export function buildPlanAnswersViewModel({
  profile,
  plan,
  today,
  editing,
}: PlanAnswersState): PlanAnswersViewModel {
  const { lastPeriodStart, typicalBleedDays } = plan;
  const planStartDate = plan.plan.startDate;

  return {
    editing,
    actionLabel: editing ? 'Done' : 'Edit',
    healthJourney: profile.healthJourney,
    regularCycles: profile.regularCycles ? 'Yes' : 'No',
    // The stepper leaves less room, so editing drops the year as in the concept.
    lastPeriodStarted: editing ? formatShortDate(lastPeriodStart) : formatLongDate(lastPeriodStart),
    typicalBleeding: pluralize(typicalBleedDays, 'day', 'days'),
    lastPeriodStepper: {
      canDecrease: stepLastPeriodStart(lastPeriodStart, -1, today, planStartDate) !== null,
      canIncrease: stepLastPeriodStart(lastPeriodStart, 1, today, planStartDate) !== null,
    },
    bleedingStepper: {
      canDecrease: stepTypicalBleedDays(typicalBleedDays, -1) !== null,
      canIncrease: stepTypicalBleedDays(typicalBleedDays, 1) !== null,
    },
    strips: (['lh-pdg', 'e3g'] as const).map((strip) => ({
      type: STRIP_TOKENS[strip],
      count: pluralize(plan.plan.stripCounts[strip], 'strip', 'strips'),
    })),
  };
}

// Edit mode is view state only. Answers are saved through the plan service, whose response
// updates the plan's cache, so the timeline updates without another request. Null until every
// query has data.
export function usePlanAnswersViewModel() {
  const services = useServices();
  const profile = useProfileQuery();
  const plan = usePlanQuery();
  const scans = useScansQuery();
  const [editing, setEditing] = useState(false);
  if (!profile || !plan || !scans) {
    return null;
  }

  const today = currentPlanDay(plan.plan, scans.completedScans.length, scans.canCompleteScan).date;
  const model = buildPlanAnswersViewModel({ profile, plan, today, editing });

  const moveLastPeriod = (days: number) => {
    const next = stepLastPeriodStart(plan.lastPeriodStart, days, today, plan.plan.startDate);
    if (next) {
      void services.plan.updatePlan({ lastPeriodStart: next });
    }
  };

  const changeBleedDays = (days: number) => {
    const next = stepTypicalBleedDays(plan.typicalBleedDays, days);
    if (next) {
      void services.plan.updatePlan({ typicalBleedDays: next });
    }
  };

  return {
    ...model,
    toggleEditing: () => setEditing((value) => !value),
    decreaseLastPeriod: () => moveLastPeriod(-1),
    increaseLastPeriod: () => moveLastPeriod(1),
    decreaseBleeding: () => changeBleedDays(-1),
    increaseBleeding: () => changeBleedDays(1),
  };
}
