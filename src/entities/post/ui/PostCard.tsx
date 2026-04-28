import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

import { Post } from '../../../shared/api/types';
import { useAppTheme, AppTheme } from '../../../shared/theme/useAppTheme';
import { UseNavigationProp } from '../../../shared/config/navigation/types';

import { Button } from '../../../shared/ui/Button';
import { HeartIcon } from '../../../shared/ui/icons/HeartIcon';
import { HeartFilledIcon } from '../../../shared/ui/icons/HeartFilledIcon';
import { CommentIcon } from '../../../shared/ui/icons/CommentIcon';

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

  const shouldShowMoreButton = post.body && post.body.length > 120;
  const displayText = isExpanded ? post.body : post.preview;
  const navigation = useNavigation<UseNavigationProp>();

  const handlePress = () => {
    navigation.navigate('PostDetail', { postId: post.id }); 
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.header}>
          {post.author?.avatarUrl ? (
            <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.authorName}>{post.author?.displayName}</Text>
        </View>
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: post.coverUrl }} 
            style={[styles.coverImage, { width: screenWidth }]} 
            resizeMode="cover"
          />
          
          {isPaid && (
            <BlurView intensity={80} tint="dark" style={styles.blurOverlay}>
              <View style={styles.paidContent}>
                <Text style={styles.paidText}>Контент скрыт пользователем.</Text>
                <Text style={styles.paidSubText}>Доступ откроется после доната</Text>
                <Button 
                  title="Отправить донат" 
                  onPress={() => {}} 
                />
              </View>
            </BlurView>
          )}
        </View>

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

        <View style={[styles.footer, isPaid && { paddingTop: theme.spacing.l }]}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onLikePress(post.id)}
            activeOpacity={0.7}
          >
            <View style={{ marginBottom: 2 }}>
              {post.isLiked ? (
                <HeartFilledIcon color="#FF2D55" />
              ) : (
                <HeartIcon color={theme.colors.textSecondary} />
              )}
            </View>
            <Text style={[styles.actionText, post.isLiked && styles.actionTextActive]}>
              {post.likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onCommentPress(post.id)}
            activeOpacity={0.7}
          >
            <View style={{ marginRight: 2 }}>
               <CommentIcon color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.actionText}>{post.commentsCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
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
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.round,
    marginRight: theme.spacing.m,
  },
  authorName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
  },
  coverContainer: {
    height: 350,
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
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.radius.round,
    marginRight: theme.spacing.m,
    borderColor: theme.colors.textSecondary, 
    backgroundColor: theme.colors.surface, 
  },
  actionText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  actionTextActive: {
    color: '#FF2D55',
  },
});