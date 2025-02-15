import api from './api';

export const signIn = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const signUp = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const updateUsername = async (newUsername) => {
    const response = await api.put('/auth/username', { username: newUsername });
    return response.data;
  };