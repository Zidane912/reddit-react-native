import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { updateUsername } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

function SettingsScreen() {
  const navigation = useNavigation();
  const { signOut, currentUser } = useAuth();
  const [username, setUsername] = useState('');

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
      // Optionally update currentUser in context here.
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update username');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigation.replace('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Change Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter new username"
          placeholderTextColor="#777"
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUsername}>
          <Text style={styles.buttonText}>Update Username</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  updateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
