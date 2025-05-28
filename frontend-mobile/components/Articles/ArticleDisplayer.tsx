// ReactNative
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Responsive
import { font, width, height, gapH, gapV } from "@/utils/responsive";

// Components
import ItalicTitle from "../Text/ItalicTitle";

// Types
import { Article } from "@/types/articles";

// Card
import ArticleCard from "./ArticleCard";

// Props
type Props = {
  title: string;
  articles: Array<Article>;
};

const ArticleDisplayer = (info: Props) => {
  // If articles are loading
  if (info.articles.length === 0) {
    return (
      <View style={styles.maincontainer}>
        <ItalicTitle>{info.title}</ItalicTitle>
        <Text style={{ textAlign: "center", paddingVertical: gapH(32) }}>Chargement...</Text>
      </View>
    );
  }
  return (
    <View style={styles.maincontainer}>
      <ItalicTitle>{info.title}</ItalicTitle>
      <ScrollView horizontal={true} contentContainerStyle={styles.articlescontainer} showsHorizontalScrollIndicator={false}>
        {info.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    paddingHorizontal: gapH(12),
    gap: gapH(4),
  },
  articlescontainer: {
    gap: gapH(18),
  },
});

export default ArticleDisplayer;
