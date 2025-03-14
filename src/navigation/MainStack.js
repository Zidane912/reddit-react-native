import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen from '../screens/EditPostScreen';

const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="PostList">
    <Stack.Screen name="PostList" component={PostListScreen} options={{ title: 'All Posts' }} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Back to Post' }} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create your post' }} />
    <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Edit Post' }} />
  </Stack.Navigator>
);

export default MainStack;
