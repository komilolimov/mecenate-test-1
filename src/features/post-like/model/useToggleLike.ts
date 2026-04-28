import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';
import { PostDetailResponse, Post } from '../../../shared/api/types';

export const useToggleLike = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      
      type FlexiblePostData = { data: { post: Post } } | { data: Post };
      const previousPost = queryClient.getQueryData<FlexiblePostData>(['post', postId]);

      queryClient.setQueryData<FlexiblePostData | undefined>(['post', postId], (oldData) => {
        // Защита от краша, если кэш пуст
        if (!oldData || !oldData.data) {
          return oldData;
        }

        const isWrapped = 'post' in oldData.data;
        const targetPost = isWrapped ? (oldData.data as { post: Post }).post : (oldData.data as Post);

        // Защита от краша, если поста внутри нет
        if (!targetPost) return oldData;

        const newPost = {
          ...targetPost,
          isLiked: !targetPost.isLiked,
          likesCount: targetPost.isLiked 
            ? Math.max(0, Number(targetPost.likesCount || 0) - 1) 
            : Number(targetPost.likesCount || 0) + 1,
        };

        return {
          ...oldData,
          data: isWrapped ? { post: newPost } : newPost
        } as FlexiblePostData;
      });

      return { previousPost };
    },
    onError: (err, variables, context) => {
      console.error('❌ Ошибка при лайке:', err);
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost);
      }
    },
    onSettled: () => {
      // Синхронизируемся с сервером в самом конце
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};