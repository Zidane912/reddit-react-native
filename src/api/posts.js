import api from './api';

export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data.data || response.data;
};

export const searchPosts = async (query) => {
  const response = await api.get('/posts', { params: { q: query } });
  return response.data.data || response.data;
};

export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data.post;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data.post;
};

export const deletePost = async (id) => {
  await api.delete(`/posts/${id}`);
};

export const likePost = async (id) => {
  await api.post(`/posts/${id}/like`);
};

export const dislikePost = async (id) => {
  await api.post(`/posts/${id}/dislike`);
};

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