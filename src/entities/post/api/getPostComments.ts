import { apiClient } from '../../../shared/api/client';
import { CommentsResponse } from '../../../shared/api/types';

export const getPostComments = async (
  id: string,
  limit: number = 10,
  cursor: string | null = null
): Promise<CommentsResponse> => {
  const params: Record<string, string | number> = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await apiClient.get<CommentsResponse>(`/posts/${id}/comments`, {
    params,
  });
  return response.data;
};
