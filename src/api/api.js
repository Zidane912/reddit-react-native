import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.0.102/api', // your API URL
});

// Attach token to every request
api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('api_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);
  

export default api;
