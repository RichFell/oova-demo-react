import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useAppRouter } from '../useAppRouter';


export const StartScanTile = () => {
    const { navigateToScan } = useAppRouter();
    return (
        <Pressable
            onPress={() => {
                navigateToScan();
            }}        >
            <View style={styles.container}>
                <Text>"Start Scan"</Text>
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