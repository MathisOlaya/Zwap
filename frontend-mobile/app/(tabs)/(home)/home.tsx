import { useAuth } from "@/context/AuthContext";
import { Button, Text, View } from "react-native";
export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Hi</Text>
      <Button title="LogOut" onPress={() => signOut()}></Button>
    </View>
  );
}
