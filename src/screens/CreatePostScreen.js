import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createPost } from '../api/posts';
import { getCategories } from '../api/categories';
import { useNavigation } from '@react-navigation/native';

function CreatePostScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id.toString());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async () => {
    // Simple validation
    if (!title || !content || !selectedCategory) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    try {
      await createPost({ title, content, category_id: parseInt(selectedCategory) });
      Alert.alert('Success', 'Post created successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not create post');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Text style={styles.label}>Select Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
        ))}
      </Picker>
      <Button title="Create Post" onPress={handleSave} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: { fontSize: 16, marginBottom: 5 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
});

export default CreatePostScreen;
