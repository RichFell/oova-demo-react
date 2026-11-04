import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildPlan } from '@/data/plan';
import { samplePlanInput } from '@/data/sample';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const plan = buildPlan(samplePlanInput);

const screens = [
  'Today',
  'Interactive plan',
  'Guided test',
  'Progress and first result',
  'Clinician report',
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Unofficial concept · Sample data</Text>
        <Text style={styles.title}>First scan cycle demo</Text>
        <Text style={styles.body}>
          {`${plan.days.length}-day plan · ${plan.stripCounts['lh-pdg']} LH | PdG strips · ${plan.stripCounts.e3g} E3G strips`}
        </Text>

        <View style={styles.card}>
          {screens.map((screen, index) => (
            <Text key={screen} style={styles.body}>
              {`${index + 1}. ${screen}`}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.muted,
  },
  title: {
    ...typography.title,
    color: colors.navy,
  },
  body: {
    ...typography.body,
    color: colors.body,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
});
