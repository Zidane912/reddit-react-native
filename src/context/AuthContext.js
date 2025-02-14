import React, { createContext, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token when app loads
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('api_token');
        if (token) {
          setAuthToken(token);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (token) => {
    await AsyncStorage.setItem('api_token', token);
    setAuthToken(token);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('api_token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
