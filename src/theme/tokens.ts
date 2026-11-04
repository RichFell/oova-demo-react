/**
 * Starting tokens, estimated by eye from screenshots.
 * Sample exact values from the current app before polishing.
 */
export const colors = {
  navy: '#00274A',
  background: '#F9F5F1',
  surface: '#FFFFFF',
  mint: '#E8F3EE',
  mintStrong: '#DDEDE4',
  chartreuse: '#F4FDAB',
  amber: '#F9CC56',
  pink: '#FF8ADB',
  muted: '#5A7489',
  body: '#34506A',
  line: '#DDE1E3',
  inactive: '#DFE1E2',
  hormone: {
    lh: '#D9EC3F',
    pdg: '#F9CC56',
    e3g: '#8FCFAE',
  },
} as const;

export const gradients = {
  commitment: ['#F9CC56', '#F293D6'],
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radii = { sm: 12, md: 22, pill: 999 } as const;

export const sizes = { button: 56, tabBar: 72 } as const;

/**
 * Outfit is a stand-in for Oova's rounded type. The real font is unknown.
 * Keys match the names registered with `useFonts` in `src/app/_layout.tsx`.
 */
export const fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
} as const;

export const typography = {
  title: { fontSize: 27, lineHeight: 31, fontWeight: '500', fontFamily: fonts.medium },
  heading: { fontSize: 20, lineHeight: 24, fontWeight: '600', fontFamily: fonts.semiBold },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400', fontFamily: fonts.regular },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
} as const;
