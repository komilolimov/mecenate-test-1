// src/features/feed/components/PostCard.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Post } from '../../../api/types';
import { useAppTheme } from '../../../theme/useAppTheme';
// Импортируем нашу кастомную кнопку для заглушки платного поста
import { Button } from '../../../components/ui/Button';
import LikeIcon from '../../../components/icons/LikeIcon';
import CommentIcon from '../../../components/icons/CommentIcon';

interface PostCardProps {
  post: Post;
  onLikePress: (id: string) => void;
  onCommentPress: (id: string) => void;
}

export const PostCard = ({ post, onLikePress, onCommentPress }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const isPaid = post.tier === 'paid';
  const screenWidth = Dimensions.get('window').width;

  // Если текст длиннее 120 символов и карточка не развернута, показываем превью
  const shouldShowMoreButton = post.body && post.body.length > 120;
  const displayText = isExpanded ? post.body : post.preview;

  return (
    <View style={styles.container}>
      {/* 1. Шапка (Автор) */}
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.displayName}</Text>
      </View>

      {/* 2. Обложка (Изображение) */}
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: post.coverUrl }} 
          style={[styles.coverImage, { width: screenWidth }]} 
          resizeMode="cover"
        />
        
        {/* Заглушка для платных постов */}
        {isPaid && (
          <BlurView intensity={80} tint="dark" style={styles.blurOverlay}>
            <View style={styles.paidContent}>
              <Text style={styles.paidText}>Контент скрыт пользователем.</Text>
              <Text style={styles.paidSubText}>Доступ откроется после доната</Text>
              <Button 
                title="Отправить донат" 
                onPress={() => console.log('Донат нажат')} 
              />
            </View>
          </BlurView>
        )}
      </View>

      {/* 3. Текст поста (Отображается только если пост бесплатный) */}
      {!isPaid && (
        <View style={styles.body}>
          <Text style={styles.title}>{post.title}</Text>
          
          <Text style={styles.previewText} numberOfLines={isExpanded ? undefined : 3}>
            {displayText}
          </Text>
          
          {shouldShowMoreButton && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
              <Text style={styles.showMoreText}>
                {isExpanded ? 'Скрыть' : 'Показать еще'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 4. Подвал (Счетчики лайков и комментариев) */}
      <View style={[styles.footer, isPaid && { paddingTop: theme.spacing.l }]}>
        <TouchableOpacity 
          style={[styles.actionButton, post.isLiked && styles.actionButtonActive]} 
          onPress={() => onLikePress(post.id)}
          activeOpacity={0.7}
        >
          {/* Если пост лайкнут - передаем красный цвет, иначе - серый */}
          <LikeIcon color={post.isLiked ? theme.colors.likeHeart : theme.colors.textSecondary} />
          <Text style={[styles.actionText, post.isLiked && styles.actionTextActive]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onCommentPress(post.id)}
          activeOpacity={0.7}
        >
          {/* У комментариев всегда стандартный серый цвет */}
          <CommentIcon color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background, 
    marginBottom: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.round,
    marginRight: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  authorName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
  },
  coverContainer: {
    height: 350,
    backgroundColor: theme.colors.surface,
  },
  coverImage: {
    height: '100%',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paidContent: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radius.l,
  },
  paidText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  paidSubText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  body: {
    padding: theme.spacing.l,
  },
  title: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  previewText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  showMoreText: {
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.radius.round,
    marginRight: theme.spacing.m,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  actionText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  actionTextActive: {
    color: theme.colors.likeHeart,
  },
});