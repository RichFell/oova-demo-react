import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { StripToken } from '@/components/StripToken';
import type { UpcomingDay } from '@/hooks/useTodayViewModel';
import { colors, spacing } from '@/theme/tokens';

interface NextFiveDaysCardProps {
    days: UpcomingDay[];
    onViewPlan: () => void;
}

export const NextFiveDaysCard = ({ days, onViewPlan }: NextFiveDaysCardProps) => {
    return (
        <Card>
            <View style={styles.header}>
                <AppText variant="heading" accessibilityRole="header" style={styles.heading}>
                    Next five days
                </AppText>
                <Pressable accessibilityRole="link" accessibilityLabel="View plan" hitSlop={spacing.md} onPress={onViewPlan}>
                    <AppText variant="label" style={styles.link}>
                        View plan
                    </AppText>
                </Pressable>
            </View>
            <View style={styles.days}>
                {days.map((day) => (
                    <View
                        key={day.date}
                        accessible
                        accessibilityLabel={`${day.label}: ${day.strips.join(', ')}`}
                        style={styles.day}>
                        <View style={styles.tokens}>
                            {day.strips.map((strip) => (
                                <StripToken key={strip} type={strip} />
                            ))}
                        </View>
                        <AppText style={styles.dayLabel}>{day.label}</AppText>
                    </View>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heading: {
        color: colors.navy,
    },
    link: {
        color: colors.muted,
    },
    days: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    day: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    tokens: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    dayLabel: {
        color: colors.muted,
    },
});
