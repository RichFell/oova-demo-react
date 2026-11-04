import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, gradients, radii, sizes, spacing } from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'gradient';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
};

// Pressable has no hooks of its own here, so tests can call `Button` directly.
export function Button({
  label,
  variant = 'primary',
  disabled,
  onPress,
  accessibilityLabel,
  accessibilityState,
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? false;
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        isDisabled ? styles.disabled : styles[variant],
        pressed && !isDisabled && styles.pressed,
      ]}>
      <AppText
        variant="button"
        style={isDisabled ? styles.disabledText : variant === 'primary' ? styles.lightText : styles.darkText}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.button,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.navy,
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  gradient: {
    backgroundImage: [
      {
        type: 'linear-gradient',
        direction: 'to right',
        colorStops: gradients.commitment.map((color) => ({ color })),
      },
    ],
  },
  disabled: {
    backgroundColor: colors.inactive,
  },
  pressed: {
    opacity: 0.85,
  },
  lightText: {
    color: colors.surface,
  },
  darkText: {
    color: colors.navy,
  },
  disabledText: {
    color: colors.muted,
  },
});
