import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { getPostById, likePost, dislikePost, deletePost } from '../api/posts';
import { useRoute, useNavigation } from '@react-navigation/native';

function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleLike = async () => {
    if (!post) return;
    try {
      await likePost(post.id);
      setPost({ ...post, likes: post.likes + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    if (!post) return;
    try {
      await dislikePost(post.id);
      setPost({ ...post, dislikes: post.dislikes + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post.id);
      navigation.goBack(); // or navigation.navigate('PostList')
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !post) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{post.title}</Text>
      <Text style={{ fontSize: 16, marginVertical: 8 }}>{post.content}</Text>
      <Text>Emoji: {post.emoji}</Text>
      <Text>Likes: {post.likes}</Text>
      <Text>Dislikes: {post.dislikes}</Text>

      <Button title="Edit Post" onPress={() => navigation.navigate('EditPost', { postId: post.id })} color="blue" />
      <Button title="Like" onPress={handleLike} />
      <Button title="Dislike" onPress={handleDislike} />
      <Button title="Delete Post" onPress={handleDelete} color="red" />
    </View>
  );
}

export default PostDetailScreen;
