import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
    fetchCategories();
  }, [postId]);

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [])
  );

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setReplies(data.reply || []);
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

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost(post.id);
              navigation.navigate('PostList');
            } catch (error) {
              console.error(error);
            }
          }
        }
      ],
      { cancelable: true }
    );
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
    Alert.alert(
      "Delete Reply",
      "Are you sure you want to delete this reply?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReply(replyId);
              setReplies((prev) => prev.filter((r) => r.id !== replyId));
              Alert.alert("Success", "Reply deleted!");
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
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
        <View>
          <View style={styles.iconsRow}>
            {currentUser && currentUser.id === post.user_id && (
              <>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('EditPost', { postId: post.id })}
                >
                  <FontAwesome5 name="edit" size={20} color="#0079d3" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleDelete}
                >
                  <FontAwesome5 name="trash-alt" size={20} color="#ff4500" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
              <FontAwesome5 name="thumbs-up" size={20} color="#0079d3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleDislike}>
              <FontAwesome5 name="thumbs-down" size={20} color="#ff4500" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Replies:</Text>
        </View>
      </View>
    );
  };

  const renderReplyItem = ({ item }) => (
    <View style={styles.replyCard}>
      <Text style={styles.replyContent}>{item.content}</Text>
      <Text style={styles.replyContent}>{item.emoji}</Text>
      <Text style={styles.replyMeta}>
        By: {item.user ? item.user.username : 'Unknown'} | Likes: {item.likes} | Dislikes: {item.dislikes}
      </Text>
      <View style={styles.replyRow}>
        {currentUser && currentUser.id === item.user_id && (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => startEditingReply(item.id, item.content)}
            >
              <FontAwesome5 name="edit" size={16} color="#0079d3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleDeleteReply(item.id)}
            >
              <FontAwesome5 name="trash-alt" size={16} color="#ff4500" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={() => handleLikeReply(item.id)}>
          <FontAwesome5 name="thumbs-up" size={16} color="#0079d3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleDislikeReply(item.id)}>
          <FontAwesome5 name="thumbs-down" size={16} color="#ff4500" />
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
    justifyContent: 'flex-end',
    marginVertical: 8,
  },
  voteActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
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
    justifyContent: 'flex-start',
    marginVertical: 4,
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
  iconButton: {
    marginHorizontal: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // You can also try: 'flex-start', 'flex-end', 'center', 'space-between', or 'space-around'
  },
});

export default PostDetailScreen;
