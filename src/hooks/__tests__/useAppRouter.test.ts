import { useAppRouter } from '@/hooks/useAppRouter';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('useAppRouter', () => {
  beforeEach(() => mockPush.mockClear());

  it('opens scan setup on Manual', () => {
    useAppRouter().navigateToScan('manual');
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/scan', params: { mode: 'manual' } });
  });

  it('opens scan setup on Guided', () => {
    useAppRouter().navigateToScan('guided');
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/scan', params: { mode: 'guided' } });
  });
});
