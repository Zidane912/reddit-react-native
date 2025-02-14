import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { getPostById, likePost, dislikePost, deletePost } from '../api/posts';
import { createReply, likeReply, dislikeReply, updateReply, deleteReply } from '../api/replies';
import { useRoute, useNavigation } from '@react-navigation/native';

function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replies-related states
  const [newReplyText, setNewReplyText] = useState('');
  const [replies, setReplies] = useState([]);

  // Editing a reply
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPostById(postId);
      setPost(data);
      setReplies(data.reply || []); // Ensure replies are loaded
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============= POST ACTIONS =============
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
      navigation.goBack(); // or navigation.navigate('PostList')
    } catch (error) {
      console.error(error);
    }
  };

  // ============= REPLY ACTIONS =============

  const handleCreateReply = async () => {
    if (!newReplyText.trim()) {
      Alert.alert('Error', 'Reply content cannot be empty');
      return;
    }
    try {
      const newReply = await createReply(postId, newReplyText);
      // Append to local replies
      setReplies([...replies, newReply]);
      setNewReplyText('');
      Alert.alert('Success', 'Reply created!');
    } catch (error) {
      console.error(error);
    }
  };
  // Like a reply
  const handleLikeReply = async (replyId) => {
    try {
      const updatedReply = await likeReply(replyId);
      // Update local replies array
      setReplies((prev) =>
        prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Dislike a reply
  const handleDislikeReply = async (replyId) => {
    try {
      const updatedReply = await dislikeReply(replyId);
      // Update local replies array
      setReplies((prev) =>
        prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Start editing a reply (show text input)
  const startEditingReply = (replyId, currentContent) => {
    setEditReplyId(replyId);
    setEditReplyContent(currentContent);
  };

  // Update the reply on the server
  const handleUpdateReply = async () => {
    if (!editReplyId || !editReplyContent.trim()) {
      Alert.alert('Error', 'Reply content is required');
      return;
    }
    try {
      const updatedReply = await updateReply(editReplyId, editReplyContent);
      // Update local state
      setReplies((prev) =>
        prev.map((r) => (r.id === updatedReply.id ? updatedReply : r))
      );
      // Reset edit state
      setEditReplyId(null);
      setEditReplyContent('');
      Alert.alert('Success', 'Reply updated');
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a reply
  const handleDeleteReply = async (replyId) => {
    try {
      await deleteReply(replyId);
      // Remove from local array
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
    } catch (error) {
      console.error(error);
    }
  };

  // ============= RENDERING =============
  if (loading || !post) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Post Info */}
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{post.title}</Text>
      <Text style={{ fontSize: 16, marginVertical: 8 }}>{post.content}</Text>
      <Text>Emoji: {post.emoji}</Text>
      <Text>Likes: {post.likes}</Text>
      <Text>Dislikes: {post.dislikes}</Text>

      {/* Post Buttons */}
      <Button
        title="Edit Post"
        onPress={() => navigation.navigate('EditPost', { postId: post.id })}
        color="blue"
      />
      <Button title="Like" onPress={handleLike} />
      <Button title="Dislike" onPress={handleDislike} />
      <Button title="Delete Post" onPress={handleDelete} color="red" />

      {/* Replies Section */}
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
        Replies:
      </Text>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // If currently editing this reply, display inline editor
          if (editReplyId === item.id) {
            return (
              <View style={{ marginVertical: 8, padding: 10, backgroundColor: '#f2f2f2' }}>
                <Text style={{ fontWeight: 'bold' }}>Edit Reply</Text>
                <TextInput
                  style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
                  value={editReplyContent}
                  onChangeText={setEditReplyContent}
                />
                <Button title="Save Reply" onPress={handleUpdateReply} />
                <Button
                  title="Cancel"
                  onPress={() => {
                    setEditReplyId(null);
                    setEditReplyContent('');
                  }}
                  color="gray"
                />
              </View>
            );
          }

          // Normal reply display
          return (
            <View style={{ marginVertical: 8, borderBottomWidth: 1, paddingBottom: 8 }}>
              <Text>{item.content}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>
                Likes: {item.likes} | Dislikes: {item.dislikes}
              </Text>

              {/* Reply Actions */}
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => startEditingReply(item.id, item.content)}
                >
                  <Text style={{ marginRight: 10 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLikeReply(item.id)}>
                  <Text style={{ marginRight: 10 }}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislikeReply(item.id)}>
                  <Text style={{ marginRight: 10 }}>Dislike</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteReply(item.id)}>
                  <Text style={{ color: 'red' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* CREATE NEW REPLY */}
      <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 'bold' }}>
        Add a Reply:
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 8,
          marginTop: 8,
          borderRadius: 5,
          backgroundColor: '#fff',
        }}
        placeholder="Write your reply..."
        value={newReplyText}
        onChangeText={setNewReplyText}
      />
      <Button title="Post Reply" onPress={handleCreateReply} />
    </View>
  );
}

export default PostDetailScreen;
