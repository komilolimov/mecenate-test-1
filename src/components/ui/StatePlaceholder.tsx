// src/components/ui/StatePlaceholder.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from './Button';
import { theme } from '../../theme/tokens';

interface StatePlaceholderProps {
  title: string;
  buttonText: string;
  onButtonPress: () => void;
}

export const StatePlaceholder = ({ title, buttonText, onButtonPress }: StatePlaceholderProps) => {
  return (
    <View style={styles.container}>
      {/* Заглушка вместо Аксолотля (пока ты не добавишь картинку в assets) */}
      <View style={styles.imagePlaceholder} />
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title={buttonText} onPress={onButtonPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.l,
    marginBottom: theme.spacing.l,
  },
  title: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
  }
});