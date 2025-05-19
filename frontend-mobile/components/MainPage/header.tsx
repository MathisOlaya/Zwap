// ReactNative
import { View, Text, Image, StyleSheet } from "react-native";

// Responsive
import { font, width, height, gapH, gapV } from "@/utils/responsive";

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Accueil</Text>
      <Image source={require("@/assets/icons/search.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: gapH(12),
  },
  title: {
    fontSize: font(20),
    fontFamily: "Poppins-Medium",
  },
});

// Export component
export default Header;
