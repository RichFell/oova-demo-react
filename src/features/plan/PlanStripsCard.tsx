import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { SectionLabel } from '@/components/SectionLabel';
import { StripToken } from '@/components/StripToken';
import type { PlanAnswersViewModel } from '@/hooks/usePlanAnswersViewModel';
import { colors, fonts, radii, spacing, typography } from '@/theme/tokens';

export const PlanStripsCard = ({ strips }: Pick<PlanAnswersViewModel, 'strips'>) => {
    return (
        <Card>
            <SectionLabel>Strips needed</SectionLabel>
            <View style={styles.tiles}>
                {strips.map((strip) => (
                    <View key={strip.type} accessible accessibilityLabel={`${strip.type}: ${strip.count}`} style={styles.tile}>
                        <View style={styles.name}>
                            <StripToken type={strip.type} />
                            <AppText style={styles.type}>{strip.type}</AppText>
                        </View>
                        <AppText style={styles.count}>{strip.count}</AppText>
                    </View>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    tiles: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    tile: {
        flex: 1,
        gap: spacing.xs,
        padding: spacing.lg,
        borderRadius: radii.sm,
        borderWidth: 1.5,
        borderColor: colors.line,
    },
    name: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    type: {
        color: colors.navy,
        fontWeight: typography.heading.fontWeight,
        fontFamily: fonts.semiBold,
    },
    count: {
        color: colors.body,
    },
});
