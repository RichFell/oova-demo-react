import { useLocalSearchParams } from 'expo-router';

import { PlanScreen } from '@/features/plan/PlanScreen';
import { parseScanMode } from '@/hooks/useAppRouter';

// Scan setup opens on Guided, which shows the plan timeline, unless the link asks for Manual.
export default function ScanScreen() {
    const { mode } = useLocalSearchParams<{ mode?: string }>();
    return <PlanScreen initialMode={parseScanMode(mode)} />;
}
