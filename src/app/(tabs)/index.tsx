import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StartScanTile } from '@/features/StartScanTile';
import { useAppRouter } from '@/hooks/useAppRouter';

export default function Today() {
    const { navigateToScan } = useAppRouter();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={scrollViewStyles.container}>
                <StartScanTile onPress={navigateToScan} />
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