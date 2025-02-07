import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { getPosts } from '../api/posts';
import { useNavigation } from '@react-navigation/native';

function PostListScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} color="green" />
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
    </View>
  );
}

export default PostListScreen;
