import type { ReactElement } from 'react';
import { StyleSheet, type PressableProps, type PressableStateCallbackType } from 'react-native';

import { BackButton } from '@/components/BackButton';

function pressable(onPress = jest.fn()) {
  return BackButton({ onPress }) as ReactElement<PressableProps>;
}

describe('BackButton', () => {
  it('is a button announced as Back', () => {
    const { props } = pressable();
    expect(props.accessibilityRole).toBe('button');
    expect(props.accessibilityLabel).toBe('Back');
  });

  it('has a touch target of at least 44 pt', () => {
    const style = pressable().props.style as (state: PressableStateCallbackType) => unknown;
    const flat = StyleSheet.flatten(style({ pressed: false }) as never);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  it('reports the press', () => {
    const onPress = jest.fn();
    pressable(onPress).props.onPress?.({} as never);
    expect(onPress).toHaveBeenCalled();
  });
});
