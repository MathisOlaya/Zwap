import { Pressable, StyleSheet, Text } from "react-native";

// Responsive
import colors from "@/constants/Color";
import { font, height, width } from "@/utils/responsive";

type PropsButton = {
  text: string;
  onClick: () => void;
};

const Button = ({ text, onClick }: PropsButton) => {
  return (
    <Pressable onPress={onClick} style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: width(320),
    height: height(44),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blue700,
  },
  text: {
    color: colors.grey200,
    fontFamily: "Poppins-Regular",
    fontSize: font(16),
  },
});

export default Button;
