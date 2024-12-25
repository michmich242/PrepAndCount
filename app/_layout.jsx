import { StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-reanimated';
import React from "react"

import HomeScreen from '../src/screens/HomeScreen';
import GroceryListScreen from '../src/screens/GroceryListScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import AddFoodScreen from '../src/screens/AddFoodScreen';
import ChangeMealTimesScreen from '../src/screens/MealTimesScreen'
import {useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'



// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


export const Context = React.createContext({});

export default function RootLayout() {

  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [breakfastTime, setBreakfastTime] = useState('9:00')
  const [lunchTime, setLunchTime] = useState('12:00')
  const [dinnerTime, setDinnerTime] = useState('6:00');


  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const SettingsStack = () => (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="Settings" component={SettingsScreen}/>
      <Stack.Screen options={{headerStyle: {backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff"}, headerTintColor: darkModeEnabled ? "#fff" : "#333"}} name= "Change Meal Times" component={ChangeMealTimesScreen}/>
    </Stack.Navigator>
  )

  return (
    <Context.Provider value={[darkModeEnabled, setDarkModeEnabled, breakfastTime, setBreakfastTime, lunchTime, setLunchTime, dinnerTime, setDinnerTime]}>
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
            backgroundColor: darkModeEnabled ? "#1c1b1a" :  "#fff",
            borderTopWidth: 0,
            elevation: 5,
          },
          headerStyle: {backgroundColor: darkModeEnabled ?  "#1c1b1a" :  "#fff"},
          headerTintColor: darkModeEnabled ? "#fff" :  "#1c1b1a"
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Grocery List" component={GroceryListScreen} />
        <Tab.Screen name="Add Food" component={AddFoodScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </Context.Provider>
  );
}
