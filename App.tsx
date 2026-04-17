// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppTheme } from './src/shared/theme/useAppTheme';
import { FeedPage } from './src/pages/feed/ui/FeedPage';

// Создаем клиент для кэширования запросов
const queryClient = new QueryClient();

function MainApp() {
  const theme = useAppTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <FeedPage />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}