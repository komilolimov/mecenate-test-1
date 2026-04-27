import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { lightColors, darkColors, spacing, radius, typography } from './tokens';

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = useMemo(() => {
    return {
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      isDark,
    };
  }, [isDark]);

  return theme;
}

export type AppTheme = ReturnType<typeof useAppTheme>;