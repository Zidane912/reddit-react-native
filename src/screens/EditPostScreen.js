import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { getPostById, updatePost } from '../api/posts';
import { useRoute, useNavigation } from '@react-navigation/native';

function EditPostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Title and Content are required!');
      return;
    }

    try {
      await updatePost(postId, { title, content });
      Alert.alert('Success', 'Post updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update the post');
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Edit Post</Text>

      <Text>Title:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
        value={title}
        onChangeText={setTitle}
      />

      <Text>Content:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginVertical: 8, height: 100 }}
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Button title="Update Post" onPress={handleUpdate} color="green" />
      <Button title="Cancel" onPress={() => navigation.goBack()} color="gray" />
    </View>
  );
}

export default EditPostScreen;
