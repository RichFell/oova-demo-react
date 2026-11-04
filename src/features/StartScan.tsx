import { Text, View, StyleSheet } from 'react-native';

export const StartScan = () => {
    return (
        <View style={styles.container}>
            <Text>Scan</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
