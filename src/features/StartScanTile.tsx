import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, spacing } from '@/theme/tokens';

interface StartScanTileProps {
    eyebrow: string;
    title: string;
    body: string;
    onPress?: () => void;
}

export const StartScanTile = ({ eyebrow, title, body, onPress }: StartScanTileProps) => {
    return (
        <Card tone="highlight">
            <View style={styles.text}>
                <AppText variant="label" style={styles.eyebrow}>
                    {eyebrow}
                </AppText>
                <AppText variant="title" accessibilityRole="header" style={styles.title}>
                    {title}
                </AppText>
                <AppText style={styles.body}>{body}</AppText>
            </View>
            <Button label="Start today's scan" onPress={onPress} />
        </Card>
    );
};

const styles = StyleSheet.create({
    text: {
        gap: spacing.sm,
    },
    eyebrow: {
        color: colors.muted,
    },
    title: {
        color: colors.navy,
    },
    body: {
        color: colors.body,
    },
});
