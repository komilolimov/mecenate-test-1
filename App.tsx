// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from './src/shared/theme/useAppTheme';
import { FeedPage } from './src/pages/feed/ui/FeedPage';
import { PostDetailPage } from './src/pages/postdetail/ui/PostDetailPage';
import { RootStackParamList } from './src/shared/config/navigation/types';

// Создаем клиент для кэширования запросов
const queryClient = new QueryClient();

// Создаем сам навигатор со строгими типами, которые мы написали на прошлом шаге
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainApp() {
  const theme = useAppTheme();
  
  return (
    <>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      {/* NavigationContainer — это "коробка" для всех наших экранов */}
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Feed"
          screenOptions={{
            // Устанавливаем цвет фона навигатора из нашей темы
            contentStyle: { backgroundColor: theme.colors.background } 
          }}
        >
          {/* Экран 1: Наша готовая лента */}
          <Stack.Screen 
            name="Feed" 
            component={FeedPage} 
            options={{ headerShown: false }} // Скрываем верхнюю шапку на главном экране
          />
          
          {/* Экран 2: Детали поста */}
          <Stack.Screen 
            name="PostDetail" 
            component={PostDetailPage} 
            options={{ 
              headerShown: true, 
              title: 'Детальный пост', 
              headerBackButtonDisplayMode: 'minimal' // Убираем текст "Назад", оставляем только стрелочку
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}