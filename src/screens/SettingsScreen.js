import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { updateUsername } from '../api/auth'; // Your API function to update username
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

function SettingsScreen() {
  const navigation = useNavigation();
  const { authToken, signOut, currentUser } = useAuth();
  const [username, setUsername] = useState('');

  // Load current username when the screen mounts
  useEffect(() => {
    if (currentUser && currentUser.username) {
      setUsername(currentUser.username);
    }
  }, [currentUser]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }
    try {
      const data = await updateUsername(username);
      Alert.alert('Success', 'Username updated successfully!');
      // Optionally, update your AuthContext with the new username here.
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update username');
    }
  };

  const handleLogout = async () => {
    await signOut();
    // Navigate to sign in screen, or reset navigation stack
    navigation.replace('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Change Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter new username"
        style={styles.input}
      />
      <Button title="Update Username" onPress={handleUpdateUsername} />
      <View style={styles.separator} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16
  },
  separator: {
    marginVertical: 20
  }
});

export default SettingsScreen;
