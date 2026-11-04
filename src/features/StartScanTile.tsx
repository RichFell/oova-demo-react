import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface StartScanTileProps {
    onPress?: () => void;
}

export const StartScanTile = ({ onPress }: StartScanTileProps) => {
    return (
        <Card tone="highlight">
            <Button label="Start today's scan" onPress={onPress} />
        </Card>
    );
};
