import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { toggleLikePost } from '../api/toggleLikePost';
import { PostsResponse, Post } from '../../../shared/api/types';

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueriesData<InfiniteData<PostsResponse['data']>>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
                  isLiked: !post.isLiked,
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousPosts) {
        queryClient.setQueriesData({ queryKey: ['posts'] }, context.previousPosts);
      }
    },
    onSettled: () => {
    },
  });
};
