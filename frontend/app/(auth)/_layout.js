import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to tabs
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="register" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{
          headerShown: true,
          headerTitle: "Reset Password",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
