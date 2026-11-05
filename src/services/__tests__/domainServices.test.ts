import { sampleHormoneScans, sampleProfile } from '@/data/sample';
import { DemoService, PlanService, ProfileService, ScanService } from '@/services/domainServices';
import { createMockBackend } from '@/services/mock';
import { MOCK_DELAY_MS, MockTransport } from '@/services/transport';

function setup() {
  const transport = new MockTransport(createMockBackend());
  return {
    transport,
    profile: new ProfileService(transport),
    plan: new PlanService(transport),
    scans: new ScanService(transport),
    demo: new DemoService(transport),
  };
}

async function settle<T>(promise: Promise<T>): Promise<T> {
  await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
  return promise;
}

describe('domain services', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reads each route through the transport', async () => {
    const { profile, plan, scans } = setup();
    const { healthJourney, regularCycles, usualScanTime } = sampleProfile;
    await expect(settle(profile.getProfile())).resolves.toEqual({ healthJourney, regularCycles, usualScanTime });
    await expect(settle(plan.getPlan())).resolves.toMatchObject({
      lastPeriodStart: sampleProfile.lastPeriodStart,
      typicalBleedDays: sampleProfile.typicalBleedDays,
    });
    await expect(settle(scans.getScans())).resolves.toEqual({
      completedScans: [],
      canCompleteScan: true,
      chart: { required: 3, completed: 0, remaining: 3, unlocked: false },
      report: { required: 4, completed: 0, remaining: 4, unlocked: false },
    });
  });

  it('gives each service its own cache', () => {
    const { profile, plan, scans } = setup();
    expect(new Set([profile.cache, plan.cache, scans.cache]).size).toBe(3);
  });

  it('updatePlan sends only the given fields and stores the response in its own cache', async () => {
    const { profile, plan, scans } = setup();
    const response = await settle(plan.updatePlan({ typicalBleedDays: 6 }));
    expect(response).toMatchObject({ lastPeriodStart: sampleProfile.lastPeriodStart, typicalBleedDays: 6 });
    expect(plan.cache.getState('/plan')).toEqual({ data: response, isLoading: false, error: undefined });
    expect(profile.cache.getState('/plan').data).toBeUndefined();
    expect(scans.cache.getState('/plan').data).toBeUndefined();
  });

  it('updatePlan is reflected by the next plan read', async () => {
    const { plan } = setup();
    const before = await settle(plan.getPlan());
    await settle(plan.updatePlan({ lastPeriodStart: '2026-11-01' }));
    const after = await settle(plan.getPlan());
    expect(after.lastPeriodStart).toBe('2026-11-01');
    expect(after.plan).not.toEqual(before.plan);
  });

  it('completeScan returns the updated scans and progress and stores them in its own cache', async () => {
    const { plan, scans } = setup();
    const response = await settle(scans.completeScan());
    expect(response).toMatchObject({
      completedScans: sampleHormoneScans.slice(0, 1),
      canCompleteScan: true,
      chart: { completed: 1, remaining: 2 },
    });
    expect(scans.cache.getState('/scans')).toEqual({ data: response, isLoading: false, error: undefined });
    expect(plan.cache.getState('/scans').data).toBeUndefined();
  });

  it('does not touch the cache before the write settles', async () => {
    const { scans } = setup();
    const write = scans.completeScan();
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS - 1);
    expect(scans.cache.getState('/scans').data).toBeUndefined();
    await settle(write);
    expect(scans.cache.getState('/scans').data).toBeDefined();
  });

  it('refresh makes mounted queries fetch their own route again', async () => {
    const { transport, scans } = setup();
    const request = jest.spyOn(transport, 'request');
    scans.cache.subscribe('/scans', jest.fn());
    scans.cache.ensure('/scans', () => scans.getScans());
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);

    scans.refresh();
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenLastCalledWith({ method: 'GET', route: '/scans' });
  });

  it('reset returns the backend to the sample data', async () => {
    const { plan, scans, demo } = setup();
    await settle(plan.updatePlan({ typicalBleedDays: 6 }));
    await settle(scans.completeScan());

    await expect(settle(demo.reset())).resolves.toBeUndefined();
    await expect(settle(plan.getPlan())).resolves.toMatchObject({ typicalBleedDays: sampleProfile.typicalBleedDays });
    await expect(settle(scans.getScans())).resolves.toMatchObject({ completedScans: [] });
  });
});
