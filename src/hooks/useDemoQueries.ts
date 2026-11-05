import { ROUTES, type PlanResponse, type ProfileResponse, type ScansResponse } from '@/services/api';
import { useServices } from '@/services/ServicesProvider';
import { useQuery } from '@/services/useQuery';

// Each query reads one service's route from that service's own cache.

export function useProfileQuery(): ProfileResponse | undefined {
  const { profile } = useServices();
  return useQuery(profile.cache, ROUTES.profile, () => profile.getProfile()).data;
}

export function usePlanQuery(): PlanResponse | undefined {
  const { plan } = useServices();
  return useQuery(plan.cache, ROUTES.plan, () => plan.getPlan()).data;
}

export function useScansQuery(): ScansResponse | undefined {
  const { scans } = useServices();
  return useQuery(scans.cache, ROUTES.scans, () => scans.getScans()).data;
}
