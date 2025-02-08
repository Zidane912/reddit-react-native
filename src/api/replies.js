import axios from 'axios';

const api = axios.create({
  // Point to your Laravel server's base URL
  // e.g. 'http://localhost/my-laravel/public/api'
  baseURL: 'http://192.168.0.102/api',
});

// Example: create a new reply
export const createReply = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/replies`, { content });
  return response.data.reply;
};

export const likeReply = async (replyId) => {
  const response = await api.post(`/replies/${replyId}/like`);
  return response.data.reply;
};

export const dislikeReply = async (replyId) => {
  const response = await api.post(`/replies/${replyId}/dislike`);
  return response.data.reply;
};

export const updateReply = async (replyId, content) => {
  const response = await api.put(`/replies/${replyId}`, { content });
  return response.data.reply;
};

export const deleteReply = async (replyId) => {
  const response = await api.delete(`/replies/${replyId}`);
  return response.data;
};