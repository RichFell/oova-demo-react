import { createContext, use, useMemo, useReducer, type ReactNode } from 'react';

import type { PlanDay, ScanPlan } from '@/data/plan';
import {
  createInitialDemoState,
  demoReducer,
  selectCanCompleteScan,
  selectChartProgress,
  selectCompletedScans,
  selectCurrentCycleDay,
  selectCurrentPlanDay,
  selectPlan,
  selectReportProgress,
  type DemoProfile,
  type SampleScan,
  type UnlockProgress,
} from './demoState';

export interface DemoStateValue {
  profile: DemoProfile;
  plan: ScanPlan;
  completedScans: SampleScan[];
  usualScanTime: string;
  currentPlanDay: PlanDay;
  currentCycleDay: number | null;
  canCompleteScan: boolean;
  chartProgress: UnlockProgress;
  reportProgress: UnlockProgress;
  setLastPeriodStart: (date: string) => void;
  setTypicalBleedDays: (days: number) => void;
  completeScan: () => void;
  reset: () => void;
}

const DemoStateContext = createContext<DemoStateValue | null>(null);

/** In-memory demo state. Nothing is persisted, so a restart returns to the sample data. */
export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialDemoState);

  const value = useMemo((): DemoStateValue => {
    const plan = selectPlan(state);
    return {
      profile: state.profile,
      plan,
      completedScans: selectCompletedScans(state),
      usualScanTime: state.profile.usualScanTime,
      currentPlanDay: selectCurrentPlanDay(state, plan),
      currentCycleDay: selectCurrentCycleDay(state, plan),
      canCompleteScan: selectCanCompleteScan(state),
      chartProgress: selectChartProgress(state),
      reportProgress: selectReportProgress(state),
      setLastPeriodStart: (date) => dispatch({ type: 'setLastPeriodStart', date }),
      setTypicalBleedDays: (days) => dispatch({ type: 'setTypicalBleedDays', days }),
      completeScan: () => dispatch({ type: 'completeScan' }),
      reset: () => dispatch({ type: 'reset' }),
    };
  }, [state]);

  return <DemoStateContext value={value}>{children}</DemoStateContext>;
}

export function useDemoState(): DemoStateValue {
  const value = use(DemoStateContext);
  if (!value) {
    throw new Error('useDemoState must be used inside DemoStateProvider.');
  }
  return value;
}
