import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { PlanAnswersCard } from '@/features/plan/PlanAnswersCard';
import { PlanDayDetailsCard } from '@/features/plan/PlanDayDetailsCard';
import { PlanStripsCard } from '@/features/plan/PlanStripsCard';
import { PlanTimeline } from '@/features/plan/PlanTimeline';
import { ManualScanSetup } from '@/features/scan/ManualScanSetup';
import { ScanModeToggle } from '@/features/scan/ScanModeToggle';
import { StepProgress } from '@/features/scan/StepProgress';
import { useAppRouter, type ScanMode } from '@/hooks/useAppRouter';
import { usePlanAnswersViewModel } from '@/hooks/usePlanAnswersViewModel';
import { usePlanViewModel } from '@/hooks/usePlanViewModel';
import { SCAN_STEP_COUNT, buildScanSetupHeader, useScanSetupViewModel } from '@/hooks/useScanSetupViewModel';
import { colors, radii, spacing } from '@/theme/tokens';

interface PlanScreenProps {
    initialMode?: ScanMode;
}

// Scan setup. In Guided, the schedule comes before any explanatory text.
export const PlanScreen = ({ initialMode = 'guided' }: PlanScreenProps) => {
    const { title, subtitle, days, showPeriodLegend, details, selectDay } = usePlanViewModel();
    const answers = usePlanAnswersViewModel();
    const { mode, setMode, manual } = useScanSetupViewModel(initialMode);
    const { navigateToTimer } = useAppRouter();
    const header = buildScanSetupHeader(mode, { title, subtitle });

    return (
        // On iOS the native header sits over the content, so iOS insets the scroll view for it and the home indicator.
        // Android has no header here, so the top edge keeps content below the status bar.
        <Screen edges={Platform.OS === 'ios' ? ['left', 'right'] : ['top', 'left', 'right']} contentInsetAdjustmentBehavior="automatic">
            <View style={styles.header}>
                <StepProgress total={SCAN_STEP_COUNT} completed={header.completedSteps} />
                <AppText variant="title" accessibilityRole="header" style={styles.title}>
                    {header.title}
                </AppText>
                {header.subtitle && <AppText style={styles.subtitle}>{header.subtitle}</AppText>}
            </View>
            <ScanModeToggle mode={mode} onChange={setMode} />
            {mode === 'guided' ? (
                <>
                    <PlanTimeline days={days} showPeriodLegend={showPeriodLegend} onSelectDay={selectDay} />
                    <PlanDayDetailsCard {...details} />
                    <PlanAnswersCard {...answers} />
                    <PlanStripsCard strips={answers.strips} />
                </>
            ) : (
                <ManualScanSetup {...manual} onSampleTaken={navigateToTimer} />
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.md,
        backgroundColor: colors.mint,
    },
    title: {
        color: colors.navy,
        textAlign: 'center',
    },
    subtitle: {
        color: colors.body,
        textAlign: 'center',
    },
});
