import { StyleSheet, type TextProps } from 'react-native';

import { AppText, textStyles, type TextVariant } from '@/components/AppText';
import { colors, fonts, typography } from '@/theme/tokens';

const variants: TextVariant[] = ['title', 'heading', 'body', 'label', 'button'];

const weightToFont: Record<string, string> = {
  '400': fonts.regular,
  '500': fonts.medium,
  '600': fonts.semiBold,
};

function propsOf(element: ReturnType<typeof AppText>) {
  return element.props as TextProps;
}

describe('AppText', () => {
  it.each(variants)('%s uses its token sizes and the matching Outfit weight', (variant) => {
    const { fontWeight, ...expected } = typography[variant];
    const style = StyleSheet.flatten(propsOf(AppText({ variant, children: 'x' })).style);

    expect(style).toEqual(expected);
    expect(style?.fontFamily).toBe(weightToFont[fontWeight]);
    expect(style).not.toHaveProperty('fontWeight');
  });

  it('defaults to the body variant', () => {
    const style = StyleSheet.flatten(propsOf(AppText({ children: 'x' })).style);
    expect(style).toEqual(StyleSheet.flatten(textStyles.body));
  });

  it('keeps Dynamic Type enabled', () => {
    for (const variant of variants) {
      expect(propsOf(AppText({ variant, children: 'x' })).allowFontScaling).toBe(true);
    }
  });

  it('lets callers extend the variant style', () => {
    const style = StyleSheet.flatten(
      propsOf(AppText({ variant: 'title', style: { color: colors.navy }, children: 'x' })).style,
    );
    expect(style).toMatchObject({ fontSize: typography.title.fontSize, color: colors.navy });
  });
});
