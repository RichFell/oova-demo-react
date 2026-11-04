import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="today">
                <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="flag" md="today" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}