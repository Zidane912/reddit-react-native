import axios from 'axios';

const api = axios.create({
  // Point to your Laravel server's base URL
  // e.g. 'http://localhost/my-laravel/public/api'
  baseURL: 'http://192.168.0.102/api',
});

// Example: fetch a list of posts
export const getPosts = async () => {
  const response = await api.get('/posts');
  // If using Laravel's pagination (which returns { data: [] }),
  // you might do: return response.data.data;
  return response.data.data || response.data;
};

// Example: fetch a single post by ID
export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// Example: create a new post
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data.post;
};

// Example: update an existing post
export const updatePost = async (id, postData) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data.post;
};

// Example: delete a post
export const deletePost = async (id) => {

  console.log(id);
  await api.delete(`/posts/${id}`);
};

// Example: like a post
export const likePost = async (id) => {
  await api.post(`/posts/${id}/like`);
};

// Example: dislike a post
export const dislikePost = async (id) => {
  await api.post(`/posts/${id}/dislike`);
};
