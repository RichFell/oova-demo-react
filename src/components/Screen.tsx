import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewProps } from 'react-native';
import { SafeAreaView, type Edges } from 'react-native-safe-area-context';

import { ConceptBadge } from '@/components/ConceptBadge';
import { colors, spacing } from '@/theme/tokens';

export type ScreenProps = ViewProps & {
  scroll?: boolean;
  edges?: Edges;
  contentInsetAdjustmentBehavior?: ScrollViewProps['contentInsetAdjustmentBehavior'];
};

// Every screen carries the concept badge so the demo stays labeled as unofficial.
export function Screen({
  scroll = true,
  edges,
  contentInsetAdjustmentBehavior,
  style,
  children,
  ...props
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          {...props}
          contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
          contentContainerStyle={[styles.content, style]}>
          <ConceptBadge />
          {children}
        </ScrollView>
      ) : (
        <View {...props} style={[styles.content, styles.fill, style]}>
          <ConceptBadge />
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  fill: {
    flex: 1,
  },
});
