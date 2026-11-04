import { StyleSheet, type PressableProps, type PressableStateCallbackType } from 'react-native';

import { Button, type ButtonVariant } from '@/components/Button';
import { colors } from '@/theme/tokens';

const variants: ButtonVariant[] = ['primary', 'secondary', 'gradient'];

function propsOf(element: ReturnType<typeof Button>) {
  return element.props as PressableProps;
}

function styleOf(element: ReturnType<typeof Button>, pressed = false) {
  const style = propsOf(element).style as (state: PressableStateCallbackType) => unknown;
  return StyleSheet.flatten(style({ pressed }) as never);
}

describe('Button', () => {
  it('exposes a button role and uses its label for accessibility', () => {
    const props = propsOf(Button({ label: 'Go' }));
    expect(props.accessibilityRole).toBe('button');
    expect(props.accessibilityLabel).toBe('Go');
    expect(props.accessibilityState).toEqual({ disabled: false });
  });

  it('calls onPress when enabled', () => {
    const onPress = jest.fn();
    propsOf(Button({ label: 'Go', onPress })).onPress?.({} as never);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each(variants)('%s ignores presses and reports disabled when disabled', (variant) => {
    const onPress = jest.fn();
    const props = propsOf(Button({ label: 'Go', variant, disabled: true, onPress }));

    expect(props.disabled).toBe(true);
    expect(props.accessibilityState).toEqual({ disabled: true });
    expect(props.onPress).toBeUndefined();
    expect(onPress).not.toHaveBeenCalled();
  });

  it.each(variants)('%s switches to the inactive style when disabled', (variant) => {
    const style = styleOf(Button({ label: 'Go', variant, disabled: true }), true);
    expect(style).toMatchObject({ backgroundColor: colors.inactive });
    expect(style).not.toHaveProperty('backgroundImage');
    expect(style).not.toHaveProperty('opacity');
  });

  it('styles each enabled variant differently', () => {
    expect(styleOf(Button({ label: 'Go', variant: 'primary' }))).toMatchObject({
      backgroundColor: colors.navy,
    });
    expect(styleOf(Button({ label: 'Go', variant: 'secondary' }))).toMatchObject({
      borderColor: colors.navy,
    });
    expect(styleOf(Button({ label: 'Go', variant: 'gradient' }))).toHaveProperty('backgroundImage');
  });
});
