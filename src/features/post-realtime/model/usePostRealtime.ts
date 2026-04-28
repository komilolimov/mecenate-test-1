import { useEffect } from 'react';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
// Импортируй свои типы ответов (проверь пути!)
import { PostDetailResponse, CommentsResponse, Comment, Post } from '../../../shared/api/types'; 
// Импортируй свой способ получения токена, например:
// import { authStore } from '../../../entities/auth/model/authStore';

export const usePostRealtime = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    // ВАЖНО: Замени это на реальное получение твоего UUID токена
    // const token = authStore.token; 
    const token = '550e8400-e29b-41d4-a716-446655440000'; // Временная заглушка, поставь свой UUID!

    const wsUrl = `wss://k8s.mectest.ru/test-app/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Подключение установлено
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'ping') return;

        type FlexiblePostData = { data: { post: Post } } | { data: Post };

        // 1. МАГИЯ: Реалтайм лайки (like_updated)
        if (message.type === 'like_updated' && message.postId === postId) {
          queryClient.setQueryData<FlexiblePostData | undefined>(['post', postId], (oldData) => {
            if (!oldData || !oldData.data) return oldData;
            
            const isWrapped = 'post' in oldData.data;
            const targetPost = isWrapped ? (oldData.data as { post: Post }).post : (oldData.data as Post);

            const newPost: Post = {
              ...targetPost,
              likesCount: Number(message.likesCount), // Точная цифра из сокета
            };

            return {
              ...oldData,
              data: isWrapped ? { post: newPost } : newPost
            } as FlexiblePostData;
          });
        }

        // 2. МАГИЯ: Реалтайм новые комментарии (comment_added)
        if (message.type === 'comment_added' && message.postId === postId) {
          
          // 2.1 Обновляем счетчик комментариев
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

          // 2.2 Добавляем комментарий в список
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
        console.error('Ошибка парсинга WS сообщения:', error);
      }
    };

    ws.onclose = () => {
      // WebSocket отключен
    };

    ws.onerror = (error) => {
      console.error('WebSocket Ошибка:', error);
    }

    return () => {
      ws.close();
    };
  }, [postId, queryClient]);
};