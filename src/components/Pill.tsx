import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

export type PillTone = 'accent' | 'surface';

export type PillProps = Omit<ViewProps, 'children'> & {
  label: string;
  tone?: PillTone;
};

export function Pill({ label, tone = 'accent', style, ...props }: PillProps) {
  return (
    <View {...props} style={[styles.base, styles[tone], style]}>
      <AppText variant="label" style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  accent: {
    backgroundColor: colors.pink,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  text: {
    color: colors.navy,
  },
});
