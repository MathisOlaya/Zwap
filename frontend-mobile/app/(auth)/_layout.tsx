import { Redirect, Stack } from "expo-router";

// Context
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
