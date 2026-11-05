import { sampleHormoneScans, sampleProfile } from '@/data/sample';
import { ROUTES } from '@/services/api';
import { createMockBackend } from '@/services/mock';
import type { HttpMethod, RouteTable } from '@/services/transport';
import {
  createInitialDemoState,
  demoReducer,
  selectChartProgress,
  selectPlan,
  selectReportProgress,
} from '@/state/demoState';

const { healthJourney, regularCycles, usualScanTime, lastPeriodStart, typicalBleedDays } = sampleProfile;
const startingProfile = { healthJourney, regularCycles, usualScanTime };

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
  };
}

describe('createMockBackend', () => {
  it('serves every route in the decision table', () => {
    const routes = createMockBackend();
    expect(Object.keys(routes).sort()).toEqual(['/plan', '/profile', '/reset', '/scans']);
    expect(Object.keys(routes[ROUTES.profile])).toEqual(['GET']);
    expect(Object.keys(routes[ROUTES.plan]).sort()).toEqual(['GET', 'PATCH']);
    expect(Object.keys(routes[ROUTES.scans]).sort()).toEqual(['GET', 'POST']);
    expect(Object.keys(routes[ROUTES.reset])).toEqual(['POST']);
  });

  it('GET /profile returns the sample profile without the period fields', () => {
    expect(call(createMockBackend(), 'GET', ROUTES.profile)).toEqual(startingProfile);
  });

  it('GET /plan returns the plan and its period fields', () => {
    expect(call(createMockBackend(), 'GET', ROUTES.plan)).toEqual({
      plan: selectPlan(createInitialDemoState()),
      lastPeriodStart,
      typicalBleedDays,
    });
  });

  it('GET /scans returns no completed scans, that a scan can be completed, and unlock progress', () => {
    const state = createInitialDemoState();
    expect(call(createMockBackend(), 'GET', ROUTES.scans)).toEqual({
      completedScans: [],
      canCompleteScan: true,
      chart: selectChartProgress(state),
      report: selectReportProgress(state),
    });
  });

  it('PATCH /plan changes only the fields it is sent and returns the updated plan', () => {
    const routes = createMockBackend();
    expect(call(routes, 'PATCH', ROUTES.plan, { typicalBleedDays: 6 })).toMatchObject({
      lastPeriodStart,
      typicalBleedDays: 6,
    });

    let state = createInitialDemoState();
    state = demoReducer(state, { type: 'setLastPeriodStart', date: '2026-11-01' });
    state = demoReducer(state, { type: 'setTypicalBleedDays', days: 6 });
    const expected = { plan: selectPlan(state), lastPeriodStart: '2026-11-01', typicalBleedDays: 6 };

    expect(call(routes, 'PATCH', ROUTES.plan, { lastPeriodStart: '2026-11-01' })).toEqual(expected);
    expect(call(routes, 'GET', ROUTES.plan)).toEqual(expected);
    expect(call(routes, 'GET', ROUTES.profile)).toEqual(startingProfile);
  });

  it('POST /scans completes the next scan and returns the updated scans and progress', () => {
    const routes = createMockBackend();
    call(routes, 'POST', ROUTES.scans);
    call(routes, 'POST', ROUTES.scans);

    let state = createInitialDemoState();
    for (let i = 0; i < 3; i += 1) {
      state = demoReducer(state, { type: 'completeScan' });
    }
    const expected = {
      completedScans: sampleHormoneScans.slice(0, 3),
      canCompleteScan: true,
      chart: selectChartProgress(state),
      report: selectReportProgress(state),
    };

    expect(call(routes, 'POST', ROUTES.scans)).toEqual(expected);
    expect(call(routes, 'GET', ROUTES.scans)).toEqual(expected);
  });

  it('POST /scans stops completing scans once the sample data is used', () => {
    const routes = createMockBackend();
    sampleHormoneScans.forEach(() => call(routes, 'POST', ROUTES.scans));
    expect(call(routes, 'POST', ROUTES.scans)).toMatchObject({
      completedScans: [...sampleHormoneScans],
      canCompleteScan: false,
    });
  });

  it('POST /reset returns nothing and every route to its starting response', () => {
    const routes = createMockBackend();
    const start = readAll(routes);
    call(routes, 'PATCH', ROUTES.plan, { lastPeriodStart: '2026-11-01', typicalBleedDays: 6 });
    call(routes, 'POST', ROUTES.scans);
    expect(readAll(routes)).not.toEqual(start);

    expect(call(routes, 'POST', ROUTES.reset)).toBeUndefined();
    expect(readAll(routes)).toEqual(start);
  });

  it('starts each backend from the sample data on its own', () => {
    const first = createMockBackend();
    const start = readAll(first);
    call(first, 'PATCH', ROUTES.plan, { typicalBleedDays: 6 });
    call(first, 'POST', ROUTES.scans);

    expect(readAll(createMockBackend())).toEqual(start);
  });

  it('does not let a returned profile change the backend state', () => {
    const routes = createMockBackend();
    const profile = call(routes, 'GET', ROUTES.profile) as { usualScanTime: string };
    profile.usualScanTime = 'changed';
    expect(call(routes, 'GET', ROUTES.profile)).toEqual(startingProfile);
  });
});
