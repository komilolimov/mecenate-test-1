export const lightColors = {
  primary: '#5C33FF',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  likeHeart: '#FF3B30',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const darkColors = {
  primary: '#5C33FF',
  background: '#121212',
  surface: '#1E1E1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  likeHeart: '#FF3B30',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const colors = darkColors;

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
};

export const radius = {
  s: 8,
  m: 12,
  l: 16,
  round: 9999,
};

export const typography = {
  sizes: {
    caption: 12,
    body: 14,
    title: 16,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
};

export const theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
};