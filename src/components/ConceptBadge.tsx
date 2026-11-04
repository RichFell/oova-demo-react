import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme/tokens';

export type ConceptBadgeProps = Omit<ViewProps, 'children'>;

export function ConceptBadge({ style, ...props }: ConceptBadgeProps) {
  return (
    <View {...props} style={[styles.base, style]}>
      <AppText variant="label" style={styles.text}>
        Concept
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  // The concept screens show the badge in sentence case.
  text: {
    color: colors.muted,
    textTransform: 'none',
  },
});
