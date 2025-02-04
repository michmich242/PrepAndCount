import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DMContext } from '../../app/_layout';
import { useContext } from "react";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMacros } from '../../hooks/macroContext';
import SignOutButton from '../components/SignOutButton';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useContext(DMContext);
  const { dispatch } = useMacros();

  const toggleNotifications = () =>
    setNotificationsEnabled((prevState) => !prevState);

  const toggleDarkMode = () => setDarkModeEnabled((prevState) => !prevState);

  const resetApp = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => dispatch({type: 'RESET'})},
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' }]}>
      <Text style={[styles.header, { color: darkModeEnabled ? '#fff' : '#333' }]}>Settings</Text>
      
      {/* Set Meal Times */}
      <TouchableOpacity onPress={() => router.push('/change-meal-times')} style={styles.setting}>
        <Text style={[styles.settingText, { color: darkModeEnabled ? '#fff' : '#333' }]}>
          Set Meal Times
        </Text>
        <Ionicons
          name="caret-forward-outline"
          size={25}
          color={darkModeEnabled ? '#fff' : '#333'}
          style={{ alignSelf: 'center', marginRight: 10 }}
        />
      </TouchableOpacity>

      {/* Set Food Preferences */}
      <TouchableOpacity onPress={() => router.push('/food-pref')} style={styles.setting}>
        <Text style={[styles.settingText, { color: darkModeEnabled ? '#fff' : '#333' }]}>
         Set Food Preferences
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
      </View>

      {/* Reset Button */}
      <TouchableOpacity 
        style={[styles.resetButton, { backgroundColor: darkModeEnabled ? '#333' : '#f5f5f5' }]}
        onPress={resetApp}
      >
        <Text style={[styles.resetButtonText, { color: darkModeEnabled ? '#fff' : '#333' }]}>
          Reset All Settings
        </Text>
      </TouchableOpacity>

      {/* Sign Out Button */}
      <SignOutButton />
      
      <StatusBar style={darkModeEnabled ? "light" : "dark"} />
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
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    flex: 1,
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
