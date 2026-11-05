import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme/tokens';

interface StepProgressProps {
    total: number;
    completed: number;
}

export const StepProgress = ({ total, completed }: StepProgressProps) => {
    const steps = Array.from({ length: total }, (_, index) => index + 1);

    return (
        <View
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: total, now: completed }}
            style={styles.bars}>
            {steps.map((step) => (
                <View key={step} style={[styles.bar, step <= completed && styles.barDone]} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    bars: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    bar: {
        width: spacing.xxl + spacing.md,
        height: spacing.xs,
        borderRadius: radii.pill,
        backgroundColor: colors.surface,
    },
    barDone: {
        backgroundColor: colors.navy,
    },
});
