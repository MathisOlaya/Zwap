import { useAuth } from "@/context/AuthContext";
import { Button, Text, View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

// Responsive
import { font, width, height, gapH, gapV } from "@/utils/responsive";

// Components
import Header from "@/components/MainPage/header";
import ArticleDisplayer from "@/components/Articles/ArticleDisplayer";

// API
import { useInitialData } from "@/hooks/useInitialData";

export default function HomeScreen() {
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
      <Header />
      {/* ForYou Content */}
      <ArticleDisplayer title="Pour vous" articles={articlesRecommendation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: gapH(8),
    paddingVertical: gapV(12),
    gap: gapH(12),
  },
});
