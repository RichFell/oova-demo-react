import { sampleHormoneScans, sampleProfile } from '@/data/sample';
import { ROUTES } from '@/services/api';
import { createMockBackend } from '@/services/mock';
import type { HttpMethod, RouteTable } from '@/services/transport';
import {
  createInitialDemoState,
  demoReducer,
  selectChartProgress,
  selectCurrentCycleDay,
  selectCurrentPlanDay,
  selectPlan,
  selectReportProgress,
} from '@/state/demoState';

function call(routes: RouteTable, method: HttpMethod, route: string, body?: unknown) {
  const handler = routes[route]?.[method];
  if (!handler) {
    throw new Error(`Missing ${method} ${route}`);
  }
  return handler(body);
}

function readAll(routes: RouteTable) {
  return {
    profile: call(routes, 'GET', ROUTES.profile),
    plan: call(routes, 'GET', ROUTES.plan),
    scans: call(routes, 'GET', ROUTES.scans),
    progress: call(routes, 'GET', ROUTES.progress),
  };
}

describe('createMockBackend', () => {
  it('serves every route in the decision table', () => {
    const routes = createMockBackend();
    expect(Object.keys(routes).sort()).toEqual(
      ['/plan', '/profile', '/progress', '/reset', '/scans'],
    );
    expect(Object.keys(routes[ROUTES.profile]).sort()).toEqual(['GET', 'PATCH']);
    expect(Object.keys(routes[ROUTES.plan])).toEqual(['GET']);
    expect(Object.keys(routes[ROUTES.scans]).sort()).toEqual(['GET', 'POST']);
    expect(Object.keys(routes[ROUTES.progress])).toEqual(['GET']);
    expect(Object.keys(routes[ROUTES.reset])).toEqual(['POST']);
  });

  it('GET /profile returns the sample profile', () => {
    expect(call(createMockBackend(), 'GET', ROUTES.profile)).toEqual(sampleProfile);
  });

  it('GET /plan returns the plan, current plan day, and current cycle day', () => {
    const state = createInitialDemoState();
    const plan = selectPlan(state);
    expect(call(createMockBackend(), 'GET', ROUTES.plan)).toEqual({
      plan,
      currentPlanDay: selectCurrentPlanDay(state, plan),
      currentCycleDay: selectCurrentCycleDay(state, plan),
    });
  });

  it('GET /scans returns no completed scans and that a scan can be completed', () => {
    expect(call(createMockBackend(), 'GET', ROUTES.scans)).toEqual({
      completedScans: [],
      canCompleteScan: true,
    });
  });

  it('GET /progress returns chart and report unlock progress', () => {
    const state = createInitialDemoState();
    expect(call(createMockBackend(), 'GET', ROUTES.progress)).toEqual({
      chart: selectChartProgress(state),
      report: selectReportProgress(state),
    });
  });

  it('PATCH /profile changes only the fields it is sent', () => {
    const routes = createMockBackend();
    expect(call(routes, 'PATCH', ROUTES.profile, { typicalBleedDays: 6 })).toEqual({
      ...sampleProfile,
      typicalBleedDays: 6,
    });
    expect(call(routes, 'PATCH', ROUTES.profile, { lastPeriodStart: '2026-11-01' })).toEqual({
      ...sampleProfile,
      lastPeriodStart: '2026-11-01',
      typicalBleedDays: 6,
    });
    expect(call(routes, 'GET', ROUTES.profile)).toEqual({
      ...sampleProfile,
      lastPeriodStart: '2026-11-01',
      typicalBleedDays: 6,
    });
  });

  it('PATCH /profile is reflected by the next GET /plan', () => {
    const routes = createMockBackend();
    call(routes, 'PATCH', ROUTES.profile, { lastPeriodStart: '2026-11-01', typicalBleedDays: 6 });

    let state = createInitialDemoState();
    state = demoReducer(state, { type: 'setLastPeriodStart', date: '2026-11-01' });
    state = demoReducer(state, { type: 'setTypicalBleedDays', days: 6 });
    const plan = selectPlan(state);

    const response = call(routes, 'GET', ROUTES.plan);
    expect(response).toEqual({
      plan,
      currentPlanDay: selectCurrentPlanDay(state, plan),
      currentCycleDay: selectCurrentCycleDay(state, plan),
    });
    expect(response).not.toEqual(call(createMockBackend(), 'GET', ROUTES.plan));
  });

  it('POST /scans completes the next scan and returns the updated scans', () => {
    const routes = createMockBackend();
    expect(call(routes, 'POST', ROUTES.scans)).toEqual({
      completedScans: sampleHormoneScans.slice(0, 1),
      canCompleteScan: true,
    });
  });

  it('POST /scans is reflected by the next GET /scans, /plan, and /progress', () => {
    const routes = createMockBackend();
    call(routes, 'POST', ROUTES.scans);
    call(routes, 'POST', ROUTES.scans);
    call(routes, 'POST', ROUTES.scans);

    let state = createInitialDemoState();
    for (let i = 0; i < 3; i += 1) {
      state = demoReducer(state, { type: 'completeScan' });
    }
    const plan = selectPlan(state);

    expect(call(routes, 'GET', ROUTES.scans)).toEqual({
      completedScans: sampleHormoneScans.slice(0, 3),
      canCompleteScan: true,
    });
    expect(call(routes, 'GET', ROUTES.progress)).toEqual({
      chart: selectChartProgress(state),
      report: selectReportProgress(state),
    });
    expect(call(routes, 'GET', ROUTES.plan)).toEqual({
      plan,
      currentPlanDay: selectCurrentPlanDay(state, plan),
      currentCycleDay: selectCurrentCycleDay(state, plan),
    });
  });

  it('POST /scans stops completing scans once the sample data is used', () => {
    const routes = createMockBackend();
    sampleHormoneScans.forEach(() => call(routes, 'POST', ROUTES.scans));
    expect(call(routes, 'POST', ROUTES.scans)).toEqual({
      completedScans: [...sampleHormoneScans],
      canCompleteScan: false,
    });
  });

  it('POST /reset returns nothing and every route to its starting response', () => {
    const routes = createMockBackend();
    const start = readAll(routes);
    call(routes, 'PATCH', ROUTES.profile, { lastPeriodStart: '2026-11-01', typicalBleedDays: 6 });
    call(routes, 'POST', ROUTES.scans);
    expect(readAll(routes)).not.toEqual(start);

    expect(call(routes, 'POST', ROUTES.reset)).toBeUndefined();
    expect(readAll(routes)).toEqual(start);
  });

  it('starts each backend from the sample data on its own', () => {
    const first = createMockBackend();
    const start = readAll(first);
    call(first, 'PATCH', ROUTES.profile, { typicalBleedDays: 6 });
    call(first, 'POST', ROUTES.scans);

    expect(readAll(createMockBackend())).toEqual(start);
  });

  it('does not let a returned profile change the backend state', () => {
    const routes = createMockBackend();
    const profile = call(routes, 'GET', ROUTES.profile) as { typicalBleedDays: number };
    profile.typicalBleedDays = 9;
    expect(call(routes, 'GET', ROUTES.profile)).toEqual(sampleProfile);
  });
});
