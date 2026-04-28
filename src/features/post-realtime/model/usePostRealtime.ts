import { useEffect } from 'react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { PostDetailResponse, CommentsResponse, Comment, Post } from '../../../shared/api/types'; 

export const usePostRealtime = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    const token = '550e8400-e29b-41d4-a716-446655440000';

    const wsUrl = `wss://k8s.mectest.ru/test-app/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'ping') return;

        type FlexiblePostData = { data: { post: Post } } | { data: Post };

        if (message.type === 'like_updated' && message.postId === postId) {
          queryClient.setQueryData<FlexiblePostData | undefined>(['post', postId], (oldData) => {
            if (!oldData || !oldData.data) return oldData;
            
            const isWrapped = 'post' in oldData.data;
            const targetPost = isWrapped ? (oldData.data as { post: Post }).post : (oldData.data as Post);

            const newPost: Post = {
              ...targetPost,
              likesCount: Number(message.likesCount),
            };

            return {
              ...oldData,
              data: isWrapped ? { post: newPost } : newPost
            } as FlexiblePostData;
          });
        }

        if (message.type === 'comment_added' && message.postId === postId) {
          
          queryClient.setQueryData<FlexiblePostData | undefined>(['post', postId], (oldData) => {
            if (!oldData || !oldData.data) return oldData;
            
            const isWrapped = 'post' in oldData.data;
            const targetPost = isWrapped ? (oldData.data as { post: Post }).post : (oldData.data as Post);

            const newPost: Post = {
              ...targetPost,
              commentsCount: Number(targetPost.commentsCount || 0) + 1,
            };

            return {
              ...oldData,
              data: isWrapped ? { post: newPost } : newPost
            } as FlexiblePostData;
          });

          queryClient.setQueryData<InfiniteData<CommentsResponse> | undefined>(['post', postId, 'comments'], (oldData) => {
            if (!oldData) return oldData;
            const newPages = [...oldData.pages];
            
            if (newPages.length > 0) {
              const currentComments = newPages[0].data.comments || [];
              newPages[0] = {
                ...newPages[0],
                data: {
                  ...newPages[0].data,
                  comments: [message.comment, ...currentComments]
                }
              };
            }
            return { ...oldData, pages: newPages };
          });
        }
      } catch (error) {
      }
    };

    ws.onclose = () => {
    };

    ws.onerror = (error) => {
    };

    return () => {
      ws.close();
    };
  }, [postId, queryClient]);
};