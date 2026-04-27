import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api/client';

export const useToggleLike = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('🚀 Отправляем POST запрос лайка на сервер...');
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
    },
    onMutate: async () => {
      console.log('✨ onMutate: начинаем оптимистичное обновление...');
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      
      const previousPost = queryClient.getQueryData(['post', postId]);

      queryClient.setQueryData(['post', postId], (oldData: any) => {
        // Защита от краша, если кэш пуст
        if (!oldData || !oldData.data) {
          console.log('⚠️ Кэш пуст, пропускаем оптимистичное обновление');
          return oldData;
        }

        const isWrapped = !!oldData.data.post;
        const targetPost = isWrapped ? oldData.data.post : oldData.data;

        // Защита от краша, если поста внутри нет
        if (!targetPost) return oldData;

        console.log('🔄 Меняем статус лайка в кэше...');
        const newPost = {
          ...targetPost,
          isLiked: !targetPost.isLiked,
          likesCount: targetPost.isLiked 
            ? Math.max(0, Number(targetPost.likesCount || 0) - 1) 
            : Number(targetPost.likesCount || 0) + 1,
        };

        return {
          ...oldData,
          data: isWrapped ? { ...oldData.data, post: newPost } : newPost
        };
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