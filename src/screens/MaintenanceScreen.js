import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MaintenanceScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Service Unavailable</Text>
    <Text style={styles.message}>
      Sorry, the app's backend is only available Monday through Friday from 9:00 AM to 5:30 PM.
      Please check back during those hours.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});

export default MaintenanceScreen;
