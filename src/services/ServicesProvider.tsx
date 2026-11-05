import { createContext, use, useState, type ReactNode } from 'react';

import { PlanService, ProfileService, ScanService } from './domainServices';
import { createMockBackend } from './mock';
import { QueryCache } from './queryCache';
import { MockTransport, type Transport } from './transport';

export interface Services {
  transport: Transport;
  cache: QueryCache;
  profile: ProfileService;
  plan: PlanService;
  scans: ScanService;
}

/** Builds the services on a transport, by default one backed by a new mock backend. */
export function createServices(
  transport: Transport = new MockTransport(createMockBackend()),
  cache: QueryCache = new QueryCache(),
): Services {
  return {
    transport,
    cache,
    profile: new ProfileService(transport, cache),
    plan: new PlanService(transport),
    scans: new ScanService(transport, cache),
  };
}

const ServicesContext = createContext<Services | null>(null);

interface ServicesProviderProps {
  /** Replaces the mock transport, for tests and previews. */
  transport?: Transport;
  cache?: QueryCache;
  children: ReactNode;
}

/** Builds the mock backend, transport, client cache, and services once for the app. */
export function ServicesProvider({ transport, cache, children }: ServicesProviderProps) {
  const [services] = useState(() => createServices(transport, cache));

  return <ServicesContext value={services}>{children}</ServicesContext>;
}

export function useServices(): Services {
  const services = use(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used inside ServicesProvider.');
  }
  return services;
}
