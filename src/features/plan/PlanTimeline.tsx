import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { StripToken } from '@/components/StripToken';
import type { TimelineDay } from '@/hooks/usePlanViewModel';
import { colors, radii, spacing } from '@/theme/tokens';

interface PlanTimelineProps {
    days: TimelineDay[];
    showPeriodLegend: boolean;
    onSelectDay: (date: string) => void;
}

export const PlanTimeline = ({ days, showPeriodLegend, onSelectDay }: PlanTimelineProps) => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
                {days.map((day) => (
                    <Pressable
                        key={day.date}
                        accessibilityRole="button"
                        accessibilityLabel={day.accessibilityLabel}
                        accessibilityState={{ selected: day.selected }}
                        onPress={() => onSelectDay(day.date)}
                        style={[styles.day, day.selected && styles.selectedDay]}>
                        <AppText style={styles.weekday}>{day.weekday}</AppText>
                        <AppText variant="heading" style={styles.dayOfMonth}>
                            {day.dayOfMonth}
                        </AppText>
                        <View style={styles.tokens}>
                            {day.strips.map((strip) => (
                                <StripToken key={strip} type={strip} />
                            ))}
                        </View>
                        <View style={[styles.marker, day.expectedPeriodDay && styles.periodMarker]} />
                    </Pressable>
                ))}
            </ScrollView>
            {showPeriodLegend && (
                <View style={styles.legend}>
                    <View style={[styles.marker, styles.periodMarker]} />
                    <AppText style={styles.legendText}>Expected period days</AppText>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    days: {
        gap: spacing.sm,
    },
    day: {
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: radii.sm,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedDay: {
        borderColor: colors.navy,
    },
    weekday: {
        color: colors.muted,
    },
    dayOfMonth: {
        color: colors.navy,
    },
    tokens: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    marker: {
        width: spacing.xxl,
        height: spacing.xs,
        borderRadius: radii.pill,
    },
    periodMarker: {
        backgroundColor: colors.pink,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    legendText: {
        color: colors.muted,
    },
});
