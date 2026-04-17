import { apiClient } from '../../../shared/api/client';

export const toggleLikePost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
};
