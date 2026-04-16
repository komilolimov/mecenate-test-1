import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      // Имитация API запроса
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onMutate: async (postId) => {
      // Оптимистичное обновление UI
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
      // Возврат к предыдущему состоянию в случае ошибки
      if (context?.previousPosts) {
        queryClient.setQueriesData({ queryKey: ['posts'] }, context.previousPosts);
      }
    },
    onSettled: () => {
      // Инвалидация кэша для синхронизации с сервером
      // queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
