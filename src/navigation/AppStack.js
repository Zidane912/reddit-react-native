import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen from '../screens/EditPostScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => (
    <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="PostList" component={PostListScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="EditPost" component={EditPostScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
);

const AppStack = () => (
    <Drawer.Navigator
        initialRouteName="MainStack"
        screenOptions={{
            swipeEnabled: true,
        }}
    >
        <Drawer.Screen name="MainStack" component={MainStack} options={{ headerShown: false }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
);

export default AppStack;
