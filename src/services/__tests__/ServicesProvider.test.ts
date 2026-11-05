import { use } from 'react';

import { PlanService, ProfileService, ScanService } from '@/services/domainServices';
import { QueryCache } from '@/services/queryCache';
import { createServices, useServices } from '@/services/ServicesProvider';
import { MOCK_DELAY_MS, MockTransport } from '@/services/transport';

describe('createServices', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('builds the three services on a mock backend by default', async () => {
    jest.useFakeTimers();
    const services = createServices();
    expect(services.profile).toBeInstanceOf(ProfileService);
    expect(services.plan).toBeInstanceOf(PlanService);
    expect(services.scans).toBeInstanceOf(ScanService);

    const scans = services.scans.getScans();
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await expect(scans).resolves.toEqual({ completedScans: [], canCompleteScan: true });
  });

  it('uses the transport and cache passed in', () => {
    const transport = new MockTransport({});
    const cache = new QueryCache();
    const services = createServices(transport, cache);
    expect(services.transport).toBe(transport);
    expect(services.cache).toBe(cache);
  });
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

describe('useServices', () => {
  it('returns the provided services', () => {
    const services = createServices(new MockTransport({}), new QueryCache());
    jest.mocked(use).mockReturnValue(services);
    expect(useServices()).toBe(services);
  });

  it('throws outside ServicesProvider', () => {
    jest.mocked(use).mockReturnValue(null);
    expect(() => useServices()).toThrow('useServices must be used inside ServicesProvider.');
  });
});
