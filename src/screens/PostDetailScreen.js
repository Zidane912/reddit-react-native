import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  StyleSheet
} from 'react-native';
import { getPostById, likePost, dislikePost, deletePost } from '../api/posts';
import { createReply, likeReply, dislikeReply, updateReply, deleteReply } from '../api/replies';
import { getCategories } from '../api/categories'; // Use the API call here
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);

  // Replies-related states
  const [newReplyText, setNewReplyText] = useState('');
  const [replies, setReplies] = useState([]);

  // Editing a reply
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  useEffect(() => {
    fetchPost();
    fetchCategories(); // Fetch categories when the component mounts
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setReplies(data.replies || []);
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
    } catch (error) {
      console.error(error);
    }
  };

  // Post actions
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
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  // Reply actions
  const handleCreateReply = async () => {
    if (!newReplyText.trim()) {
      Alert.alert('Error', 'Reply content cannot be empty');
      return;
    }
    try {
      const newReply = await createReply(post.id, newReplyText);
      setReplies([...replies, newReply]);
      setNewReplyText('');
      Alert.alert('Success', 'Reply created!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const updatedReply = await likeReply(replyId);
      setReplies((prev) =>
        prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislikeReply = async (replyId) => {
    try {
      const updatedReply = await dislikeReply(replyId);
      setReplies((prev) =>
        prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const startEditingReply = (replyId, currentContent) => {
    setEditReplyId(replyId);
    setEditReplyContent(currentContent);
  };

  const handleUpdateReply = async () => {
    if (!editReplyId || !editReplyContent.trim()) {
      Alert.alert('Error', 'Reply content is required');
      return;
    }
    try {
      const updatedReply = await updateReply(editReplyId, editReplyContent);
      setReplies((prev) =>
        prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
      );
      setEditReplyId(null);
      setEditReplyContent('');
      Alert.alert('Success', 'Reply updated');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await deleteReply(replyId);
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      Alert.alert('Success', 'Reply deleted!');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !post) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  const renderHeader = () => {
    // Use the categories fetched from the API to look up the category name
    const categoryObj = categories.find(category => category.id === post.category_id);
    
    return (
      <View style={styles.postCard}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
        <Text style={styles.postEmoji}>Emoji: {post.emoji}</Text>
        <View style={styles.postStats}>
          <Text style={styles.statText}>Likes: {post.likes}</Text>
          <Text style={styles.statText}>Dislikes: {post.dislikes}</Text>
        </View>
        <Text style={styles.metaText}>
          Posted by: {post.user ? post.user.username : 'Unknown'}
        </Text>
        <Text style={styles.metaText}>
          Category: {categoryObj ? categoryObj.name : 'Unknown'}
        </Text>
        {currentUser && currentUser.id === post.user_id && (
          <View style={styles.postActions}>
            <Button
              title="Edit Post"
              onPress={() => navigation.navigate('EditPost', { postId: post.id })}
              color="#0079d3"
            />
            <Button title="Delete Post" onPress={handleDelete} color="#ff4500" />
          </View>
        )}
        <View style={styles.voteActions}>
          <Button title="Like" onPress={handleLike} />
          <Button title="Dislike" onPress={handleDislike} />
        </View>
        <Text style={styles.sectionTitle}>Replies:</Text>
      </View>
    );
  };

  const renderReplyItem = ({ item }) => (
    <View style={styles.replyCard}>
      <Text style={styles.replyContent}>{item.content}</Text>
      <Text style={styles.replyMeta}>
        By: {item.user ? item.user.username : 'Unknown'} | Likes: {item.likes} | Dislikes: {item.dislikes}
      </Text>
      {currentUser && currentUser.id === item.user_id && (
        <View style={styles.replyActions}>
          <TouchableOpacity onPress={() => startEditingReply(item.id, item.content)}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteReply(item.id)}>
            <Text style={[styles.actionText, { color: '#ff4500' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.voteActions}>
        <TouchableOpacity onPress={() => handleLikeReply(item.id)}>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDislikeReply(item.id)}>
          <Text style={styles.actionText}>Dislike</Text>
        </TouchableOpacity>
      </View>
      {editReplyId === item.id && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editReplyContent}
            onChangeText={setEditReplyContent}
          />
          <Button title="Save" onPress={handleUpdateReply} />
          <Button
            title="Cancel"
            color="gray"
            onPress={() => {
              setEditReplyId(null);
              setEditReplyContent('');
            }}
          />
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={replies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderReplyItem}
      contentContainerStyle={styles.listContainer}
      ListFooterComponent={
        <View style={styles.newReplyContainer}>
          <Text style={styles.sectionTitle}>Add a Reply:</Text>
          <TextInput
            style={styles.newReplyInput}
            placeholder="Write your reply..."
            value={newReplyText}
            onChangeText={setNewReplyText}
          />
          <Button title="Post Reply" onPress={handleCreateReply} color="#0079d3" />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  postContent: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
  },
  postEmoji: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: '#555',
  },
  metaText: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  voteActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  replyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  replyContent: {
    fontSize: 16,
    color: '#444',
  },
  replyMeta: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  replyActions: {
    flexDirection: 'row',
  },
  actionText: {
    fontSize: 14,
    color: '#0079d3',
    marginRight: 10,
  },
  editContainer: {
    marginTop: 8,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  newReplyContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  newReplyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
});

export default PostDetailScreen;
