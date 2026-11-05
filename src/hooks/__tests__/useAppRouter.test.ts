import { parseScanMode, useAppRouter } from '@/hooks/useAppRouter';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('useAppRouter', () => {
  beforeEach(() => mockPush.mockClear());

  it('opens scan setup', () => {
    useAppRouter().navigateToScan();
    expect(mockPush).toHaveBeenCalledWith('/scan');
  });

  it('opens scan setup on Manual', () => {
    useAppRouter().navigateToScan('manual');
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/scan', params: { mode: 'manual' } });
  });

  it('opens the timer', () => {
    useAppRouter().navigateToTimer();
    expect(mockPush).toHaveBeenCalledWith('/timer');
  });
});

describe('parseScanMode', () => {
  it('opens Manual only when asked and Guided otherwise', () => {
    expect(parseScanMode('manual')).toBe('manual');
    expect(parseScanMode('guided')).toBe('guided');
    expect(parseScanMode(undefined)).toBe('guided');
    expect(parseScanMode(['manual'])).toBe('guided');
  });
});
