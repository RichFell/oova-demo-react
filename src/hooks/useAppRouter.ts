import { useRouter } from 'expo-router';

export function useAppRouter() {
    const router = useRouter();

    const navigateToScan = () => {
        router.push('/scan');
    };

    return {
        navigateToScan,
    };
}