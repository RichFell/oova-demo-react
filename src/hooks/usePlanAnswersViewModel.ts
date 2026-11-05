import { useState } from 'react';

import type { StripType } from '@/components/StripToken';
import { addDays, type ScanPlan } from '@/data/plan';
import { sampleProfile } from '@/data/sample';
import { STRIP_TOKENS, formatShortDate } from '@/hooks/useTodayViewModel';
import { useDemoState } from '@/state/DemoStateProvider';
import type { DemoProfile } from '@/state/demoState';

/** The last period date can move back this many days from the sample answer. */
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
  profile: DemoProfile;
  plan: ScanPlan;
  /** The demo's current date: the plan day being scanned. */
  today: string;
  editing: boolean;
}

export function earliestLastPeriodStart(): string {
  return addDays(sampleProfile.lastPeriodStart, -LAST_PERIOD_MAX_DAYS_BACK);
}

/** The moved date, or null when it would leave the allowed range. */
export function stepLastPeriodStart(current: string, days: number, today: string): string | null {
  const next = addDays(current, days);
  return next >= earliestLastPeriodStart() && next <= today ? next : null;
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
  const { lastPeriodStart, typicalBleedDays } = profile;

  return {
    editing,
    actionLabel: editing ? 'Done' : 'Edit',
    healthJourney: profile.healthJourney,
    regularCycles: profile.regularCycles ? 'Yes' : 'No',
    // The stepper leaves less room, so editing drops the year as in the concept.
    lastPeriodStarted: editing ? formatShortDate(lastPeriodStart) : formatLongDate(lastPeriodStart),
    typicalBleeding: pluralize(typicalBleedDays, 'day', 'days'),
    lastPeriodStepper: {
      canDecrease: stepLastPeriodStart(lastPeriodStart, -1, today) !== null,
      canIncrease: stepLastPeriodStart(lastPeriodStart, 1, today) !== null,
    },
    bleedingStepper: {
      canDecrease: stepTypicalBleedDays(typicalBleedDays, -1) !== null,
      canIncrease: stepTypicalBleedDays(typicalBleedDays, 1) !== null,
    },
    strips: (['lh-pdg', 'e3g'] as const).map((strip) => ({
      type: STRIP_TOKENS[strip],
      count: pluralize(plan.stripCounts[strip], 'strip', 'strips'),
    })),
  };
}

// Edit mode is view state only. Answers live in the in-memory demo state and reset on restart.
export function usePlanAnswersViewModel() {
  const { profile, plan, currentPlanDay, setLastPeriodStart, setTypicalBleedDays } = useDemoState();
  const [editing, setEditing] = useState(false);
  const model = buildPlanAnswersViewModel({ profile, plan, today: currentPlanDay.date, editing });

  const moveLastPeriod = (days: number) => {
    const next = stepLastPeriodStart(profile.lastPeriodStart, days, currentPlanDay.date);
    if (next) {
      setLastPeriodStart(next);
    }
  };

  const changeBleedDays = (days: number) => {
    const next = stepTypicalBleedDays(profile.typicalBleedDays, days);
    if (next) {
      setTypicalBleedDays(next);
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
