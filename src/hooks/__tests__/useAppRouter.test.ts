import { parseScanMode, useAppRouter } from '@/hooks/useAppRouter';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack, replace: mockReplace, canGoBack: mockCanGoBack }),
}));

describe('useAppRouter', () => {
  beforeEach(() => jest.clearAllMocks());

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

  it('returns to the previous screen', () => {
    mockCanGoBack.mockReturnValue(true);
    useAppRouter().navigateBack();
    expect(mockBack).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('opens Today when there is no previous screen', () => {
    mockCanGoBack.mockReturnValue(false);
    useAppRouter().navigateBack();
    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
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
