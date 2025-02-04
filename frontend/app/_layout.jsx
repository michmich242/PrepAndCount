import { Stack } from 'expo-router';
import { useEffect, useState, createContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import { MealTimesContext } from '../hooks/mealTimes';
import { MacroProvider } from '../hooks/macroContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

export const DMContext = createContext();

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [mealTimes, setMealTimes] = useState([]);

  if (loading) {
    return null;
  }

  return (
    <DMContext.Provider value={[darkModeEnabled, setDarkModeEnabled]}>
      <MacroProvider>
        <MealTimesContext.Provider value={{ mealTimes, setMealTimes }}>
          <StatusBar style={darkModeEnabled ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <Stack.Screen name="(auth)" />
            ) : (
              <Stack.Screen name="(tabs)" />
            )}
          </Stack>
        </MealTimesContext.Provider>
      </MacroProvider>
    </DMContext.Provider>
  );
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
