// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppTheme } from './src/theme/useAppTheme';
import { FeedScreen } from './src/screens/FeedScreen';

// Создаем клиент для кэширования запросов
const queryClient = new QueryClient();

function MainApp() {
  const theme = useAppTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <FeedScreen />
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