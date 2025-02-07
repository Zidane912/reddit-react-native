import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createPost } from '../api/posts';
import { useNavigation } from '@react-navigation/native';

function CreatePostScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSave = async () => {
    // Simple validation
    if (!title || !content || !categoryId) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    try {
      await createPost({
        title,
        content,
        category_id: parseInt(categoryId, 10),
      });
      Alert.alert('Success', 'Post created successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not create post');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Title"
        onChangeText={(val) => setTitle(val)}
        value={title}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Content"
        onChangeText={(val) => setContent(val)}
        value={content}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        multiline
      />
      <TextInput
        placeholder="Category ID"
        onChangeText={(val) => setCategoryId(val)}
        value={categoryId}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        keyboardType="number-pad"
      />
      <Button title="Save Post" onPress={handleSave} />
    </View>
  );
}

export default CreatePostScreen;
