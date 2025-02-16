import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen from '../screens/EditPostScreen';

const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="PostList">
    <Stack.Screen name="PostList" component={PostListScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} />
    <Stack.Screen name="EditPost" component={EditPostScreen} />
  </Stack.Navigator>
);

export default MainStack;
