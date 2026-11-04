import { useAppRouter } from '@/hooks/useAppRouter';

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
});
