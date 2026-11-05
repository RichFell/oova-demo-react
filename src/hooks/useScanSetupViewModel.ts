import { useState } from 'react';

import type { StripType } from '@/components/StripToken';
import type { PlanDay } from '@/data/plan';
import type { ScanMode } from '@/hooks/useAppRouter';
import { STRIP_TOKENS } from '@/hooks/useTodayViewModel';
import { useDemoState } from '@/state/DemoStateProvider';

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

// The mode is view state only and isn't saved.
export function useScanSetupViewModel(initialMode: ScanMode) {
  const { currentPlanDay } = useDemoState();
  const [mode, setMode] = useState<ScanMode>(initialMode);

  return {
    mode,
    setMode,
    manual: buildManualScanSetup(currentPlanDay),
  };
}
