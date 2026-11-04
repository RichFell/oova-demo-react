import { useRouter } from 'expo-router';

export type ScanSetupMode = 'guided' | 'manual';

export function useAppRouter() {
    const router = useRouter();

    // Scan setup reads `mode` to pick its Guided or Manual view.
    const navigateToScan = (mode: ScanSetupMode) => {
        router.push({ pathname: '/scan', params: { mode } });
    };

    return {
        navigateToScan,
    };
}