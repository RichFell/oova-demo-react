import { use } from 'react';

import { DemoService, PlanService, ProfileService, ScanService } from '@/services/domainServices';
import { createServices, resetDemo, useServices } from '@/services/ServicesProvider';
import { MOCK_DELAY_MS, MockTransport } from '@/services/transport';

describe('createServices', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('builds the services on a mock backend by default', async () => {
    jest.useFakeTimers();
    const services = createServices();
    expect(services.profile).toBeInstanceOf(ProfileService);
    expect(services.plan).toBeInstanceOf(PlanService);
    expect(services.scans).toBeInstanceOf(ScanService);
    expect(services.demo).toBeInstanceOf(DemoService);

    const scans = services.scans.getScans();
    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await expect(scans).resolves.toMatchObject({ completedScans: [], canCompleteScan: true });
  });

  it('uses the transport passed in', () => {
    const transport = new MockTransport({});
    expect(createServices(transport).transport).toBe(transport);
  });
});

describe('resetDemo', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('resets the backend, then refreshes each service', async () => {
    jest.useFakeTimers();
    const services = createServices();
    const refreshes = [services.profile, services.plan, services.scans].map((service) =>
      jest.spyOn(service, 'refresh'),
    );
    const reset = resetDemo(services);
    refreshes.forEach((refresh) => expect(refresh).not.toHaveBeenCalled());

    await jest.advanceTimersByTimeAsync(MOCK_DELAY_MS);
    await reset;
    refreshes.forEach((refresh) => expect(refresh).toHaveBeenCalledTimes(1));
  });
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

describe('useServices', () => {
  it('returns the provided services', () => {
    const services = createServices(new MockTransport({}));
    jest.mocked(use).mockReturnValue(services);
    expect(useServices()).toBe(services);
  });

  it('throws outside ServicesProvider', () => {
    jest.mocked(use).mockReturnValue(null);
    expect(() => useServices()).toThrow('useServices must be used inside ServicesProvider.');
  });
});
