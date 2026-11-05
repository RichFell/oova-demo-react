import type { ReactElement } from 'react';
import type { PressableProps } from 'react-native';

import { ScanModeToggle } from '@/features/scan/ScanModeToggle';

type Element = ReactElement<{ children?: unknown }>;

function options(mode: 'guided' | 'manual', onChange = jest.fn()) {
  const root = ScanModeToggle({ mode, onChange }) as Element;
  return root.props.children as ReactElement<PressableProps>[];
}

describe('ScanModeToggle', () => {
  it('marks the current mode as selected', () => {
    expect(options('guided').map((option) => option.props.accessibilityState?.selected)).toEqual([true, false]);
    expect(options('manual').map((option) => option.props.accessibilityState?.selected)).toEqual([false, true]);
  });

  it('reports the pressed mode', () => {
    const onChange = jest.fn();
    options('guided', onChange)[1].props.onPress?.({} as never);
    expect(onChange).toHaveBeenCalledWith('manual');
  });
});
