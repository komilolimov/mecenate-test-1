import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendPostComment, SendCommentPayload } from '../../../entities/post/api/postApi';

export const useSendComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendCommentPayload) => sendPostComment(postId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId, 'comments'] });
    },
  });
};