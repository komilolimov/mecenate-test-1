import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostComments } from '../api/getPostComments';

export const useComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam }: { pageParam: string | null }) => getPostComments(postId, 10, pageParam),
    getNextPageParam: (lastPage) => lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    initialPageParam: null as string | null,
    enabled: !!postId,
  });
};
