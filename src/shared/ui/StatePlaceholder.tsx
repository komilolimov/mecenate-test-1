import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from './Button';
import { useAppTheme } from '../theme/useAppTheme';

interface StatePlaceholderProps {
  title: string;
  buttonText: string;
  onButtonPress: () => void;
}

export const StatePlaceholder = ({ title, buttonText, onButtonPress }: StatePlaceholderProps) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/axolotl.png')} 
        style={styles.image} 
        resizeMode="contain"
      />
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title={buttonText} onPress={onButtonPress} />
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  image: {
    width: 150,
    height: 150,
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