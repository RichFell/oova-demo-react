import { Fragment } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { SectionLabel } from '@/components/SectionLabel';
import type { AnswerStepper, PlanAnswersViewModel } from '@/hooks/usePlanAnswersViewModel';
import { colors, fonts, radii, spacing, typography } from '@/theme/tokens';

export interface PlanAnswersCardProps extends PlanAnswersViewModel {
    toggleEditing: () => void;
    decreaseLastPeriod: () => void;
    increaseLastPeriod: () => void;
    decreaseBleeding: () => void;
    increaseBleeding: () => void;
}

interface StepButtonProps {
    glyph: '−' | '+';
    accessibilityLabel: string;
    disabled: boolean;
    onPress: () => void;
}

const StepButton = ({ glyph, accessibilityLabel, disabled, onPress }: StepButtonProps) => (
    <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        hitSlop={spacing.xs}
        style={({ pressed }) => [styles.step, disabled && styles.stepDisabled, pressed && styles.pressed]}>
        <AppText variant="heading" style={disabled ? styles.stepGlyphDisabled : styles.stepGlyph}>
            {glyph}
        </AppText>
    </Pressable>
);

interface AnswerRow {
    label: string;
    value: string;
    stepper?: AnswerStepper & { decrease: () => void; increase: () => void };
}

export const PlanAnswersCard = ({
    editing,
    actionLabel,
    healthJourney,
    regularCycles,
    lastPeriodStarted,
    typicalBleeding,
    lastPeriodStepper,
    bleedingStepper,
    toggleEditing,
    decreaseLastPeriod,
    increaseLastPeriod,
    decreaseBleeding,
    increaseBleeding,
}: PlanAnswersCardProps) => {
    const rows: AnswerRow[] = [
        { label: 'Health journey', value: healthJourney },
        { label: 'Regular cycles', value: regularCycles },
        {
            label: 'Last period started',
            value: lastPeriodStarted,
            stepper: { ...lastPeriodStepper, decrease: decreaseLastPeriod, increase: increaseLastPeriod },
        },
        {
            label: 'Typical bleeding',
            value: typicalBleeding,
            stepper: { ...bleedingStepper, decrease: decreaseBleeding, increase: increaseBleeding },
        },
    ];

    return (
        <Card>
            <View style={styles.header}>
                <SectionLabel style={styles.headerLabel}>Based on your answers</SectionLabel>
                {/* Small secondary action; the shared Button is sized for primary actions. */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={actionLabel}
                    onPress={toggleEditing}
                    style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
                    <AppText variant="button" style={styles.actionText}>
                        {actionLabel}
                    </AppText>
                </Pressable>
            </View>
            <View>
                {rows.map((row, index) => (
                    <Fragment key={row.label}>
                        {index > 0 && <View style={styles.divider} />}
                        <View style={styles.row}>
                            <AppText style={styles.label}>{row.label}</AppText>
                            {editing && row.stepper ? (
                                <View style={styles.stepper}>
                                    <StepButton
                                        glyph="−"
                                        accessibilityLabel={`Decrease ${row.label}`}
                                        disabled={!row.stepper.canDecrease}
                                        onPress={row.stepper.decrease}
                                    />
                                    <AppText
                                        accessibilityLiveRegion="polite"
                                        style={[styles.value, styles.stepperValue]}>
                                        {row.value}
                                    </AppText>
                                    <StepButton
                                        glyph="+"
                                        accessibilityLabel={`Increase ${row.label}`}
                                        disabled={!row.stepper.canIncrease}
                                        onPress={row.stepper.increase}
                                    />
                                </View>
                            ) : (
                                <AppText style={styles.value}>{row.value}</AppText>
                            )}
                        </View>
                    </Fragment>
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
        gap: spacing.md,
    },
    headerLabel: {
        flexShrink: 1,
    },
    action: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.pill,
        borderWidth: 1.5,
        borderColor: colors.navy,
    },
    actionText: {
        color: colors.navy,
    },
    pressed: {
        opacity: 0.85,
    },
    divider: {
        height: 1,
        backgroundColor: colors.line,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        paddingVertical: spacing.md,
    },
    label: {
        flexShrink: 1,
        color: colors.body,
    },
    value: {
        flexShrink: 1,
        textAlign: 'right',
        color: colors.navy,
        fontWeight: typography.heading.fontWeight,
        fontFamily: fonts.semiBold,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    stepperValue: {
        // Keeps the buttons still as the value's width changes.
        minWidth: spacing.xxl * 2,
        textAlign: 'center',
    },
    step: {
        width: spacing.xxl,
        height: spacing.xxl,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.navy,
    },
    stepDisabled: {
        backgroundColor: colors.inactive,
    },
    stepGlyph: {
        color: colors.surface,
    },
    stepGlyphDisabled: {
        color: colors.muted,
    },
});
