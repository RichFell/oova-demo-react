import type { ViewProps } from 'react-native';

import { StripToken, type StripType } from '@/components/StripToken';

const types: StripType[] = ['E3G', 'LH | PdG'];

describe('StripToken', () => {
  it.each(types)('labels the %s strip for accessibility', (type) => {
    const props = StripToken({ type }).props as ViewProps;
    expect(props.accessibilityRole).toBe('image');
    expect(props.accessibilityLabel).toBe(type);
  });
});
