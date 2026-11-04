import { useRouter, type Href } from 'expo-router';

export function useAppRouter() {
    const router = useRouter();

    const navigateToScan = () => {
        router.push('/StartScanTile' as Href);
    };

    return {
        navigateToScan,
    };
}