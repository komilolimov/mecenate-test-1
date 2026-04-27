import React, { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme/useAppTheme';

interface Props {
  isLiked: boolean;
  likesCount: number;
  onPress: () => void;
  size?: 'small' | 'large';
}

export const AnimatedLikeButton = ({ isLiked, likesCount, onPress, size = 'large' }: Props) => {
  const theme = useAppTheme();
  // Используем встроенный Animated
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLiked) {
      // Анимация пульсации: увеличиваем до 1.3, затем плавно возвращаем к 1
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.3,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        })
      ]).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isLiked, scale]);

  const handlePress = () => {
    // Оставляем тактильный отклик (вибрацию)
    Haptics.impactAsync(
      isLiked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    onPress();
  };

  const iconSize = size === 'large' ? 18 : 14;
  const textSize = size === 'large' ? 15 : 12;

  return (
    <Pressable 
      onPress={handlePress} 
      style={[
        styles.button, 
        { 
          backgroundColor: size === 'large' ? theme.colors.surface : 'transparent',
          paddingHorizontal: size === 'large' ? 12 : 0,
          paddingVertical: size === 'large' ? 8 : 0,
        }
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={{ fontSize: iconSize }}>
          {isLiked ? '❤️' : '🤍'}
        </Text>
      </Animated.View>
      <Text 
        style={[
          styles.text, 
          { 
            color: isLiked ? theme.colors.primary : theme.colors.textPrimary,
            fontSize: textSize,
            marginLeft: size === 'large' ? 6 : 4
          }
        ]}
      >
        {likesCount}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  text: {
    fontWeight: '500',
  },
});