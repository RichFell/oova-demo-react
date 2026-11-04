import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

interface TabPlaceholderProps {
    title: string;
}

export const TabPlaceholder = ({ title }: TabPlaceholderProps) => {
    return (
        <Screen scroll={false}>
            <AppText variant="title" accessibilityRole="header">
                {title}
            </AppText>
        </Screen>
    );
};
