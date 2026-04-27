import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
};

export type UseNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;