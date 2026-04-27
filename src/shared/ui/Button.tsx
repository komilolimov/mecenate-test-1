import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppTheme, AppTheme } from '../theme/useAppTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

export const Button = ({ title, onPress, isLoading = false }: ButtonProps) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.textPrimary} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  text: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.medium,
  },
});