import { useState } from 'react';

import type { StripType } from '@/components/StripToken';
import type { PlanDay } from '@/data/plan';
import type { ScanMode } from '@/hooks/useAppRouter';
import { currentPlanDay } from '@/hooks/currentDay';
import { usePlanQuery, useScansQuery } from '@/hooks/useDemoQueries';
import { STRIP_TOKENS } from '@/hooks/useTodayViewModel';

/** Sample step, timer, scan, and completion. */
export const SCAN_STEP_COUNT = 4;

// The concept names E3G first, matching the plan's day copy.
const STRIP_TITLE_ORDER: StripType[] = ['E3G', 'LH | PdG'];

export interface ManualScanSetup {
  stripsTitle: string;
  strips: StripType[];
}

export interface ScanSetupHeader {
  title: string;
  subtitle?: string;
  completedSteps: number;
}

/** Guided reuses the plan header. Manual is the first step of the test. */
export function buildScanSetupHeader(mode: ScanMode, plan: { title: string; subtitle: string }): ScanSetupHeader {
  if (mode === 'manual') {
    return { title: "Get ready for today's scan", completedSteps: 1 };
  }
  return { title: plan.title, subtitle: plan.subtitle, completedSteps: SCAN_STEP_COUNT };
}

export function buildManualScanSetup(currentPlanDay: Pick<PlanDay, 'strips'>): ManualScanSetup {
  const strips = currentPlanDay.strips.map((strip) => STRIP_TOKENS[strip]);
  return {
    stripsTitle: STRIP_TITLE_ORDER.filter((strip) => strips.includes(strip)).join(' + '),
    strips,
  };
}

// The mode is view state only and isn't saved. Null until every query has data.
export function useScanSetupViewModel(initialMode: ScanMode) {
  const plan = usePlanQuery();
  const scans = useScansQuery();
  const [mode, setMode] = useState<ScanMode>(initialMode);
  if (!plan || !scans) {
    return null;
  }

  return {
    mode,
    setMode,
    manual: buildManualScanSetup(currentPlanDay(plan.plan, scans.completedScans.length, scans.canCompleteScan)),
  };
}
