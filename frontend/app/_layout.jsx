import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useState, createContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealTimesContext } from '../hooks/mealTimes';
import { MacroProvider } from '../hooks/macroContext';

import HomeScreen from '../src/screens/HomeScreen';
import GroceryListScreen from '../src/screens/GroceryListScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import AddFoodScreen from '../src/screens/AddFoodScreen';
import ChangeMealTimesScreen from '../src/screens/MealTimesScreen';
import MacrosScreen from '../src/screens/MacrosScreen';
import FoodPrefScreen from '../src/screens/FoodPrefScreen';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';

const Tab = createBottomTabNavigator();
export const DMContext = createContext();

function TabNavigator() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <DMContext.Provider value={[darkModeEnabled, setDarkModeEnabled]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Grocery List') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Add Food') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff",
            borderTopWidth: 0,
            elevation: 5,
          },
          headerStyle: { backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff" },
          headerTintColor: darkModeEnabled ? "#fff" : "#1c1b1a"
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Grocery List" component={GroceryListScreen} />
        <Tab.Screen name="Add Food" component={AddFoodScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </DMContext.Provider>
  );
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [mealTimes, setMealTimes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        const token = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(!!token);
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
    <DMContext.Provider value={[darkModeEnabled, setDarkModeEnabled]}>
      <MacroProvider>
        <MealTimesContext.Provider value={{ mealTimes, setMealTimes }}>
          <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <>
                <Stack.Screen name="index" component={LoginScreen} />
                <Stack.Screen name="register" component={RegisterScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="(tabs)" component={TabNavigator} />
                <Stack.Screen name="mealtimes" component={ChangeMealTimesScreen} />
                <Stack.Screen name="macros" component={MacrosScreen} />
                <Stack.Screen name="foodpref" component={FoodPrefScreen} />
              </>
            )}
          </Stack>
          <StatusBar style="auto" />
        </MealTimesContext.Provider>
      </MacroProvider>
    </DMContext.Provider>
  );
}
