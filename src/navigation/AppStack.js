import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MainStack from './MainStack';
import SettingsScreen from '../screens/SettingsScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

const Tab = createBottomTabNavigator();

const AppStack = () => (
  <Tab.Navigator
    initialRouteName="MainStack"
    swipeEnabled={true}
    tabBarPosition="bottom"
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false, // Disable the text labels
      tabBarShowIcon: true, // enable icons
      tabBarIndicatorStyle: { backgroundColor: '#0079d3' },
      tabBarStyle: { backgroundColor: '#fff' },
      tabBarActiveTintColor: '#0079d3',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen 
      name="MainStack" 
      component={MainStack} 
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="search" size={20} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="CreatePost" 
      component={CreatePostScreen} 
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="plus" size={20} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="cog" size={20} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppStack;