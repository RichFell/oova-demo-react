import { createContext, use, useState, type ReactNode } from 'react';

import { QueryCache } from './queryCache';
import { MockTransport, type Transport } from './transport';

export interface Services {
  transport: Transport;
  cache: QueryCache;
}

const ServicesContext = createContext<Services | null>(null);

interface ServicesProviderProps {
  /** Replaces the mock transport, for tests and previews. */
  transport?: Transport;
  cache?: QueryCache;
  children: ReactNode;
}

/** Builds the transport and client cache once for the app. */
export function ServicesProvider({ transport, cache, children }: ServicesProviderProps) {
  const [services] = useState(
    (): Services => ({
      transport: transport ?? new MockTransport({}),
      cache: cache ?? new QueryCache(),
    }),
  );

  return <ServicesContext value={services}>{children}</ServicesContext>;
}

export function useServices(): Services {
  const services = use(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used inside ServicesProvider.');
  }
  return services;
}
