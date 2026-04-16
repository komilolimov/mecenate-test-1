// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './src/theme/tokens';
import { FeedScreen } from './src/screens/FeedScreen';


// Создаем клиент для кэширования запросов
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* SafeAreaView нужен, чтобы контент не залезал на челку айфона */}
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar barStyle="light-content" />
        <FeedScreen />
      </SafeAreaView>
    </QueryClientProvider>
  );
}