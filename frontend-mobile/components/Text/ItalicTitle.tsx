// ReactNative
import { Text, StyleSheet } from "react-native";

// Responsive
import { font } from "@/utils/responsive";

// Props
type Props = {
  children: React.ReactNode;
};

const ItalicTitle = ({ children }: Props) => {
  return <Text style={styles.text}>{children}</Text>;
};

// Styles
const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Italic",
    fontSize: font(16),
  },
});

export default ItalicTitle;
