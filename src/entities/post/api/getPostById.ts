import { apiClient } from '../../../shared/api/client';
import { PostDetailResponse } from '../../../shared/api/types';

export const getPostById = async (id: string): Promise<PostDetailResponse> => {
  const response = await apiClient.get<PostDetailResponse>(`/posts/${id}`);
  return response.data;
};
