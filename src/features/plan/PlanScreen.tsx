import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { PlanAnswersCard } from '@/features/plan/PlanAnswersCard';
import { PlanDayDetailsCard } from '@/features/plan/PlanDayDetailsCard';
import { PlanStripsCard } from '@/features/plan/PlanStripsCard';
import { PlanTimeline } from '@/features/plan/PlanTimeline';
import { usePlanAnswersViewModel } from '@/hooks/usePlanAnswersViewModel';
import { usePlanViewModel } from '@/hooks/usePlanViewModel';
import { colors, radii, spacing } from '@/theme/tokens';

// The schedule comes before any explanatory text.
export const PlanScreen = () => {
    const { title, subtitle, days, showPeriodLegend, details, selectDay } = usePlanViewModel();
    const answers = usePlanAnswersViewModel();

    return (
        <Screen>
            <View style={styles.header}>
                <AppText variant="title" accessibilityRole="header" style={styles.title}>
                    {title}
                </AppText>
                <AppText style={styles.subtitle}>{subtitle}</AppText>
            </View>
            <PlanTimeline days={days} showPeriodLegend={showPeriodLegend} onSelectDay={selectDay} />
            <PlanDayDetailsCard {...details} />
            <PlanAnswersCard {...answers} />
            <PlanStripsCard strips={answers.strips} />
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
