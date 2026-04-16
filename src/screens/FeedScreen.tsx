import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';

import { Tabs } from '../components/ui/Tabs';
import { StatePlaceholder } from '../components/ui/StatePlaceholder';
import { PostCard } from '../features/feed/components/PostCard';

import { feedStore } from '../store/feedStore';
import { usePosts } from '../features/feed/hooks/usePosts';
import { useAppTheme } from '../theme/useAppTheme';
import { useLikePost } from '../features/feed/hooks/useLikePost';

export const FeedScreen = observer(() => {
  const currentTier = feedStore.activeTier;
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = usePosts(currentTier);
  
  const { mutate: likePost } = useLikePost();

  const posts = data?.pages.flatMap((page) => page.posts) || [];
  const isEmpty = !isLoading && !isError && posts.length === 0;

  const handleLikePress = (id: string) => likePost(id);
  const handleCommentPress = (id: string) => console.log('Коммент:', id);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={styles.footerLoader} color={theme.colors.primary} />;
  };

  return (
    <View style={styles.container}>
      <Tabs 
        activeTab={currentTier} 
        onTabChange={feedStore.setTier} 
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : isError ? (
        <StatePlaceholder 
          title="Не удалось загрузить публикации"
          buttonText="Повторить"
          onButtonPress={() => refetch()} 
        />
      ) : isEmpty ? (
        <StatePlaceholder 
          title="По вашему запросу ничего не найдено"
          buttonText="На главную"
          onButtonPress={() => feedStore.setTier('all')} 
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard 
              post={item} 
              onLikePress={handleLikePress}
              onCommentPress={handleCommentPress}
            />
          )}
 
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={refetch}
          
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
});

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  footerLoader: {
    marginVertical: theme.spacing.l,
  },
});