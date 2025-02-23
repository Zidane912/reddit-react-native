import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet 
} from 'react-native';
import { getPosts, searchPosts } from '../api/posts';
import { useNavigation } from '@react-navigation/native';

function PostListScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Initial fetch when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Debounce search: when query changes, wait 500ms then trigger search
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

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      style={styles.postCard}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.categoryText}>
          Category: {item.category && item.category.name ? item.category.name : 'Unknown'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        placeholder="Search posts..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      {/* Create Post Button */}
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreatePost')}>
        <Text style={styles.createButtonText}>Create Post</Text>
      </TouchableOpacity>

      {/* Posts List or Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#ff4500', // Reddit red
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  postContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 12,
    color: '#777',
  },
});

export default PostListScreen;
