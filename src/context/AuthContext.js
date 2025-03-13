import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load both token and currentUser from storage on app startup
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('api_token');
        const user = await AsyncStorage.getItem('current_user');
        if (token) {
          setAuthToken(token);
        }
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error loading auth data', error);
      } finally {
        setLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const signIn = async (token, userData) => {
    try {
      await AsyncStorage.setItem('api_token', token);
      await AsyncStorage.setItem('current_user', JSON.stringify(userData));
      setAuthToken(token);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('api_token');
    await AsyncStorage.removeItem('current_user');
    setAuthToken(null);
    setCurrentUser(null);
  };

  // Set a timer to automatically sign out the user after a fixed duration
  useEffect(() => {
    let timer;
    const TIMEOUT_DURATION = 3600000; // 1 hour in milliseconds
    if (authToken) {
      timer = setTimeout(() => {
        console.log('Session expired. Signing out...');
        signOut();
      }, TIMEOUT_DURATION);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, currentUser, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
