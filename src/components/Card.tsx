import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, spacing } from '@/theme/tokens';

export type CardTone = 'surface' | 'highlight';

export type CardProps = ViewProps & {
  tone?: CardTone;
};

export function Card({ tone = 'surface', style, ...props }: CardProps) {
  return <View {...props} style={[styles.base, styles[tone], style]} />;
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.xl,
    borderRadius: radii.md,
    gap: spacing.lg,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  highlight: {
    backgroundColor: colors.chartreuse,
  },
});
