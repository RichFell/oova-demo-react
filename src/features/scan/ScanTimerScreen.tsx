import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { StepProgress } from '@/features/scan/StepProgress';
import { SCAN_STEP_COUNT } from '@/hooks/useScanSetupViewModel';
import { colors, radii, spacing } from '@/theme/tokens';

// Destination for the Manual sample button. The countdown comes in a later ticket.
export const ScanTimerScreen = () => {
    return (
        <Screen>
            <View style={styles.header}>
                <StepProgress total={SCAN_STEP_COUNT} completed={2} />
                <AppText variant="title" accessibilityRole="header" style={styles.title}>
                    Your strips are developing
                </AppText>
            </View>
            <AppText style={styles.body}>{"You can leave this screen. We'll remind you when it's ready."}</AppText>
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
    body: {
        color: colors.body,
        textAlign: 'center',
    },
});
