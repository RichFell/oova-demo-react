import { useRouter } from 'expo-router';

export function useAppRouter() {
    const router = useRouter();

    // Scan setup opens on Guided by default.
    const navigateToScan = () => {
        router.push('/scan');
    };

    return {
        navigateToScan,
    };
}