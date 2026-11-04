import { NativeTabs } from 'expo-router/native-tabs';

// The concept screens show text-only tabs.
export default function TabsLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="journal">
                <NativeTabs.Trigger.Label>Journal</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="calendar">
                <NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="insights">
                <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="more">
                <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
