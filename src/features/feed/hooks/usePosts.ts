import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../../api/posts';
import { FeedTier } from '../../../store/feedStore';

export const usePosts = (tier: FeedTier) => {
  return useInfiniteQuery({
    queryKey: ['posts', tier],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, tier }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
  });
};