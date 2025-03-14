import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainStack from './MainStack';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const AppStack = () => (
  <Drawer.Navigator initialRouteName="MainStack" screenOptions={{ swipeEnabled: true }}>
    <Drawer.Screen name="MainStack" component={MainStack} options={{ headerShown: false, title: 'Main Page' }} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

export default AppStack;
