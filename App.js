import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import MaintenanceScreen from './src/screens/MaintenanceScreen';

function App() {
  const [backendAvailable, setBackendAvailable] = useState(null); // null = unknown

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('https://redditcloneapp.co.uk/'); // check the url of the web app
        if (response.ok) {
          setBackendAvailable(true);
        } else {
          setBackendAvailable(false);
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setBackendAvailable(false);
      }
    };

    checkBackendHealth();
  }, []);

  // While checking, display a loading indicator
  if (backendAvailable === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0079d3" />
      </View>
    );
  }

  return (
    <AuthProvider>
      {backendAvailable ? <RootNavigator /> : <MaintenanceScreen />}
    </AuthProvider>
  );
}

export default App;
