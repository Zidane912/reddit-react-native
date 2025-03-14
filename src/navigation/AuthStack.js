import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Register' }} />
  </Stack.Navigator>
);

export default AuthStack;
