import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
      }
    } catch (error) {
      console.error('Error loading auth token:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      setAuthToken(token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setAuthToken(null);
    } catch (error) {
      console.error('Error removing auth token:', error);
      throw error;
    }
  };

  const value = {
    authToken,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!authToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
