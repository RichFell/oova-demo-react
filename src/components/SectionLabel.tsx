import { StyleSheet } from 'react-native';

import { AppText, type AppTextProps } from '@/components/AppText';
import { colors } from '@/theme/tokens';

export type SectionLabelProps = Omit<AppTextProps, 'variant'>;

export function SectionLabel({ style, ...props }: SectionLabelProps) {
  return <AppText {...props} variant="label" accessibilityRole="header" style={[styles.label, style]} />;
}

const styles = StyleSheet.create({
  label: {
    color: colors.muted,
  },
});
