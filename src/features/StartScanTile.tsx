import { Text, View, StyleSheet, Pressable } from 'react-native';

import { colors, radii, spacing } from '@/theme/tokens';

interface StartScanTileProps {
    onPress?: () => void;
}

export const StartScanTile = ({ onPress }: StartScanTileProps) => {
    return (
        <Pressable onPress={onPress}>
            <View style={styles.container}>
                <Text>&quot;Start Scan&quot;</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        backgroundColor: colors.inactive,
        borderRadius: radii.sm,
    },
});