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
  type DemoAction,
  type DemoState,
} from '@/state/demoState';

import {
  ROUTES,
  type PlanResponse,
  type ProfileResponse,
  type ProfileUpdate,
  type ProgressResponse,
  type ScansResponse,
} from '../api';
import type { RouteTable } from '../transport';

/**
 * Holds its own in-memory demo state, starting from the sample data, and serves it as a route
 * table for `MockTransport`. Every response is fictional sample data.
 */
export function createMockBackend(): RouteTable {
  let state: DemoState = createInitialDemoState();

  const dispatch = (action: DemoAction) => {
    state = demoReducer(state, action);
  };

  const profile = (): ProfileResponse => ({ ...state.profile });

  const plan = (): PlanResponse => {
    const scanPlan = selectPlan(state);
    return {
      plan: scanPlan,
      currentPlanDay: selectCurrentPlanDay(state, scanPlan),
      currentCycleDay: selectCurrentCycleDay(state, scanPlan),
    };
  };

  const scans = (): ScansResponse => ({
    completedScans: selectCompletedScans(state),
    canCompleteScan: selectCanCompleteScan(state),
  });

  const progress = (): ProgressResponse => ({
    chart: selectChartProgress(state),
    report: selectReportProgress(state),
  });

  return {
    [ROUTES.profile]: {
      GET: profile,
      PATCH: (body) => {
        const update = (body ?? {}) as ProfileUpdate;
        if (update.lastPeriodStart !== undefined) {
          dispatch({ type: 'setLastPeriodStart', date: update.lastPeriodStart });
        }
        if (update.typicalBleedDays !== undefined) {
          dispatch({ type: 'setTypicalBleedDays', days: update.typicalBleedDays });
        }
        return profile();
      },
    },
    [ROUTES.plan]: { GET: plan },
    [ROUTES.scans]: {
      GET: scans,
      POST: () => {
        dispatch({ type: 'completeScan' });
        return scans();
      },
    },
    [ROUTES.progress]: { GET: progress },
    [ROUTES.reset]: {
      POST: () => {
        dispatch({ type: 'reset' });
        return undefined;
      },
    },
  };
}
