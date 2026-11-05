import { createContext, use, useState, type ReactNode } from 'react';

import { DemoService, PlanService, ProfileService, ScanService } from './domainServices';
import { createMockBackend } from './mock';
import { MockTransport, type Transport } from './transport';

export interface Services {
  transport: Transport;
  profile: ProfileService;
  plan: PlanService;
  scans: ScanService;
  demo: DemoService;
}

/** Builds the services on a transport, by default one backed by a new mock backend. */
export function createServices(
  transport: Transport = new MockTransport(createMockBackend()),
): Services {
  return {
    transport,
    profile: new ProfileService(transport),
    plan: new PlanService(transport),
    scans: new ScanService(transport),
    demo: new DemoService(transport),
  };
}

/** Resets the backend, then has each service fetch its own route again. */
export async function resetDemo({ demo, profile, plan, scans }: Services): Promise<void> {
  await demo.reset();
  [profile, plan, scans].forEach((service) => service.refresh());
}

/** Settles once each service has loaded its own route into its own cache. */
export async function prefetchServices({ profile, plan, scans }: Services): Promise<void> {
  await Promise.all([profile.prefetch(), plan.prefetch(), scans.prefetch()]);
}

const ServicesContext = createContext<Services | null>(null);

interface ServicesProviderProps {
  /** Replaces the mock transport, for tests and previews. */
  transport?: Transport;
  children: ReactNode;
}

/** Builds the mock backend, transport, and services, each with its own cache, once for the app. */
export function ServicesProvider({ transport, children }: ServicesProviderProps) {
  const [services] = useState(() => createServices(transport));

  return <ServicesContext value={services}>{children}</ServicesContext>;
}

export function useServices(): Services {
  const services = use(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used inside ServicesProvider.');
  }
  return services;
}
