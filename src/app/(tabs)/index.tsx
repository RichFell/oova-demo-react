import { Screen } from '@/components/Screen';
import { StartScanTile } from '@/features/StartScanTile';
import { useAppRouter } from '@/hooks/useAppRouter';

export default function Today() {
    const { navigateToScan } = useAppRouter();
    return (
        <Screen>
            <StartScanTile onPress={navigateToScan} />
        </Screen>
    );
}
