import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import { getPostById, likePost, dislikePost, deletePost } from '../api/posts';
import { createReply, likeReply, dislikeReply, updateReply, deleteReply } from '../api/replies';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { currentUser } = useAuth();

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
      // Ensure backend returns replies in a property named "replies"
      setReplies(data.reply || []);
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
      navigation.goBack();
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
      <Text style={{ fontSize: 12, color: 'gray' }}>
        Posted by: {post.user ? post.user.username : 'Unknown'}
      </Text>
      <Text style={{ fontSize: 12, color: 'gray' }}>
        Category: {post.category && post.category.name ? post.category.name : 'Unknown'}
      </Text>


      {/* Post Actions - only show Edit/Delete if current user is the owner */}
      {currentUser && currentUser.id === post.user_id && (
        <>
          <Button
            title="Edit Post"
            onPress={() => navigation.navigate('EditPost', { postId: post.id })}
            color="blue"
          />
          <Button title="Delete Post" onPress={handleDelete} color="red" />
        </>
      )}
      <Button title="Like" onPress={handleLike} />
      <Button title="Dislike" onPress={handleDislike} />

      {/* Replies Section */}
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
        Replies:
      </Text>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View style={{ marginVertical: 8, borderBottomWidth: 1, paddingBottom: 8 }}>
              <Text>{item.content}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>
                By: {item.user ? item.user.username : 'Unknown'} | Likes: {item.likes} | Dislikes: {item.dislikes}
              </Text>
              {/* Conditional Reply Actions: only show Edit/Delete if currentUser is the reply owner */}
              {currentUser && currentUser.id === item.user_id && (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => startEditingReply(item.id, item.content)}>
                    <Text style={{ marginRight: 10 }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteReply(item.id)}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Always show Like/Dislike for replies */}
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity onPress={() => handleLikeReply(item.id)}>
                  <Text style={{ marginRight: 10 }}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDislikeReply(item.id)}>
                  <Text style={{ marginRight: 10 }}>Dislike</Text>
                </TouchableOpacity>
              </View>
              {/* Inline editing for a reply */}
              {editReplyId === item.id && (
                <View style={{ marginTop: 8, backgroundColor: '#f2f2f2', padding: 10 }}>
                  <TextInput
                    style={{ borderWidth: 1, padding: 5, marginBottom: 5 }}
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
        }}
      />

      {/* Create New Reply */}
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
