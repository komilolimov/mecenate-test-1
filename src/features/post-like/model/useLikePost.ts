import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLikePost } from '../api/toggleLikePost';

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (post.id === postId) {
                return {
                  ...post,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
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
