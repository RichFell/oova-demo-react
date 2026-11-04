import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Pill } from '@/components/Pill';
import { SectionLabel } from '@/components/SectionLabel';
import { colors, radii, spacing } from '@/theme/tokens';

interface ChartLockCardProps {
    required: number;
    completed: number;
    remainingLabel: string;
}

export const ChartLockCard = ({ required, completed, remainingLabel }: ChartLockCardProps) => {
    const steps = Array.from({ length: required }, (_, index) => index + 1);
    return (
        <Card>
            <View style={styles.header}>
                <SectionLabel>Your hormone trends</SectionLabel>
                <Pill label={remainingLabel} />
            </View>
            <View style={styles.lock}>
                <View style={styles.steps}>
                    {steps.map((step) => (
                        <View
                            key={step}
                            accessibilityElementsHidden
                            importantForAccessibility="no-hide-descendants"
                            style={[styles.step, step <= completed && styles.stepDone]}>
                            <AppText style={styles.stepText}>{step}</AppText>
                        </View>
                    ))}
                </View>
                <AppText style={styles.body}>Your chart unlocks after three scans.</AppText>
            </View>
        </Card>
    );
};

const STEP_SIZE = spacing.xxl + spacing.sm;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lock: {
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: radii.sm,
    },
    steps: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    step: {
        width: STEP_SIZE,
        height: STEP_SIZE,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.navy,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDone: {
        backgroundColor: colors.mintStrong,
    },
    stepText: {
        color: colors.navy,
    },
    body: {
        color: colors.body,
        textAlign: 'center',
    },
});
