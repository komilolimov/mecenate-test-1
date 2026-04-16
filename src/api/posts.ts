import { apiClient } from './client';
import { PostsResponse } from './types';
import { FeedTier } from '../store/feedStore';


interface FetchPostsParams {
  pageParam?: string; 
  tier: FeedTier; 
}

export const fetchPosts = async ({ pageParam, tier }: FetchPostsParams) => {
  const params: Record<string, any> = { 
    limit: 10 
  };
  
  if (pageParam) {
    params.cursor = pageParam;
  }
  

  if (tier !== 'all') {
    params.tier = tier;
  }

 
  const response = await apiClient.get<PostsResponse>('/posts', { params });
  

  return response.data.data; 
};

export const toggleLikePost = async (postId: string) => {
  // Если у тебя настроен реальный эндпоинт, раскомментируй код ниже:
  // const response = await apiClient.post(`/posts/${postId}/like`);
  // return response.data;
  
  // Пока возвращаем фейковый успешный ответ с задержкой 300мс
  return new Promise((resolve) => setTimeout(resolve, 300));
};