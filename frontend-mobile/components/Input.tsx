import React from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

//Responsive
import { font, gapH, gapV, height, width } from "@/utils/responsive";

// Colors
import colors from "@/constants/Color";

// Props
type InputProps = {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  type?: KeyboardTypeOptions;
};

const Input = (Props: InputProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{Props.label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={Props.placeholder}
        onChangeText={Props.onChangeText}
        secureTextEntry={Props.secureTextEntry ? Props.secureTextEntry : false}
        keyboardType={Props.type ? Props.type : "default"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: gapV(4),
  },
  labelContainer: {
    paddingLeft: width(8),
  },
  label: {
    color: colors.grey200,
    fontSize: font(12),
    fontFamily: "Poppins-Regular",
  },
  input: {
    backgroundColor: colors.grey200,
    height: height(44),
    width: width(320),
    borderRadius: 12,
    paddingLeft: gapH(8),
  },
});

export default Input;
