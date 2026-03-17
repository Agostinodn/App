import { Platform } from 'react-native';

export const typography = {
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    bold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },

  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};
