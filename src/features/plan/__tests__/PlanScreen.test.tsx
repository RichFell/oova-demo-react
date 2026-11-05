import { isValidElement, type ReactElement, type ReactNode } from 'react';

import { BackButton, type BackButtonProps } from '@/components/BackButton';
import { PlanScreen } from '@/features/plan/PlanScreen';
import type { ScanMode } from '@/hooks/useAppRouter';

const mockNavigateBack = jest.fn();
let mockMode: ScanMode = 'guided';

jest.mock('@/hooks/useAppRouter', () => ({
  useAppRouter: () => ({ navigateToTimer: jest.fn(), navigateBack: mockNavigateBack }),
}));
jest.mock('@/hooks/usePlanViewModel', () => ({
  usePlanViewModel: () => ({ title: 'Title', subtitle: 'Subtitle', days: [], showPeriodLegend: false, details: {}, selectDay: jest.fn() }),
}));
jest.mock('@/hooks/usePlanAnswersViewModel', () => ({
  usePlanAnswersViewModel: () => ({ strips: [] }),
}));
jest.mock('@/hooks/useScanSetupViewModel', () => ({
  ...jest.requireActual('@/hooks/useScanSetupViewModel'),
  useScanSetupViewModel: () => ({ mode: mockMode, setMode: jest.fn(), manual: {} }),
}));

// Walks the returned tree without rendering it, so child components never run.
function findBackButton(node: ReactNode): ReactElement<BackButtonProps> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findBackButton(child);
      if (found) return found;
    }
    return undefined;
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) return undefined;
  if (node.type === BackButton) return node as ReactElement<BackButtonProps>;
  return findBackButton(node.props.children);
}

describe('PlanScreen', () => {
  beforeEach(() => mockNavigateBack.mockClear());

  it.each<ScanMode>(['guided', 'manual'])('goes back when the chevron is pressed in %s', (mode) => {
    mockMode = mode;
    const backButton = findBackButton(PlanScreen({ initialMode: mode }));
    expect(backButton).toBeDefined();
    backButton?.props.onPress?.({} as never);
    expect(mockNavigateBack).toHaveBeenCalledTimes(1);
  });
});
