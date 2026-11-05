import type { ReactElement } from 'react';

import { Button, type ButtonProps } from '@/components/Button';
import { ManualScanSetup } from '@/features/scan/ManualScanSetup';

type Element = ReactElement<{ children?: unknown }>;

describe('ManualScanSetup', () => {
  it('opens the timer from the sample button', () => {
    const onSampleTaken = jest.fn();
    const root = ManualScanSetup({ stripsTitle: 'E3G + LH | PdG', strips: ['LH | PdG', 'E3G'], onSampleTaken }) as Element;
    const button = (root.props.children as Element[]).find((child) => child.type === Button) as ReactElement<ButtonProps>;

    expect(button.props.label).toBe("I've taken my sample");
    button.props.onPress?.({} as never);
    expect(onSampleTaken).toHaveBeenCalled();
  });
});
