import { View, Image, Text, StyleSheet, ViewStyle } from "react-native";

// Responsive
import { gapV, height, width, font } from "@/utils/responsive";

// Colors
import colors from "@/constants/Color";

const Caption = (style?: ViewStyle) => {
  return (
    <View style={[styles.captionContainer, style]}>
      <Image style={styles.image} source={require("../../assets/images/logo.png")} />
      <Text style={styles.caption}>Zwap it. Love it.</Text>
    </View>
  );
};

// Export
export default Caption;

const styles = StyleSheet.create({
  captionContainer: {
    display: "flex",
    alignItems: "center",
    paddingVertical: height(80),
    gap: gapV(10),
  },
  image: {
    width: width(195),
    height: height(75),
    objectFit: "contain",
  },

  caption: {
    fontFamily: "Poppins-LightItalic",
    fontSize: font(16),
    color: colors.grey300,
  },
});
