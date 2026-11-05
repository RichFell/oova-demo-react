import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SectionLabel } from '@/components/SectionLabel';
import { StripToken } from '@/components/StripToken';
import type { ManualScanSetup as ManualScanSetupModel } from '@/hooks/useScanSetupViewModel';
import { colors, spacing } from '@/theme/tokens';

type ManualScanSetupProps = ManualScanSetupModel & {
    onSampleTaken: () => void;
};

export const ManualScanSetup = ({ stripsTitle, strips, onSampleTaken }: ManualScanSetupProps) => {
    return (
        <>
            <Card style={styles.card}>
                <SectionLabel>{"Today's strips"}</SectionLabel>
                <View style={styles.titleRow}>
                    <AppText variant="heading" style={styles.title}>
                        {stripsTitle}
                    </AppText>
                    <View style={styles.tokens}>
                        {strips.map((strip) => (
                            <StripToken key={strip} type={strip} />
                        ))}
                    </View>
                </View>
                <AppText style={styles.body}>Your plan uses both strip types today.</AppText>
            </Card>
            <Card style={[styles.card, styles.guidance]}>
                <AppText variant="heading" accessibilityRole="header" style={styles.title}>
                    Same time each day
                </AppText>
                <AppText style={styles.body}>
                    Scanning at a consistent time helps keep your results comparable.
                </AppText>
            </Card>
            <Button label="I've taken my sample" onPress={onSampleTaken} />
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        gap: spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    tokens: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    title: {
        flexShrink: 1,
        color: colors.navy,
    },
    body: {
        color: colors.body,
    },
    guidance: {
        backgroundColor: colors.mint,
    },
});
