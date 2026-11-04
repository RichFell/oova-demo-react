import { ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StartScanTile } from '@/features/StartScanTile';
import { ChartLockCard } from '@/features/today/ChartLockCard';
import { NextFiveDaysCard } from '@/features/today/NextFiveDaysCard';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useTodayViewModel } from '@/hooks/useTodayViewModel';
import { spacing } from '@/theme/tokens';

// The bottom action sits outside the scroll view so it stays above the tab bar on short screens.
export const TodayScreen = () => {
    const { navigateToScan } = useAppRouter();
    const { heroEyebrow, heroTitle, heroBody, upcomingDays, chart } = useTodayViewModel();

    return (
        <Screen scroll={false}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <StartScanTile
                    eyebrow={heroEyebrow}
                    title={heroTitle}
                    body={heroBody}
                    onPress={() => navigateToScan('manual')}
                />
                <NextFiveDaysCard days={upcomingDays} onViewPlan={() => navigateToScan('guided')} />
                {chart.locked && (
                    <ChartLockCard
                        required={chart.required}
                        completed={chart.completed}
                        remainingLabel={chart.remainingLabel}
                    />
                )}
            </ScrollView>
            {/* Symptom logging is out of scope for this ticket, so the action is shown disabled. */}
            <Button label="Log symptoms" variant="secondary" disabled />
        </Screen>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        gap: spacing.lg,
    },
});
