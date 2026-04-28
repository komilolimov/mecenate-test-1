import React, { useMemo, useState, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable,
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { PostDetailRouteProp } from '../../../shared/config/navigation/types';
import { useAppTheme, AppTheme } from '../../../shared/theme/useAppTheme';
import { Comment, Post } from '../../../shared/api/types';

import { usePostDetail } from '../../../entities/post/model/usePostDetail';
import { useComments } from '../../../entities/post/model/useComments';
import { useSendComment } from '../../../features/send-comment/model/useSendComment';
import { usePostRealtime } from '../../../features/post-realtime/model/usePostRealtime';
import { useToggleLike } from '../../../features/post-like/model/useToggleLike';
import { AnimatedLikeButton } from '../../../shared/ui/AnimatedLikeButton';
import { HeartIcon } from '../../../shared/ui/icons/HeartIcon';
import { HeartFilledIcon } from '../../../shared/ui/icons/HeartFilledIcon';
import { CommentIcon } from '../../../shared/ui/icons/CommentIcon';
import { SendIcon } from '../../../shared/ui/icons/SendIcon';


// ==========================================
// 1. Изолированный Компонент Комментария
// Передаем theme через пропсы
// ==========================================
const CommentItem = React.memo(({ item, styles, theme }: { item: Comment, styles: any, theme: AppTheme }) => {
  return (
    <View style={styles.commentItem}>
      {item.author?.avatarUrl ? (
        <Image source={{ uri: item.author.avatarUrl }} style={styles.commentAvatar} resizeMode="cover" />
      ) : (
        <View style={styles.commentAvatarPlaceholder} />
      )}
      <View style={styles.commentBody}>
        <Text style={styles.commentAuthor}>{item.author?.displayName || 'Аноним'}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
      <View style={styles.commentLikeContainer}>
        <View style={{ marginBottom: 4 }}>
          {item.isLiked ? (
            <HeartFilledIcon color="#FF2D55" />
          ) : (
            <HeartIcon color={theme.colors.textSecondary} />
          )}
        </View>
        <Text style={styles.commentLikeCount}>{item.likesCount || 0}</Text>
      </View>
    </View>
  );
});

// ==========================================
// 2. Изолированная Шапка Поста (Header)
// Передаем theme через пропсы
// ==========================================
const PostHeader = React.memo(({ post, onLike, styles, theme }: { post: Post, onLike: () => void, styles: any, theme: AppTheme }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.authorSection}>
        {post.author?.avatarUrl ? (
          <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={styles.authorName}>{post.author?.displayName || 'Неизвестный автор'}</Text>
      </View>

      {post.coverUrl ? (
        <Image source={{ uri: post.coverUrl }} style={styles.coverImage} resizeMode="cover" />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <View style={styles.contentSection}>
        {!!post.title && <Text style={styles.title}>{post.title}</Text>}
        {!!post.body && <Text style={styles.text}>{post.body}</Text>}
        
        <View style={styles.actionsBar}>
          <AnimatedLikeButton 
            isLiked={post.isLiked ?? false} 
            likesCount={post.likesCount || 0} 
            onPress={onLike} 
            size="large"
          />
         <View style={styles.commentBadge}>
            <View style={{ marginRight: 6 }}>
              <CommentIcon color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.commentBadgeText}>{post.commentsCount || 0}</Text>
          </View>
        </View>
      </View>

      <View style={styles.commentsHeader}>
        <Text style={styles.commentsCountText}>{post.commentsCount || 0} комментариев</Text>
        <Text style={styles.sortButtonText}>Сначала новые</Text>
      </View>
    </View>
  );
});

// ==========================================
// 3. Изолированный Инпут Комментариев
// ==========================================
const CommentInputBox = React.memo(({ postId, styles, theme }: { postId: string, styles: any, theme: AppTheme }) => {
  const [commentText, setCommentText] = useState('');
  const { mutate: sendComment, isPending: isSending } = useSendComment(postId);

  const handleSendComment = useCallback(() => {
    const text = commentText.trim();
    if (!text || isSending) return;

    sendComment(
      { text },
      { onSuccess: () => setCommentText('') }
    );
  }, [commentText, isSending, sendComment]);

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Ваш комментарий"
          placeholderTextColor={theme.colors.textSecondary}
          value={commentText}
          onChangeText={setCommentText}
          editable={!isSending}
          onSubmitEditing={handleSendComment}
          returnKeyType="send"
          multiline={false}
        />
        <Pressable 
          style={styles.sendButton}
          onPress={handleSendComment}
          disabled={!commentText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <SendIcon 
              color={commentText.trim() ? theme.colors.primary : "#D5C9FF"} 
            />
          )}
        </Pressable>
      </View>
    </View>
  );
});

// ==========================================
// 4. Главный Экран
// ==========================================
export const PostDetailPage = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation();
  const { postId } = route.params; 
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.colors.background, // <-- Вернули эту строку
        shadowColor: 'transparent', // Убираем полоску тени на iOS
        elevation: 0,               // Убираем тень на Android
      },
      headerTintColor: theme.colors.textPrimary,
      headerTitleStyle: {
        color: theme.colors.textPrimary,
      },
    });
  }, [navigation, theme]);

  usePostRealtime(postId);
  const { mutate: toggleLike } = useToggleLike(postId);
  
  const { data: postDetailData, isLoading: isPostLoading } = usePostDetail(postId);
  const { 
    data: commentsData, 
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useComments(postId);

  const post = (postDetailData?.data?.post || postDetailData?.data || postDetailData) as any as Post | undefined;
  const comments = commentsData?.pages.flatMap(page => page.data.comments) ?? [];

  const renderComment: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentItem item={item} styles={styles} theme={theme} />
  ), [styles, theme]);

  if (isPostLoading) {
    return (
      <View style={[styles.container, styles.centerElement]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, styles.centerElement]}>
        <Text style={styles.errorText}>Публикация не найдена</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListHeaderComponent={<PostHeader post={post} onLike={toggleLike} styles={styles} theme={theme} />}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          (isFetchingNextPage || isCommentsLoading) ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loaderSpacing} />
          ) : null
        }
      />

      <CommentInputBox postId={postId} styles={styles} theme={theme} />
      
    </KeyboardAvoidingView>
  );
};

// ==========================================
// 5. Стили
// ==========================================
const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  centerElement: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  loaderSpacing: {
    marginVertical: 24,
  },
  headerContainer: {
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: theme.spacing.m,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: theme.spacing.m,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  coverImage: {
    width: '100%',
    aspectRatio: 1,
  },
  coverPlaceholder: {
    width: '100%',
    aspectRatio: 1,
  },
  contentSection: {
    padding: theme.spacing.m,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
    lineHeight: 28,
  },
  text: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
    marginBottom: theme.spacing.l,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  commentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderColor: theme.colors.textSecondary, 
    backgroundColor: theme.colors.surface,
  },
  commentBadgeText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
  commentsCountText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  sortButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: theme.spacing.m,
  },
  commentAvatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: theme.spacing.m,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 21,
  },
  commentLikeContainer: {
    alignItems: 'center',
    paddingLeft: theme.spacing.m,
  },
  commentLikeIcon: {
    fontSize: 14,
    marginBottom: 4,
  },
  commentLikeCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  inputWrapper: {
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? 32 : theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: theme.spacing.m,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  sendIcon: {
    fontSize: 18,
    color: theme.colors.primary,
  }
});