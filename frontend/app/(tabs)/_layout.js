import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { DMContext } from '../_layout';

export default function TabLayout() {
  const [darkModeEnabled] = useContext(DMContext);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'grocery-list':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'add-food':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
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
        headerStyle: { 
          backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff" 
        },
        headerTintColor: darkModeEnabled ? "#fff" : "#1c1b1a"
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
        }} 
      />
      <Tabs.Screen 
        name="grocery-list" 
        options={{ 
          title: 'Grocery List',
        }} 
      />
      <Tabs.Screen 
        name="add-food" 
        options={{ 
          title: 'Add Food',
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
        }} 
      />
    </Tabs>
  );
}
