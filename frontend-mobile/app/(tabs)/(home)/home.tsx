import { useAuth } from "@/context/AuthContext";
import { Button, Text, View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

// Responsive
import { font, width, height, gapH, gapV } from "@/utils/responsive";

// Temp : Icons (then Lucid)
// Components
import Header from "@/components/MainPage/header";
import ArticleDisplayer from "@/components/Articles/ArticleDisplayer";

// API
import { useInitialData } from "@/hooks/useInitialData";

export default function HomeScreen() {
  const { signOut } = useAuth();
  // API Request
  const articlesRecommendation = useInitialData();

  // Displaying loading page when articles are not loader
  if (!articlesRecommendation.length) {
    return (
      <SafeAreaView style={styles.page}>
        <Header />
        <Text>Chargement...</Text>
      </SafeAreaView>
    );
  }

  // View
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Accueil</Text>
        <Image source={require("@/assets/icons/search.png")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: gapH(8),
    paddingVertical: gapV(12),
  },
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
