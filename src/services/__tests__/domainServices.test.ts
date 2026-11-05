import { sampleHormoneScans, sampleProfile } from '@/data/sample';
import { PlanService, ProfileService, ScanService } from '@/services/domainServices';
import { createMockBackend } from '@/services/mock';
import { MOCK_DELAY_MS, MockTransport } from '@/services/transport';

function setup() {
  const transport = new MockTransport(createMockBackend());
  const cache = { invalidate: jest.fn() };
  return {
    cache,
    profile: new ProfileService(transport, cache),
    plan: new PlanService(transport),
    scans: new ScanService(transport, cache),
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
    await expect(settle(profile.getProfile())).resolves.toEqual(sampleProfile);
    await expect(settle(plan.getPlan())).resolves.toMatchObject({
      currentPlanDay: { date: sampleProfile.lastPeriodStart },
      currentCycleDay: 1,
    });
    await expect(settle(scans.getScans())).resolves.toEqual({
      completedScans: [],
      canCompleteScan: true,
    });
    await expect(settle(scans.getProgress())).resolves.toEqual({
      chart: { required: 3, completed: 0, remaining: 3, unlocked: false },
      report: { required: 4, completed: 0, remaining: 4, unlocked: false },
    });
  });

  it('updateProfile sends only the given fields and invalidates /profile and /plan', async () => {
    const { cache, profile } = setup();
    await expect(settle(profile.updateProfile({ typicalBleedDays: 6 }))).resolves.toEqual({
      ...sampleProfile,
      typicalBleedDays: 6,
    });
    expect(cache.invalidate).toHaveBeenCalledTimes(1);
    expect(cache.invalidate).toHaveBeenCalledWith(['/profile', '/plan']);
  });

  it('updateProfile is reflected by the next plan read', async () => {
    const { profile, plan } = setup();
    await settle(profile.updateProfile({ lastPeriodStart: '2026-11-01' }));
    await expect(settle(plan.getPlan())).resolves.toMatchObject({ currentCycleDay: 3 });
  });

  it('completeScan returns the updated scans and invalidates /scans, /plan, and /progress', async () => {
    const { cache, scans } = setup();
    await expect(settle(scans.completeScan())).resolves.toEqual({
      completedScans: sampleHormoneScans.slice(0, 1),
      canCompleteScan: true,
    });
    expect(cache.invalidate).toHaveBeenCalledTimes(1);
    expect(cache.invalidate).toHaveBeenCalledWith(['/scans', '/plan', '/progress']);
  });

  it('completeScan is reflected by the next scans and progress reads', async () => {
    const { scans } = setup();
    await settle(scans.completeScan());
    await expect(settle(scans.getScans())).resolves.toMatchObject({
      completedScans: sampleHormoneScans.slice(0, 1),
    });
    await expect(settle(scans.getProgress())).resolves.toMatchObject({
      chart: { completed: 1, remaining: 2 },
    });
  });

  it('reset returns the sample data and invalidates every route', async () => {
    const { cache, profile, scans } = setup();
    await settle(profile.updateProfile({ typicalBleedDays: 6 }));
    await settle(scans.completeScan());
    cache.invalidate.mockClear();

    await expect(settle(profile.reset())).resolves.toBeUndefined();
    expect(cache.invalidate).toHaveBeenCalledTimes(1);
    expect(cache.invalidate).toHaveBeenCalledWith(['/profile', '/plan', '/scans', '/progress']);
    await expect(settle(profile.getProfile())).resolves.toEqual(sampleProfile);
    await expect(settle(scans.getScans())).resolves.toMatchObject({ completedScans: [] });
  });

  it('does not invalidate before the write settles', async () => {
    const { cache, scans } = setup();
    const write = scans.completeScan();
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS - 1);
    expect(cache.invalidate).not.toHaveBeenCalled();
    await settle(write);
    expect(cache.invalidate).toHaveBeenCalled();
  });
});
