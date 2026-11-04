import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, spacing } from '@/theme/tokens';

// Kits have one strip for E3G and one shared strip for LH and PdG.
export type StripType = 'E3G' | 'LH | PdG';

export type StripTokenProps = Omit<ViewProps, 'children'> & {
  type: StripType;
};

export function StripToken({ type, style, ...props }: StripTokenProps) {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={type}
      {...props}
      style={[styles.token, type === 'E3G' && styles.e3g, style]}>
      {type === 'LH | PdG' && (
        <>
          <View style={[styles.half, styles.lh]} />
          <View style={[styles.half, styles.pdg]} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.navy,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  e3g: {
    backgroundColor: colors.hormone.e3g,
  },
  half: {
    flex: 1,
  },
  lh: {
    backgroundColor: colors.hormone.lh,
  },
  pdg: {
    backgroundColor: colors.hormone.pdg,
  },
});
