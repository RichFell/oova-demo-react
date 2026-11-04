import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edges } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/tokens';

export type ScreenProps = ViewProps & {
  scroll?: boolean;
  edges?: Edges;
};

export function Screen({ scroll = true, edges, style, children, ...props }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scroll ? (
        <ScrollView {...props} contentContainerStyle={[styles.content, style]}>
          {children}
        </ScrollView>
      ) : (
        <View {...props} style={[styles.content, styles.fill, style]}>
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
