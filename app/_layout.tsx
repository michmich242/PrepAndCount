import { StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-reanimated';

import HomeScreen from '../src/screens/HomeScreen';
import GroceryListScreen from '../src/screens/GroceryListScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import AddFoodScreen from '../src/screens/AddFoodScreen';
import { useColorScheme } from '@/hooks/useColorScheme';



// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();

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

  // Customize theme
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212',
      text: '#ffffff',
    },
  };

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f5f5f5',
      text: '#000000',
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = ;
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
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 5,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Grocery List" component={GroceryListScreen} />
        <Tab.Screen name="Add Food" component={AddFoodScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
