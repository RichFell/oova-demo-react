import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors } from '@/theme/tokens';

// The minimum touch target for accessibility, not a design token.
const MIN_TOUCH_TARGET = 44;

export type BackButtonProps = Pick<PressableProps, 'onPress'>;

// Icon only. The label is announced but never shown.
export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back_ios_new', web: 'arrow_back_ios_new' }}
        tintColor={colors.navy}
        size={24}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
