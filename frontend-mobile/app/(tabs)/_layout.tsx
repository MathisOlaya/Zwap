import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(home)" />
    </Stack>
  );
}
