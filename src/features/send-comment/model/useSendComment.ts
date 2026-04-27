import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendPostComment, SendCommentPayload } from '../../../entities/post/api/postApi'; // Проверь пути

export const useSendComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendCommentPayload) => sendPostComment(postId, payload),
    onSuccess: () => {
      // При успехе инвалидируем кэш комментариев для этого поста
      // React Query автоматически сделает фоновый запрос и подтянет новый коммент
      queryClient.invalidateQueries({ queryKey: ['post', postId, 'comments'] });
    },
    onError: (error) => {
      console.error('Ошибка при отправке комментария:', error);
      // Здесь можно добавить показ Toast/Alert с ошибкой
    },
  });
};