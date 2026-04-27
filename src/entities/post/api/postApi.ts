import { apiClient } from '../../../shared/api/client';
import { Post, Comment } from '../../../shared/api/types';

// Ответ API для деталей поста
export interface PostDetailResponse {
  data: Post;
}

// Ответ API для комментариев
export interface CommentsResponse {
  data: {
    comments: Comment[];
    nextCursor: string | null;
  };
}

export interface SendCommentPayload {
  text: string;
}

export interface SendCommentResponse {
  data: Comment;
}


export const fetchPostDetail = async (postId: string): Promise<PostDetailResponse> => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
};

export const fetchComments = async (
  postId: string,
  pageParam?: string
): Promise<CommentsResponse> => {
  const params: Record<string, string | number> = { limit: 10 };
  if (pageParam) {
    params.cursor = pageParam;
  }
  const response = await apiClient.get(`/posts/${postId}/comments`, { params });
  return response.data;
};

export const sendPostComment = async (
  postId: string,
  payload: SendCommentPayload
): Promise<SendCommentResponse> => {
  const response = await apiClient.post<SendCommentResponse>(
    `/posts/${postId}/comments`,
    payload
  );
  return response.data;
};