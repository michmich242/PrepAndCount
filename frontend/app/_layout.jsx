import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-reanimated';
import React from 'react';

import HomeScreen from '../src/screens/HomeScreen';
import GroceryListScreen from '../src/screens/GroceryListScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import AddFoodScreen from '../src/screens/AddFoodScreen';
import ChangeMealTimesScreen from '../src/screens/MealTimesScreen';
import MacrosScreen from '../src/screens/MacrosScreen';
import FoodPrefScreen from '../src/screens/FoodPrefScreen';
import FitnessSettingsScreen from '../src/screens/FitnessSettingsScreen';
import LoginScreen from './login';
import RegisterScreen from './register';

import { MealTimesContext } from '../hooks/mealTimes';
import { MacroProvider } from '../hooks/macroContext';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const AddFoodStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

export const DMContext = React.createContext({});

export default function RootLayout() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [breakfastTime, setBreakfastTime] = useState('9:00');
  const [lunchTime, setLunchTime] = useState('12:00');
  const [dinnerTime, setDinnerTime] = useState('6:00');

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

  const SettingsStackScreen = () => (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        options={{ headerShown: false }}
        name="Settings Home"
        component={SettingsScreen}
      />
      <SettingsStack.Screen
        options={{
          headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
          headerTintColor: darkModeEnabled ? '#fff' : '#333',
        }}
        name="Change Meal Times"
        component={ChangeMealTimesScreen}
      />
      <SettingsStack.Screen
        options={{
          headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
          headerTintColor: darkModeEnabled ? '#fff' : '#333',
        }}
        name="Configure Height and Weight"
        component={FitnessSettingsScreen}
      />
      <SettingsStack.Screen
        options={{
          headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
          headerTintColor: darkModeEnabled ? '#fff' : '#333',
        }}
        name="Set Food Preferences"
        component={FoodPrefScreen}
      />
    </SettingsStack.Navigator>
  );

  const AddFoodStackScreen = () => (
    <AddFoodStack.Navigator>
      <AddFoodStack.Screen
        options={{ headerShown: false }}
        name="Add Food Home"
        component={AddFoodScreen}
      />
      <AddFoodStack.Screen
        options={{
          headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
          headerTintColor: darkModeEnabled ? '#fff' : '#333',
        }}
        name="Macros Screen"
        component={MacrosScreen}
      />
    </AddFoodStack.Navigator>
  );

  const HomeStackScreen = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <HomeStack.Screen
        options={{
          headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
          headerTintColor: darkModeEnabled ? '#fff' : '#333',
        }}
        name="Add Food"
        component={AddFoodScreen}
      />
      <HomeStack.Screen
        options={{
          headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
          headerTintColor: darkModeEnabled ? '#fff' : '#333',
        }}
        name="Grocery List"
        component={GroceryListScreen}
      />
    </HomeStack.Navigator>
  );

  const MainTabNavigator = () => (
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
          backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff',
          borderTopWidth: 0,
          elevation: 5,
        },
        headerStyle: { backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff' },
        headerTintColor: darkModeEnabled ? '#fff' : '#1c1b1a',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Grocery List" component={GroceryListScreen} />
      <Tab.Screen name="Add Food" component={AddFoodStackScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );

  return (
    <DMContext.Provider
      value={[
        darkModeEnabled,
        setDarkModeEnabled,
        breakfastTime,
        setBreakfastTime,
        lunchTime,
        setLunchTime,
        dinnerTime,
        setDinnerTime,
      ]}
    >
      <MealTimesContext.Provider
        value={[
          breakfastTime,
          setBreakfastTime,
          lunchTime,
          setLunchTime,
          dinnerTime,
          setDinnerTime,
        ]}
      >
        <MacroProvider>
          <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Home"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
          </RootStack.Navigator>
          <StatusBar style="auto" />
        </MacroProvider>
      </MealTimesContext.Provider>
    </DMContext.Provider>
  );
}
