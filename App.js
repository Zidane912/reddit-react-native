import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PostListScreen from './src/screens/PostListScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import EditPostScreen from './src/screens/EditPostScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Register' }} />
          <Stack.Screen name="PostList" component={PostListScreen} options={{ title: 'Posts' }} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post Details' }} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
          <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Edit Post' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
