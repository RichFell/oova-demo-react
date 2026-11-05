import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import type { PlanDayDetails } from '@/hooks/usePlanViewModel';
import { colors, spacing } from '@/theme/tokens';

export const PlanDayDetailsCard = ({ eyebrow, title, body }: PlanDayDetails) => {
    return (
        // Announce the new day when the selection changes.
        <Card accessibilityLiveRegion="polite">
            <View style={styles.text}>
                <AppText variant="label" style={styles.eyebrow}>
                    {eyebrow}
                </AppText>
                <AppText variant="heading" accessibilityRole="header" style={styles.title}>
                    {title}
                </AppText>
                <AppText style={styles.body}>{body}</AppText>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    text: {
        gap: spacing.sm,
    },
    eyebrow: {
        color: colors.muted,
    },
    title: {
        color: colors.navy,
    },
    body: {
        color: colors.body,
    },
});
