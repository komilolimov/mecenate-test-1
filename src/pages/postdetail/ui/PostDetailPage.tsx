import React, { useMemo, useState } from 'react';
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
  Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { PostDetailRouteProp } from '../../../shared/config/navigation/types';
import { useAppTheme, AppTheme } from '../../../shared/theme/useAppTheme';
import { usePostDetail } from '../../../entities/post/model/usePostDetail';
import { useComments } from '../../../entities/post/model/useComments';
import { Comment } from '../../../shared/api/types';
import { useSendComment } from '../../../features/send-comment/model/useSendComment';
import { usePostRealtime } from '../../../features/post-realtime/model/usePostRealtime';
import { useToggleLike } from '../../../features/post-like/model/useToggleLike';
import { AnimatedLikeButton } from '../../../shared/ui/AnimatedLikeButton';


export const PostDetailPage = () => {

  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params; 
  const [commentText, setCommentText] = useState('');
  const theme = useAppTheme();
  usePostRealtime(postId);
  const { mutate: toggleLike } = useToggleLike(postId);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { mutate: sendComment, isPending: isSending } = useSendComment(postId);
  const { data: postDetailData, isLoading: isPostLoading } = usePostDetail(postId);
  const { 
    data: commentsData, 
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useComments(postId);

  const handleSendComment = () => {
    if (!commentText.trim() || isSending) return; // Не отправляем пустые строки или если уже идет отправка

    sendComment(
      { text: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText(''); // Очищаем инпут после успешной отправки
        },
      }
    );
  };

  const post = postDetailData?.data;
  const comments = commentsData?.pages.flatMap(page => page.data.comments) ?? [];

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
        <Text style={{ color: theme.colors.textPrimary }}>Пост не найден</Text>
      </View>
    );
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      {item.author?.avatarUrl ? (
        <Image source={{ uri: item.author.avatarUrl }} style={styles.commentAvatar} />
      ) : (
        <View style={styles.commentAvatar} />
      )}
      <View style={styles.commentBody}>
        <Text style={styles.commentAuthor}>{item.author?.displayName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
      <View style={styles.commentLikeContainer}>
        <Text style={styles.commentLikeIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
        <Text style={styles.commentLikeCount}>{item.likesCount}</Text>
      </View>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        {post.author?.avatarUrl ? (
          <Image source={{ uri: post.author.avatarUrl }} style={styles.avatarPlaceholder} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={styles.authorName}>{post.author?.displayName}</Text>
      </View>

      {post.coverUrl ? (
        <Image source={{ uri: post.coverUrl }} style={styles.coverPlaceholder} />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.text}>{post.body}</Text>
        
        <View style={styles.actions}>
          <AnimatedLikeButton 
              isLiked={post.isLiked ?? false} 
              likesCount={post.likesCount} 
              onPress={() => toggleLike()} 
              size="large"
            />
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>💬 {post.commentsCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.commentsSection}>
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsCount}>{post.commentsCount} комментариев</Text>
          <Text style={styles.sortButton}>Сначала новые</Text>
        </View>
      </View>
    </>
  );

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
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.flatListContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage || isCommentsLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loaderSpacing} />
          ) : null
        }
      />

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Ваш комментарий"
            placeholderTextColor={theme.colors.textSecondary}
            value={commentText} // Привязываем к стейту
            onChangeText={setCommentText} // Обновляем стейт при вводе
            editable={!isSending} // Блокируем инпут во время отправки
            onSubmitEditing={handleSendComment} // Отправка по нажатию "Готово" на клавиатуре
            returnKeyType="send"
          />
          <Pressable 
            style={[styles.sendButton, { opacity: commentText.trim() && !isSending ? 1 : 0.5 }]} 
            onPress={handleSendComment}
            disabled={!commentText.trim() || isSending} // Блокируем кнопку, если пусто
          >
            {isSending ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerElement: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  loaderSpacing: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.s,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  coverPlaceholder: {
    width: '100%',
    height: 350,
    backgroundColor: theme.colors.border,
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  text: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: theme.spacing.m,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.m,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  commentsSection: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  commentsCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  sortButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.m,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  commentLikeContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.m,
  },
  commentLikeIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  commentLikeCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  inputWrapper: {
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? 30 : theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 24,
    color: theme.colors.primary,
  }
});
