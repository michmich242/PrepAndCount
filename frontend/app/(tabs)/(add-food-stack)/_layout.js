import { Stack } from "expo-router";

export default function AddFoodLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Add Food" }} />
      <Stack.Screen name="macros" options={{ title: "Macros" }} />
    </Stack>
  );
}
