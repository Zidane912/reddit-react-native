import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ActivityIndicator, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getPostById, updatePost } from '../api/posts';
import { getCategories } from '../api/categories';
import { useRoute, useNavigation } from '@react-navigation/native';

function EditPostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      // Use the accessor that returns a category object, if available.
      setSelectedCategory(data.category ? data.category.id.toString() : '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (!selectedCategory && data.length > 0) {
        setSelectedCategory(data[0].id.toString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim() || !selectedCategory) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    try {
      // Pass category_id as an integer
      await updatePost(postId, { 
        title, 
        content, 
        category_id: parseInt(selectedCategory)
      });
      Alert.alert('Success', 'Post updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update the post');
    }
  };

  if (loading || !post) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Post</Text>
      
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          mode="dropdown" // ensures dropdown behavior on Android
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
          ))}
        </Picker>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Update Post" onPress={handleUpdate} color="#28a745" />
        <Button title="Cancel" onPress={() => navigation.goBack()} color="#6c757d" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'visible', // allow dropdown options to display properly
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EditPostScreen;
