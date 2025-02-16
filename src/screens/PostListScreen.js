import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import { getPosts, searchPosts } from '../api/posts';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';



function PostListScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // false so that search bar renders immediately
  const [query, setQuery] = useState('');

  // Initial fetch when component mounts
  useEffect(() => {
    fetchPosts();
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('api_token');
        const user = await AsyncStorage.getItem('current_user');
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
  
    loadAuthData();
  }, []);

  // Debounce search: whenever query changes, wait 500ms then trigger search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() === '') {
        fetchPosts();
      } else {
        handleSearch(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (q) => {
    setLoading(true);
    try {
      const data = await searchPosts(q);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Always display the search bar */}
      <TextInput
        placeholder="Search posts..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 16,
          borderRadius: 5,
          backgroundColor: '#fff',
        }}
      />

      <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} color="green" />


      {/* Display ActivityIndicator below the search bar if loading; otherwise display the list */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
      ) : (
        
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              style={{
                backgroundColor: 'white',
                marginBottom: 10,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
              <Text numberOfLines={2}>{item.content}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default PostListScreen;
