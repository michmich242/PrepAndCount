import React, { useContext, useState, useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, AuthContext } from "../src/context/AuthContext"; 

import HomeScreen from '../src/screens/HomeScreen';
import GroceryListScreen from '../src/screens/GroceryListScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import AddFoodScreen from '../src/screens/AddFoodScreen';
import ChangeMealTimesScreen from '../src/screens/MealTimesScreen';
import MacrosScreen from '../src/screens/MacrosScreen';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';

import { MealTimesContext } from '../hooks/mealTimes';
import { MacroProvider } from '../hooks/macroContext';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

export const DMContext = React.createContext({});

// Authentication Stack for Login and Register
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
  </AuthStack.Navigator>
);

function MainApp() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { user } = useContext(AuthContext); 

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

  return (
    <DMContext.Provider value={[darkModeEnabled, setDarkModeEnabled]}>
      <MealTimesContext.Provider value={{ breakfastTime: "9:00", lunchTime: "12:00", dinnerTime: "6:00" }}>
        <MacroProvider>
          {user ? ( 
            <Tab.Navigator screenOptions={{ headerShown: false }}>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Grocery List" component={GroceryListScreen} />
              <Tab.Screen name="Add Food" component={AddFoodScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          ) : (
            <AuthStackScreen />
          )}
          <StatusBar style="auto" />
        </MacroProvider>
      </MealTimesContext.Provider>
    </DMContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainApp /> {/* No NavigationContainer here */}
    </AuthProvider>
  );
}
