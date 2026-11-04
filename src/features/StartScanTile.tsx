import { Text, View, StyleSheet, Pressable } from 'react-native';

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
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
});