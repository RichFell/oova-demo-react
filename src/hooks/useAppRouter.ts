import { useRouter } from 'expo-router';

export type ScanMode = 'guided' | 'manual';

/** Reads the `mode` route param. Anything other than Manual opens Guided. */
export function parseScanMode(mode: string | string[] | undefined): ScanMode {
    return mode === 'manual' ? 'manual' : 'guided';
}

export function useAppRouter() {
    const router = useRouter();

    // Scan setup opens on Guided by default.
    const navigateToScan = (mode: ScanMode = 'guided') => {
        if (mode === 'manual') {
            router.push({ pathname: '/scan', params: { mode } });
        } else {
            router.push('/scan');
        }
    };

    const navigateToTimer = () => {
        router.push('/timer');
    };

    return {
        navigateToScan,
        navigateToTimer,
    };
}
