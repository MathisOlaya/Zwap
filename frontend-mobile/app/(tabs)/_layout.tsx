import { Redirect, Stack } from "expo-router";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

// Icon
import { House } from "lucide-react-native";

// Responsive
import { gapH, gapV, height } from "@/utils/responsive";

import { useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#012A4A", headerShown: false, tabBarStyle: styles.tab }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: gapH(38),
    height: height(86),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },
});
