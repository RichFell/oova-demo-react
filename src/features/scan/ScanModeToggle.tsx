import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { ScanMode } from '@/hooks/useAppRouter';
import { colors, fonts, radii, spacing } from '@/theme/tokens';

const OPTIONS: { mode: ScanMode; label: string }[] = [
    { mode: 'guided', label: 'Guided' },
    { mode: 'manual', label: 'Manual' },
];

interface ScanModeToggleProps {
    mode: ScanMode;
    onChange: (mode: ScanMode) => void;
}

export const ScanModeToggle = ({ mode, onChange }: ScanModeToggleProps) => {
    return (
        <View accessibilityRole="radiogroup" style={styles.group}>
            {OPTIONS.map((option) => {
                const selected = option.mode === mode;
                return (
                    <Pressable
                        key={option.mode}
                        accessibilityRole="radio"
                        accessibilityState={{ selected, checked: selected }}
                        onPress={() => onChange(option.mode)}
                        style={[styles.option, selected && styles.optionSelected]}>
                        <AppText style={[styles.label, selected && styles.labelSelected]}>{option.label}</AppText>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    group: {
        flexDirection: 'row',
        gap: spacing.xs,
        padding: spacing.xs,
        borderRadius: radii.sm,
        backgroundColor: colors.inactive,
    },
    option: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderRadius: radii.sm - spacing.xs,
    },
    optionSelected: {
        backgroundColor: colors.surface,
    },
    label: {
        color: colors.muted,
        fontFamily: fonts.semiBold,
    },
    labelSelected: {
        color: colors.navy,
    },
});
