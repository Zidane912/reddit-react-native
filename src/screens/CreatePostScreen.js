import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  StyleSheet, 
  Text, 
  ScrollView 
} from 'react-native';
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
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !selectedCategory) {
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Post</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Content"
          placeholderTextColor="#777"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <Text style={styles.label}>Select Category:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            mode="dropdown"
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
            ))}
          </Picker>
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Create Post" onPress={handleSave} color="#ff4500" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    overflow: 'visible',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 8,
  },
});

export default CreatePostScreen;
