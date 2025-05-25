import React from "react";
import { ActivityIndicator, StyleSheet, View, Modal } from "react-native";
import { BlurView } from "expo-blur";
import colors from "@/constants/Color";

type Props = {
  enabled: boolean;
};

const Loader = ({ enabled }: Props) => {
  if (!enabled) return null;

  return (
    <Modal transparent animationType="fade" visible={enabled}>
      <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={48} color={colors.blue500} />
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
