import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DMContext } from '../../app/_layout';
import { useContext } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useContext(DMContext);
  const navigation = useNavigation();

  const toggleNotifications = () =>
    setNotificationsEnabled((prevState) => !prevState);

  const toggleDarkMode = () => setDarkModeEnabled((prevState) => !prevState);

  const resetApp = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => console.log('Settings reset!') },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' }]}>
      <Text style={[styles.header, { color: darkModeEnabled ? '#fff' : '#333' }]}>Settings</Text>
      
      {/* Set Meal Times */}
      <TouchableOpacity onPress={() => navigation.navigate('Change Meal Times')} style={styles.setting}>
        <Text
          style={[styles.settingText, { color: darkModeEnabled ? '#fff' : '#333' }]}
        >
          Set Meal Times
        </Text>
        <Ionicons
          name="caret-forward-outline"
          size={25}
          color={darkModeEnabled ? '#fff' : '#333'}
          style={{ alignSelf: 'center', marginRight: 10 }}
        />
      </TouchableOpacity>

      {/* Notifications Setting */}
      <View style={[styles.setting, { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' }]}>
        <Text style={[styles.settingText, { color: darkModeEnabled ? "#fff" : "#333" }]}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#ccc', true: '#007aff' }}
          thumbColor={notificationsEnabled ? '#007aff' : '#f4f3f4'}
        />
      </View>

      {/* Dark Mode Setting */}
      <View style={[styles.setting, { backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff" }]}>
        <Text style={[styles.settingText, { color: darkModeEnabled ? "#fff" : "#333" }]}>Enable Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#ccc', true: '#007aff' }}
          thumbColor={darkModeEnabled ? '#007aff' : '#f4f3f4'}
        />
        <StatusBar style={darkModeEnabled ? "light" : "dark"} />
      </View>

      {/* Reset Settings Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
        <Text style={styles.resetButtonText}>Reset Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 18,
  },
  resetButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
