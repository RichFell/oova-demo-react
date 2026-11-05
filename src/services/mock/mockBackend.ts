import {
  ROUTES,
  type PlanResponse,
  type PlanUpdate,
  type ProfileResponse,
  type ScansResponse,
} from '../api';
import type { RouteTable } from '../transport';
import {
  createInitialDemoState,
  demoReducer,
  selectCanCompleteScan,
  selectChartProgress,
  selectCompletedScans,
  selectPlan,
  selectReportProgress,
  type DemoAction,
  type DemoState,
} from './demoState';

/**
 * Holds its own in-memory demo state, starting from the sample data, and serves it as a route
 * table for `MockTransport`. Every response is fictional sample data.
 */
export function createMockBackend(): RouteTable {
  let state: DemoState = createInitialDemoState();

  const dispatch = (action: DemoAction) => {
    state = demoReducer(state, action);
  };

  const profile = (): ProfileResponse => {
    const { healthJourney, regularCycles, usualScanTime } = state.profile;
    return { healthJourney, regularCycles, usualScanTime };
  };

  const plan = (): PlanResponse => ({
    plan: selectPlan(state),
    lastPeriodStart: state.profile.lastPeriodStart,
    typicalBleedDays: state.profile.typicalBleedDays,
  });

  const scans = (): ScansResponse => ({
    completedScans: selectCompletedScans(state),
    canCompleteScan: selectCanCompleteScan(state),
    chart: selectChartProgress(state),
    report: selectReportProgress(state),
  });

  return {
    [ROUTES.profile]: { GET: profile },
    [ROUTES.plan]: {
      GET: plan,
      PATCH: (body) => {
        const update = (body ?? {}) as PlanUpdate;
        if (update.lastPeriodStart !== undefined) {
          dispatch({ type: 'setLastPeriodStart', date: update.lastPeriodStart });
        }
        if (update.typicalBleedDays !== undefined) {
          dispatch({ type: 'setTypicalBleedDays', days: update.typicalBleedDays });
        }
        return plan();
      },
    },
    [ROUTES.scans]: {
      GET: scans,
      POST: () => {
        dispatch({ type: 'completeScan' });
        return scans();
      },
    },
    [ROUTES.reset]: {
      POST: () => {
        dispatch({ type: 'reset' });
        return undefined;
      },
    },
  };
}
