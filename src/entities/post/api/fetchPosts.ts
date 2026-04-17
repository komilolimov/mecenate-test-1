import { apiClient } from '../../../shared/api/client';
import { PostsResponse, FeedTier } from '../../../shared/api/types';

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