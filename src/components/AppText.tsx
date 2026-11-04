import { StyleSheet, Text, type TextProps } from 'react-native';

import { typography } from '@/theme/tokens';

export type TextVariant = keyof typeof typography;

// Each Outfit weight is its own font family, so drop `fontWeight` to keep
// Android from falling back to the system font.
function withoutWeight<T extends { fontWeight: string }>({ fontWeight: _, ...rest }: T) {
  return rest;
}

export const textStyles = StyleSheet.create({
  title: withoutWeight(typography.title),
  heading: withoutWeight(typography.heading),
  body: withoutWeight(typography.body),
  label: withoutWeight(typography.label),
  button: withoutWeight(typography.button),
});

// `allowFontScaling` is left out so Dynamic Type can't be turned off.
export type AppTextProps = Omit<TextProps, 'allowFontScaling'> & {
  variant?: TextVariant;
};

export function AppText({ variant = 'body', style, ...props }: AppTextProps) {
  return <Text {...props} allowFontScaling style={[textStyles[variant], style]} />;
}
