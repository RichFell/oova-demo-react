import { use } from 'react';

import { QueryCache } from '@/services/queryCache';
import { useServices } from '@/services/ServicesProvider';
import { MockTransport } from '@/services/transport';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

describe('useServices', () => {
  it('returns the provided services', () => {
    const services = { transport: new MockTransport({}), cache: new QueryCache() };
    jest.mocked(use).mockReturnValue(services);
    expect(useServices()).toBe(services);
  });

  it('throws outside ServicesProvider', () => {
    jest.mocked(use).mockReturnValue(null);
    expect(() => useServices()).toThrow('useServices must be used inside ServicesProvider.');
  });
});
