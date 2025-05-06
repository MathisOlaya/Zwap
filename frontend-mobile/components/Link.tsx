// Type
import { Href, useRouter } from "expo-router";

import { Text, StyleSheet, TextStyle } from "react-native";
import colors from "@/constants/Color";
import { font } from "@/utils/responsive";

const Link = ({ href, children, style }: { href: Href; children: React.ReactNode; style?: TextStyle }) => {
  // Define router
  const router = useRouter();

  // Redirect function
  const redirect = () => {
    router.replace(href);
  };

  // UI
  return (
    <Text style={[styles.link, style]} onPress={redirect}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  link: {
    fontFamily: "Poppins-Regular",
    color: colors.grey400,
    fontSize: font(12),
  },
});

export default Link;
