import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StartScanTile } from '../features/StartScanTile';

export const Today = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={scrollViewStyles.container}>
                <StartScanTile/>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const scrollViewStyles = StyleSheet.create({
    container: {
        padding: 12,
    },
});